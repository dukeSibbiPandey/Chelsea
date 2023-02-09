import { async } from '@angular/core/testing';
import { lineSplit, StandardFonts, PDFDocument, degrees, PDFPage } from 'pdf-lib';
export class PdfHelperService {
  static CreatePdfHeader = async (fileUrl: string, fileData: any): Promise<Blob> => {
    const formPdfBytes = await PdfHelperService.GetPdfBytes(fileUrl);
    return PdfHelperService.SetPdfHeader(formPdfBytes, fileData);
  };
  static GetPdfBytes = async (url: string): Promise<ArrayBuffer> => {
    const formPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    return formPdfBytes;
  };
  static SetPdfHeader = async (fileB: ArrayBuffer, fileData: any): Promise<Blob> => {
    // Fetch the Mario image
    const marioUrl = '../../../../../assets/images/Chelsea-Logo.png?123';
    const marioImageBytes = await fetch(marioUrl).then(res => res.arrayBuffer())
    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(fileB)
    if (pdfDoc) {
      const pages = pdfDoc.getPages();
      // Embed the Mario and emblem images
      const marioImage = await pdfDoc.embedPng(marioImageBytes)
      var font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      let size = 7+2;
      //let count = 0;

      let partobj = PdfHelperService.wrapText(fileData.part.replaceAll("\n", " "), 52, font, 2.3);
      let pageinfo = [];
      pages.forEach((page,index) => {
        const { width, height } = page.getSize()
        let angle = page.getRotation().angle;
        let scaled_diff = page.getSize();
        let isLandscape = width > height;
        //if (isLandscape)
        //  page.scaleContent(1.0, 0.87)
        //else
         // page.scaleContent(1.0, 0.9)
          scaled_diff = PdfHelperService.ResizePage1(page)
        let cw = (width / 2 - scaled_diff.width * 2);
        let xw = cw - (cw + cw / 2)
        let ch = (height / 2 - scaled_diff.height * 2);
        let yh = ch - (ch + ch / 2)
        let w = xw+30;
        let valsize = 7+2;
        try {
          const d = (a:number) => {
            if (a > 360) {
               a = a - 360;
              return (d(a));
            }
            else
              return a;
          }
          angle = d(angle);
          pageinfo.push(angle);
          if (angle == 90 && angle % 90 == 0) {
            w = xw - 10;
            let heightleble = 70;
            let gapinheight = 14;
            let gapinwidth = 14;
            // page.drawImage(marioImage, { x: 90 + xw, y: -30, width: 15, height: 70, rotate: degrees(angle) })
            page.drawImage(marioImage, { x: 15, y: yh, width: 15, height: 70, rotate: degrees(angle) })
            page.drawText(`TYPE`, { x: xw-14 , y: yh + 45, size: size, rotate: degrees(angle)})
            page.drawText(`:${fileData.name?.toUpperCase()}`, { x: xw - 14, y: yh + 45 + 30, size: size, rotate: degrees(angle) })
            page.drawLine({ start: { x: xw - 11, y: yh + 45 + 30 + 3 }, end: { x: xw - 11, y: 300 }, thickness: 1, opacity: 1 });

            page.drawText(`VOLT`, { x: xw, y: yh + 45, size: size, rotate: degrees(angle) });
            page.drawText(`:${fileData.volt?.toUpperCase()}`, { x: xw, y: yh + 45 + 30, size: size, rotate: degrees(angle) })
            page.drawLine({ start: { x: xw + 3, y: yh + 45 + 30 + 3 }, end: { x: xw + 3, y: 300 }, thickness: 1, opacity: 1 });

            page.drawText(`LAMP`, { x: xw + 14, y: yh + 45, size: size, rotate: degrees(angle) });
            page.drawText(`:${fileData.lamp?.toUpperCase()}`, { x: xw + 14, y: yh + 45 + 30, size: size, rotate: degrees(angle) })
            page.drawLine({ start: { x: xw + 17, y: yh + 45 + 30 + 3 }, end: { x: xw + 17, y: 300 }, thickness: 1, opacity: 1 });

            page.drawText(`DIM`, { x: xw + 28, y: yh + 45, size: size, rotate: degrees(angle) });
            page.drawText(`:${fileData.dim?.toUpperCase()}`, { x: xw + 28, y: yh + 45 + 30, size: size, rotate: degrees(angle) });
            page.drawLine({ start: { x: xw + 31, y: yh + 45 + 30 + 3 }, end: { x: xw + 31, y: 300 }, thickness: 1, opacity: 1 });

            page.drawText(`RUNS`, { x: xw + 42, y: yh + 45, size: size, rotate: degrees(angle) });
            page.drawText(`:${fileData.runs?.toUpperCase()}`, { x: xw + 42, y: yh + 45 + 30, size: size, rotate: degrees(angle) });
            page.drawLine({ start: { x: xw + 45, y: yh + 45 + 30 + 3 }, end: { x: xw + 45, y: 300 }, thickness: 1, opacity: 1 });

            page.drawText(`${fileData.part?.toUpperCase()}`, { x: xw-10, y: (height / 2) + (yh * -1), size: valsize, rotate: degrees(angle) , maxWidth: Math.floor(width / 2) - 30, lineHeight: 10, wordBreaks: ['-', ' ', '/', '_'] });
            let hight = partobj.count * 10 > 10 ? ((xw + 10) + (partobj.count * 10)) : xw + 10
            page.drawText(fileData.description?.toUpperCase(), { x: hight, y: (height / 2) + (yh * -1), size: valsize, rotate: degrees(angle), maxWidth: Math.floor(width / 2) - 30, lineHeight: 10 });
            page.drawLine({ start: { x: 25, y: yh * 2 }, end: { x: 25, y: height + (yh * -2) }, thickness: 1, opacity: 0.5 })
          } else {
            page.drawImage(marioImage, { x: xw, y: height + 10, width: 15, height: 70 })
            let heightleble = 70;
            let gapinheight = 14;
            let f = font;
            // Fill in the basic info fields
            page.drawText(`TYPE`, { x: w, y: height + heightleble, size: size })
            page.drawText(`:${fileData.name?.toUpperCase()}`, { x: w + 30, y: height + heightleble, size: valsize, })
            page.drawLine({ start: { x: w + 33, y: height + (heightleble - 3) }, end: { x: w + 200, y: height + (heightleble - 3) }, thickness: 1, opacity: 1 });
            heightleble = heightleble - gapinheight;

            page.drawText(`VOLT`, { x: w, y: height + heightleble, size: size });
            page.drawText(`:${fileData.volt?.toUpperCase()}`, { x: w + 30, y: height + heightleble, size: valsize })
            page.drawLine({ start: { x: w + 33, y: height + (heightleble - 3) }, end: { x: w + 200, y: height + (heightleble - 3) }, thickness: 1, opacity: 1 });
            heightleble = heightleble - gapinheight;

            page.drawText(`LAMP`, { x: w, y: height + heightleble, size: size });
            page.drawText(`:${fileData.lamp?.toUpperCase()}`, { x: w + 30, y: height + heightleble, size: valsize })
            page.drawLine({ start: { x: w + 33, y: height + (heightleble - 3) }, end: { x: w + 200, y: height + (heightleble - 3) }, thickness: 1, opacity: 1 })
            heightleble = heightleble - gapinheight;

            page.drawText(`DIM`, { x: w, y: height + heightleble, size: size });
            page.drawText(`:${fileData.dim?.toUpperCase()}`, { x: w + 30, y: height + heightleble, size: valsize })
            page.drawLine({ start: { x: w + 33, y: height + (heightleble - 3) }, end: { x: w + 200, y: height + (heightleble - 3) }, thickness: 1, opacity: 1 })
            heightleble = heightleble - gapinheight;

            page.drawText(`RUNS`, { x: w, y: height + heightleble, size: size });
            page.drawText(`:${fileData.runs?.toUpperCase()}`, { x: w + 30, y: height + heightleble, size: valsize });
            page.drawLine({ start: { x: w + 33, y: height + (heightleble - 3) }, end: { x: w + 200, y: height + (heightleble - 3) }, thickness: 1, opacity: 1 })
            heightleble = heightleble - gapinheight;

            page.drawText(`${fileData.part?.toUpperCase()}`, { x: (width / 2) + (xw * -1), y: height + 70, size: valsize, maxWidth: Math.floor(width / 2) - 30, lineHeight: 10, wordBreaks: ['-', ' ', '/', '_'] });
            let hight = partobj.count * 10 > 10 ? ((height + 60) - (partobj.count * 10)) : height + 50
            page.drawText(fileData.description?.toUpperCase(), { x: (width / 2) + (xw * -1), y: hight, size: valsize, maxWidth: Math.floor(width / 2) - 30, lineHeight: 10 });
            page.drawLine({ start: { x: xw * 2, y: height }, end: { x: width + (xw * -2), y: height }, thickness: 1, opacity: 0.5 })
          }
         
        }

        catch { }
      });
      // Serialize the PDFDocument to bytes (a Uint8Array)
      PdfHelperService.SetPageInfo(pageinfo);
      const pdfBytes = await pdfDoc.save();
      let blobDoc = new Blob([pdfBytes], { type: 'application/pdf' });
      console.log("Pdf file print " + new Date().toLocaleTimeString());
      return blobDoc;
    }
    return null;
  }

  /*
  * Using font.widthOfTextAtSize transform text adding \n to break lines
  * if width of text is bigger than the width passed as parameter
  * and return the text with the line breaks
  * @param text: string
  * @param width: number
  * @param font: font
  * @param fontSize: number
  * @returns string
  */
  static wrapText = (text, width, font, fontSize) => {
    let paragraphs = [];
    let text1 = text;
    while (text1.length > width) {
      let text = text1.substring(0, width)
      let testWidth = font.widthOfTextAtSize(text, fontSize);
      let minwi = width;
      while (testWidth > width) {
        minwi--;
        testWidth = font.widthOfTextAtSize(text1.substring(0, minwi), fontSize);
      }
      // if (minwi != width) 
      paragraphs.push(text1.substring(0, minwi).trim());
      text1 = text1.slice(minwi)
    }
    let testWidth = font.widthOfTextAtSize(text1, fontSize);
    let minwi = width;
    while (testWidth > width) {
      minwi--;
      testWidth = font.widthOfTextAtSize(text1.substring(0, minwi), fontSize);
    }
    if (minwi != width) {
      paragraphs.push(text1.substring(0, minwi).trim());
      text1 = text1.slice(minwi);
    }
    paragraphs.push(text1.trim());

    return {
      text: paragraphs.join('\n'), count: paragraphs.length
    };
  }
  static RemoveDataLocalStorage = () => {
    var arr = []; // Array to hold the keys
    // Iterate over localStorage and insert the keys that meet the condition into arr
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).startsWith('toolData-')) {
        arr.push(localStorage.key(i));
      }
    }

    // Iterate over arr and remove the items by key
    for (var i = 0; i < arr.length; i++) {
      localStorage.removeItem(arr[i]);
    }
    PdfHelperService.SetDefaultDataLocalStorage();
  }
  static SetDefaultDataLocalStorage = () => {
    let defaultColor = { "R": 0, "G": 0, "B": 255, "A": 1 }
    localStorage.setItem("toolData-AnnotationCreateTextHighlight",
      JSON.stringify({
        "Opacity": 1,
        "StrokeColor": { "R": 255, "G": 255, "B": 0, "A": 1 }
      }));
    localStorage.setItem("toolData-AnnotationCreateFreeHand",
      JSON.stringify({
        "StrokeColor": defaultColor,
        "StrokeThickness": 1, "Opacity": 1
      }));
    localStorage.setItem("toolData-AnnotationCreateRectangle",
      JSON.stringify({
        "StrokeColor": defaultColor,
        "FillColor": { "R": 0, "G": 0, "B": 0, "A": 0 },
        "StrokeThickness": 1, "Opacity": 1
      }));
    localStorage.setItem("toolData-AnnotationCreateLine",
      JSON.stringify({
        "StrokeColor": defaultColor,
        "FillColor": { "R": 0, "G": 0, "B": 0, "A": 0 },
        "StrokeThickness": 1, "Opacity": 1
      }));
    localStorage.setItem("toolData-AnnotationCreateFreeText",
      JSON.stringify({
        "StrokeColor": { "R": 0, "G": 0, "B": 0, "A": 1 },
        "FillColor": { "R": 0, "G": 0, "B": 0, "A": 0 },
        "StrokeThickness": 0, "Opacity": 1,
        "TextColor": defaultColor, "FontSize": "9pt"
      }));
  }
  static ReOrderPages = (pdfdoc: PDFDocument, from: number, to: number) => {
    const pages = pdfdoc.getPages();
    pdfdoc.removePage(from - 1);
    pdfdoc.insertPage(to - 1, pages[from - 1]);
  }
  static DeletePages = (pdfdoc: PDFDocument, pageNumber: number) => {
    const pages = pdfdoc.getPages();
    pdfdoc.removePage(pageNumber - 1);
  }
  static PagesRotate = (pdfdoc: PDFDocument, pageNumber: number, angle: number) => {
    const page = pdfdoc.getPages()[pageNumber - 1];
    page.setRotation(degrees(page.getRotation().angle + angle));
  }
  static DoReOrderPages = async (fbytes: ArrayBuffer, from: number, to: number): Promise<Blob> => {
    const pdfDoc = await PDFDocument.load(fbytes);
    PdfHelperService.ReOrderPages(pdfDoc, from, to);
    const pdfBytes = await pdfDoc.save();
    let blobDoc = new Blob([pdfBytes], { type: 'application/pdf' });
    return blobDoc;
  }
  static DoPagesRotate = async (fbytes: ArrayBuffer, pageNumber: number, angle: number): Promise<Blob> => {
    const pdfDoc = await PDFDocument.load(fbytes);
    PdfHelperService.PagesRotate(pdfDoc, pageNumber, angle);
    const pdfBytes = await pdfDoc.save();
    let blobDoc = new Blob([pdfBytes], { type: 'application/pdf' });
    return blobDoc;
  }
  static DoDeletePages = async (fbytes: ArrayBuffer, pageNumber: number): Promise<Blob> => {
    const pdfDoc = await PDFDocument.load(fbytes);
    PdfHelperService.DeletePages(pdfDoc, pageNumber);
    const pdfBytes = await pdfDoc.save();
    let blobDoc = new Blob([pdfBytes], { type: 'application/pdf' });
    return blobDoc;
  }
  static ResizePage = (page: PDFPage, new_size: any) => {
    debugger;
    const new_size_ratio = Math.round((new_size.width / new_size.height) * 100);
    const { width, height } = page.getMediaBox();
    const size_ratio = Math.round((width / height) * 100);
    if (Math.abs(new_size_ratio - size_ratio) > 3) {
      // Change page size
      page.setSize(new_size.width, new_size.height);
      const scale_content = Math.min(new_size.width / width, new_size.height / height);
      // Scale content
      page.scaleContent(scale_content, scale_content);
      const scaled_diff = {
        width: Math.round(new_size.width - scale_content * width),
        height: Math.round(new_size.height - scale_content * height),
      };
      // Center content in new page format
      page.translateContent(Math.round(scaled_diff.width / 2), Math.round(scaled_diff.height / 2));
    } else {
      page.scale(new_size.width / width, new_size.height / height);
    }
  }
  static ResizePage1 = (page: PDFPage) => {
    const { width, height } = page.getMediaBox();
    const size_ratio = Math.round((width / height) * 100);
    const scale_content = width> height ? 0.7:0.8;

    page.scaleContent(scale_content, scale_content);
    const scaled_diff = {
      width: Math.round(width - scale_content * width),
      height: Math.round(height - scale_content * height),
    };
    // Center content in new page format
    page.translateContent(Math.round(scaled_diff.width / 2), Math.round(scaled_diff.height / 2));
    return scaled_diff;
  }
  static SetPageInfo = (pagedata) => {
    sessionStorage.removeItem('pageInfo');
    sessionStorage.setItem('pageInfo',JSON.stringify(pagedata));
  }
  static GetPageInfo = () => {
    const pageinfo = sessionStorage.getItem('pageInfo');
    if (pageinfo)
      return JSON.parse(pageinfo);
  }

}
