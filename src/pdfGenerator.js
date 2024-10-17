// Importing jsPDF from the UMD CDN as a global variable
const { jsPDF } = window.jspdf;

// Function to generate the PDF from the HTML content
export function generatePDF(filledPreviewContent, signatureDataUrl) {
  const generateButton = document.getElementById('accept-document');
  
  // Disable the button to prevent multiple clicks
  generateButton.disabled = true;
  generateButton.innerText = 'Generating PDF...'; // Indicate loading state
  
  const pdf = new jsPDF({
    format: 'a4', // Set the PDF size to A4
    unit: 'mm',
  });

  // Ensure the content is fully rendered before capturing it
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.top = '-9999px';

  // Inject the filledPreviewContent including the signature
  const contentWithSignature = filledPreviewContent.replace(
    '{{CUSTOMER_SIGNATURE_PATH}}',
    `<img src="${signatureDataUrl}" alt="Customer Signature" width="300px" height="150px" />`
  );

  tempDiv.innerHTML = contentWithSignature;
  document.body.appendChild(tempDiv);

  // Temporarily disable dark mode
  const isDarkModeEnabled = document.body.classList.contains('dark-mode');
  if (isDarkModeEnabled) {
    document.body.classList.remove('dark-mode'); // Remove dark mode
  }

  setTimeout(() => {
    html2canvas(tempDiv, {
      scale: 1.5,  // Reduce scale to lower the size (1.5 instead of 2)
      useCORS: true,  // Allow cross-origin
      logging: true,
      windowWidth: document.body.scrollWidth, // Ensure it captures the full width
    }).then(function(canvas) {
      const imgData = canvas.toDataURL('image/jpeg', 0.8);  // Use JPEG for smaller size, set quality to 80%
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page of content
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if the content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the final PDF
      pdf.save('Document.pdf');

      // Restore dark mode if it was enabled
      if (isDarkModeEnabled) {
        document.body.classList.add('dark-mode');
      }
      
      // Clean up the temporary div
      document.body.removeChild(tempDiv);

      // Re-enable the button after PDF generation is done
      generateButton.disabled = false;
      generateButton.innerText = 'Generate PDF';
    }).catch(function(error) {
      console.error('Error generating PDF:', error);
      generateButton.disabled = false;  // Re-enable the button on error
      generateButton.innerText = 'Generate PDF';
    });
  }, 500);  // Add a small delay to ensure rendering is complete
}