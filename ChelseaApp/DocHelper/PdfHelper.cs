using System;
using System.Collections.Generic;
using System.IO;
using ChelseaApp.Model;
using iText.Forms;
using iText.IO.Font.Constants;
using iText.Kernel.Colors;
using iText.Kernel.Events;
using iText.Kernel.Font;
using iText.Kernel.Geom;
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

            // Initialize a resultant document outlines in order to copy outlines from the source documents.
            // Note that outlines still could be copied even if in destination document outlines
            // are not initialized, by using PdfMerger with mergeOutlines vakue set as true
            pdfDoc.InitializeOutlines();

            // Copier contains the additional logic to copy acroform fields to a new page.
            // PdfPageFormCopier uses some caching logic which can potentially improve performance
            // in case of the reusing of the same instance.
            PdfPageFormCopier formCopier = new PdfPageFormCopier();

            // Copy all merging file's pages to the result pdf file
            Dictionary<PdfFileModel, PdfDocument> filesToMerge = InitializeFilesToMerge(streams);
            Dictionary<int, String> toc = new Dictionary<int, String>();
            int page = 1;
            foreach (KeyValuePair<PdfFileModel, PdfDocument> entry in filesToMerge)
            {
                PdfDocument srcDoc = entry.Value;
                int numberOfPages = srcDoc.GetNumberOfPages();

                toc.Add(page, entry.Key.Name);

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

            //PdfDocument tocDoc = new PdfDocument(new PdfWriter(tocContent));
            PdfDocument tocDoc = new PdfDocument(new PdfReader(tocContent));
            tocDoc.CopyPagesTo(1, 1, pdfDoc, formCopier);
            tocDoc.Close();

            // Create a table of contents
            float tocYCoordinate = 750;
            float tocXCoordinate = doc.GetLeftMargin();
            float tocWidth = pdfDoc.GetDefaultPageSize().GetWidth() - doc.GetLeftMargin() - doc.GetRightMargin();
            foreach (KeyValuePair<int, String> entry in toc)
            {
                Paragraph p = new Paragraph();
                p.AddTabStops(new TabStop(500, TabAlignment.LEFT, new DashedLine()));
                p.Add(entry.Value);
                p.Add(new Tab());
                p.Add(entry.Key.ToString());
                p.SetAction(PdfAction.CreateGoTo("p" + entry.Key));
                doc.Add(p.SetFixedPosition(pdfDoc.GetNumberOfPages(), tocXCoordinate, tocYCoordinate, tocWidth)
                    .SetMargin(0)
                    .SetMultipliedLeading(1));

                tocYCoordinate -= 20;
            }

            int totalPage = pdfDoc.GetNumberOfPages();
            // var lastPage = pdfDoc.GetPage(totalPage);
            pdfDoc.MovePage(totalPage, 2);
            //pdfDoc.RemovePage(totalPage + 1);

            foreach (PdfDocument srcDoc in filesToMerge.Values)
            {
                srcDoc.Close();
            }

            doc.Close();
        }

        private static Dictionary<PdfFileModel, PdfDocument> InitializeFilesToMerge(List<PdfFileModel> streams)
        {
            Dictionary<PdfFileModel, PdfDocument> filesToMerge = new Dictionary<PdfFileModel, PdfDocument>();
            int cnt = 1;
            foreach (var file in streams)
            {
                filesToMerge.Add(file, new PdfDocument(new PdfReader(file.FileTmpPath)));
                cnt = cnt + 1;

            }
            return filesToMerge;
        }

        public static void ManipulatePdf(PdfFileModel model, string source, String dest)
        {
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(source), new PdfWriter(dest));
            Document doc = new Document(pdfDoc);

            Paragraph nheader = new Paragraph()
                    .SetFont(PdfFontFactory.CreateFont(StandardFonts.HELVETICA))
                    .SetFontSize(14)
                    .SetFontColor(ColorConstants.BLACK)
                    .SetMarginTop(10)
                    .Add(model.Name)
                    .Add(model.Status)
                    .Add(new Tab())
                    .Add(model.MFG)
                    .Add(model.Part)
                    .Add(new Tab())
                    .Add(model.Description);

            for (int i = 1; i <= pdfDoc.GetNumberOfPages(); i++)
            {
                Rectangle pageSize = pdfDoc.GetPage(i).GetPageSize();
                float x = pageSize.GetWidth() / 2;
                float y = pageSize.GetTop() - 20;
                doc.ShowTextAligned(nheader, x, y, i, TextAlignment.LEFT, VerticalAlignment.BOTTOM, 0);
            }

            doc.Close();
        }
    }
}
