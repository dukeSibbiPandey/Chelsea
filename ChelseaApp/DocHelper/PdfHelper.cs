using System;
using System.Collections.Generic;
using System.IO;
using ChelseaApp.Model;
using iText.Forms;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Action;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace ChelseaApp.DocHelper
{
    public class PdfHelper
    {
        public static void GeneratePdf(string dest, List<PdfFileModel> streams, string tocContent)
        {

            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(dest));
            Document doc = new Document(pdfDoc);
            pdfDoc.InitializeOutlines();
            PdfPageFormCopier formCopier = new PdfPageFormCopier();

            doc.SetTopMargin(100);
            doc.Add(new Paragraph("#TempText#"));
            doc.SetTopMargin(0);
            doc.Add(new AreaBreak(AreaBreakType.NEXT_PAGE));

            Dictionary<PdfFileModel, PdfDocument> filesToMerge = InitializeFilesToMerge(streams);
            Dictionary<int, PdfFileModel> toc = new Dictionary<int, PdfFileModel>();
            int page = 1;
            foreach (KeyValuePair<PdfFileModel, PdfDocument> entry in filesToMerge)
            {
                PdfDocument srcDoc = entry.Value;
                int numberOfPages = srcDoc.GetNumberOfPages();

                toc.Add(page, entry.Key);

                for (int i = 1; i <= numberOfPages; i++, page++)
                {
                    Text text = new Text(String.Format("Page {0}", page));
                    srcDoc.CopyPagesTo(i, i, pdfDoc, formCopier);

                    // Put the destination at the very first page of each merged document
                    if (i == 1)
                    {
                        text.SetDestination("p" + page);
                    }

                    doc.Add(new Paragraph(text).SetFixedPosition(page, 549, 810, 40)
                        .SetMargin(0)
                        .SetMultipliedLeading(1));
                }
            }

            //PdfDocument tocDocD = new PdfDocument(new PdfWriter(tocContent));
            //tocDoc.CopyPagesTo(1, 1, pdfDoc, formCopier);
            //tocDoc.Close();

            // Create a table of contents

            //Document tocDoc = new Document(tocDocD);
            float tocYCoordinate = 750;
            float tocXCoordinate = doc.GetLeftMargin();
            float tocWidth = pdfDoc.GetDefaultPageSize().GetWidth() - doc.GetLeftMargin() - doc.GetRightMargin();
            foreach (KeyValuePair<int, PdfFileModel> entry in toc)
            {
                Paragraph p = new Paragraph();
                p.AddTabStops(new TabStop(100, TabAlignment.LEFT));
                p.Add(entry.Value.Name);
                p.Add(new Tab());
                p.Add(entry.Value.MFG);
                p.Add(new Tab());
                p.Add(entry.Value.Part);
                p.Add(new Tab());
                p.Add(entry.Key.ToString());
                p.SetAction(PdfAction.CreateGoTo("p" + entry.Key));
                doc.Add(p.SetFixedPosition(pdfDoc.GetNumberOfPages(), tocXCoordinate, tocYCoordinate, tocWidth)
                    .SetMargin(0)
                    .SetMultipliedLeading(1));

                tocYCoordinate -= 20;
            }

            foreach (PdfDocument srcDoc in filesToMerge.Values)
            {
                srcDoc.Close();
            }

            doc.Close();
            //tocDoc.Close();
        }

        private static Dictionary<PdfFileModel, PdfDocument> InitializeFilesToMerge(List<PdfFileModel> streams)
        {
            Dictionary<PdfFileModel, PdfDocument> filesToMerge = new Dictionary<PdfFileModel, PdfDocument>();
            int cnt = 1;
            foreach (var file in streams)
            {
                //using (MemoryStream pdfStream = new MemoryStream())
                //{
                //    pdfStream.Write(mergByte, 0, mergByte.Length);

                //}
                //
                filesToMerge.Add(file, new PdfDocument(new PdfReader(file.FileTmpPath)));
                cnt = cnt + 1;

            }
            return filesToMerge;
        }
    }
}
