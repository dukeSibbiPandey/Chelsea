import { PDFDocument } from 'pdf-lib';
export class PdfHelperService {
  static CreatePdfHeader = async (fileUrl: string, fileData: any): Promise<Blob> => {
    const formPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer())
    // Fetch the Mario image
    const marioUrl = '../../../../../assets/images/Chelsea-Logo.png';
    const marioImageBytes = await fetch(marioUrl).then(res => res.arrayBuffer())
    // Load a PDF with form fields
    const pdfDoc = await PDFDocument.load(formPdfBytes)
    if (pdfDoc) {
      const pages = pdfDoc.getPages();
      // Embed the Mario and emblem images
      const marioImage = await pdfDoc.embedPng(marioImageBytes)

      pages.forEach(page => {
        const { width, height } = page.getSize()
        page.scaleContent(1.0, 0.9)
        let w = 60;
        let size = 7;
        let valsize = 7;
        try {
          page.drawImage(marioImage, { x: 30, y: height - 15, width: 18, height: 95})
          // Fill in the basic info fields
          page.drawText(`Type`, { x: w, y: height + 70, size: size })
          page.drawText(`${fileData.name}`, { x: w + 30, y: height + 70, size: valsize })

          page.drawText(`Voltage`, { x: w, y: height + 50, size: size });
          page.drawText(`${fileData.volt}`, { x: w + 30, y: height + 50, size: valsize })

          page.drawText(`Lamp`, { x: w, y: height + 30, size: size });
          page.drawText(`${fileData.lamp}`, { x: w + 30, y: height + 30, size: valsize })

          page.drawText(`Dim`, { x: w, y: height + 10, size: size });
          page.drawText(`${fileData.dim}`, { x: w + 30, y: height + 10, size: valsize })

          page.drawText(`Runs`, { x: w, y: height - 10, size: size });
          page.drawText(`${fileData.runs}`, { x: w + 30, y: height - 10, size: valsize })

          page.drawText(`${fileData.part}`, { x: 350, y: height + 70, size: size + 3, maxWidth: 30 });
          page.drawText(fileData.description, { x: 350, y: height + 50, size: size + 3, maxWidth: 30 });
          page.drawLine({ start: { x: 0, y: height - 31 }, end: { x: width, y: height - 31 }, thickness: 1, opacity: 0.5 })
        }
        catch { }
      });
      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      let blobDoc = new Blob([pdfBytes], { type: 'application/pdf' });
      return blobDoc;
    }
    return null;
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
  }
}