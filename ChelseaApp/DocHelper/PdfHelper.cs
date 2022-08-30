using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Chelsea.Repository;
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
using iText.Kernel.Pdf.Navigation;
using iText.Kernel.Utils;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace ChelseaApp.DocHelper
{
    public class PdfHelper
    {
        public static void CreateBookMarksPdf(string dest, List<PdfFileModel> streams)
        {
            PdfDocument pdfDoc = new PdfDocument(new PdfWriter(dest));
            List<BookmarkModel> srcDocs = new List<BookmarkModel>();
            foreach (PdfFileModel stream in streams)
            {
                PdfDocument srcDoc = new PdfDocument(new PdfReader(stream.FileTmpPath));
                int numberOfPages = srcDoc.GetNumberOfPages();
                srcDocs.Add(new BookmarkModel() { PdfDoc = srcDoc, NumberOfPages = numberOfPages, Name = stream.Name, Files = stream.Files });
            }

            /*PdfMerger merger = new PdfMerger(pdfDoc);
            merger.SetCloseSourceDocuments(true);
            foreach (BookmarkModel stream in srcDocs)
            {
                merger.Merge(stream.PdfDoc, 1, stream.NumberOfPages);
            }*/

            PdfOutline rootOutline = pdfDoc.GetOutlines(false);

            int page = 1;
            //List<string> mainPages = srcDocs.Select(t => t.ParentName).Distinct().ToList();
            foreach (var doc in srcDocs)
            {
                //var files = srcDocs.Where(t => t.ParentName == doc.Name).ToList();
                PdfOutline mainDoc = rootOutline.AddOutline(doc.Name);
                mainDoc.AddDestination(PdfExplicitDestination.CreateFit(pdfDoc.GetPage(page)));

                if (doc.Files != null && doc.Files.Any())
                {
                    foreach (FileModel file in doc.Files)
                    {
                        PdfOutline link1 = mainDoc.AddOutline(System.IO.Path.GetFileNameWithoutExtension(file.OrgFileName));
                        link1.AddDestination(PdfExplicitDestination.CreateFit(pdfDoc.GetPage(page)));
                        page += file.NumberOfPages;
                    }
                }
                else
                {
                    page += doc.NumberOfPages;
                }
            }

            pdfDoc.Close();
        }
        public static void GeneratePdf(string dest, List<PdfFileModel> streams, string tocContent, SubmittalList submittalList)
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

            //PdfDocument tocDoc = new PdfDocument(new PdfWriter(tocContent));
            PdfDocument tocDoc = new PdfDocument(new PdfReader(tocContent));
            tocDoc.CopyPagesTo(1, 1, pdfDoc, formCopier);
            tocDoc.Close();

            // Create a table of contents
            float tocYCoordinate = 530;
            float tocXCoordinate = doc.GetLeftMargin();
            float defaultWidth = pdfDoc.GetDefaultPageSize().GetWidth();
            float defaultHeight = pdfDoc.GetDefaultPageSize().GetHeight();
            int pages = pdfDoc.GetNumberOfPages();
            float tocWidth = defaultWidth - doc.GetLeftMargin() - doc.GetRightMargin();
            int numtoc = 0;
            Paragraph ptDate = new();
            ptDate.SetFontSize(8)
                //.SetBold()
                .Add(submittalList.SubmittedDate?.ToString("MMM dd,yyyy"));
            doc.Add(ptDate.SetFixedPosition(pages, tocXCoordinate + 20, defaultHeight - 85, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));
            Paragraph ptTransmittedFor = new();
            ptTransmittedFor.SetFontSize(8)
                //.SetBold()
                .Add(submittalList.Status);
            doc.Add(ptTransmittedFor.SetFixedPosition(pages, tocXCoordinate + 10, tocYCoordinate + 100, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));
            Paragraph ptproject = new();
            ptproject.SetFontSize(8)
                //.SetBold()
                .Add(submittalList.JobName);
            doc.Add(ptproject.SetFixedPosition(pages, 46, defaultHeight -135, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));
            Paragraph ptquote = new();
            ptquote.SetFontSize(8)
                // .SetBold()
                .Add(submittalList.Submittals);
            doc.Add(ptquote.SetFixedPosition(pages, 245, defaultHeight - 135, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));

            Paragraph ptadress = new();
            ptadress.SetFontSize(6)
                // .SetBold()
                .Add(submittalList.AddressLine1+" "+ submittalList.AddressLine1 + ", " + submittalList.State + ", " + submittalList.City + " " + submittalList.Zip);
            doc.Add(ptadress.SetFixedPosition(pages, 440, defaultHeight - 65, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));

            Paragraph ptphone = new();
            ptphone.SetFontSize(8)
                // .SetBold()
                .Add(submittalList.Phone);
            doc.Add(ptphone.SetFixedPosition(pages, 472, defaultHeight - 73, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));

            Paragraph ptfax = new();
            ptfax.SetFontSize(8)
                //.SetBold()
                .Add("NA");
            doc.Add(ptfax.SetFixedPosition(pages, 550, defaultHeight - 73, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));

            Paragraph ptcity = new();
            ptcity.SetFontSize(8)
                //.SetBold()
                .Add(submittalList.State + " " + submittalList.City);
            doc.Add(ptcity.SetFixedPosition(pages, 445, defaultHeight - 135, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));

            Paragraph ptPhone = new();
            ptPhone.SetFontSize(8)
                //.SetBold()
                .Add(submittalList.Phone);
            doc.Add(ptPhone.SetFixedPosition(pages, 477, defaultHeight - 145, tocWidth)
                 .SetMargin(0)
                    .SetMultipliedLeading(1));


            foreach (KeyValuePair<int, PdfFileModel> entry in toc)
            {
                if (numtoc == 0)
                {
                    numtoc++; continue;
                }
                    
                Paragraph p = new Paragraph();
                p.SetFontSize(8);
                p.Add(entry.Value.Name);
                p.Add(new Tab());
                if (!string.IsNullOrEmpty(entry.Value.MFG))
                {
                    p.AddTabStops(new TabStop(130, TabAlignment.LEFT));
                    p.Add(entry.Value.MFG);
                    p.Add(new Tab());
                }
                if (!string.IsNullOrEmpty(entry.Value.Part))
                {
                    p.AddTabStops(new TabStop(300, TabAlignment.LEFT));
                    Text text = new Text(entry.Value.Part)
                    .SetFontColor(ColorConstants.BLUE)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetHorizontalAlignment(HorizontalAlignment.CENTER);                    
                    p.Add(text);
                }
                
                //p.Add(new Tab());
                //p.Add(entry.Key.ToString());
                p.SetAction(PdfAction.CreateGoTo("p" + entry.Key));
                
                doc.Add(p.SetFixedPosition(pages, tocXCoordinate+10, tocYCoordinate, tocWidth)
                    .SetMargin(0)
                    .SetMultipliedLeading(1));

                tocYCoordinate -= 20;
                numtoc++;
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
            //CreateBookMarksPdf(dest, streams);
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
