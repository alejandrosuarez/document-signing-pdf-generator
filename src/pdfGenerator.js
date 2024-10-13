// Importing jsPDF from the UMD CDN as a global variable
const { jsPDF } = window.jspdf;

// Function to generate the PDF from the HTML content
export function generatePDF() {
  const pdf = new jsPDF({
    format: 'a4', // Set the PDF size to A4
    unit: 'mm',
  });

  html2canvas(document.querySelector('#document'), {
    scale: 2,  // Scale the image for better quality
    useCORS: true,  // Allow cross-origin
    logging: true,
    windowWidth: document.body.scrollWidth, // Ensure it captures the full width
  }).then(function(canvas) {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add the first page of content
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add more pages if the content overflows
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the final PDF
    pdf.save('Document.pdf');
  });
}