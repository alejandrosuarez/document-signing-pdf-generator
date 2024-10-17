// Importing jsPDF from the UMD CDN as a global variable
const { jsPDF } = window.jspdf;

// Function to generate the PDF from the HTML content
export function generatePDF(filledPreviewContent, signatureDataUrl) {
  const pdf = new jsPDF({
    format: 'a4', // Set the PDF size to A4
    unit: 'mm',
  });

  // Ensure the content is fully rendered before capturing it
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.top = '-9999px';
  tempDiv.innerHTML = filledPreviewContent;
  document.body.appendChild(tempDiv);

  setTimeout(() => {
    html2canvas(tempDiv, {
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
      
      // Clean up the temporary div
      document.body.removeChild(tempDiv);
    }).catch(function(error) {
      console.error('Error generating PDF:', error);
    });
  }, 500);  // Add a small delay to ensure rendering is complete
}