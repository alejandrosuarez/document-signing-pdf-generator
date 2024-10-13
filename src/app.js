$(document).ready(function() {
  const formLabels = {
    en: {
      name: "Customer Name",
      company: "Customer Company",
      email: "Customer Email"
    },
    es: {
      name: "Nombre del Cliente",
      company: "Empresa del Cliente",
      email: "Correo del Cliente"
    }
  };

  let userData = {};
  let signatureDataUrl = ''; // Variable to store the signature image

  // Function to load templates and replace placeholders with user data, global JSON, and language-specific JSON content
  function fillTemplate(template, jsonData, globalData, userData) {
    let filledTemplate = template;
    const allData = { ...globalData, ...jsonData, ...userData }; // Merge all data sources
  
    // Add current date to the allData object
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    allData['CURRENT_DATE'] = currentDate;
  
    // Preserve the CUSTOMER_SIGNATURE_PATH if it exists
    if (userData.CUSTOMER_SIGNATURE_PATH) {
      allData['CUSTOMER_SIGNATURE_PATH'] = userData.CUSTOMER_SIGNATURE_PATH;
    }
  
    // Replace placeholders
    Object.keys(allData).forEach(function(key) {
      const placeholder = `{{${key}}}`;
      filledTemplate = filledTemplate.replaceAll(new RegExp(placeholder, 'g'), allData[key] || '');
    });
  
    return filledTemplate;
  }

  // Function to load global and language-specific content and templates, inject the content into the preview and document
  function loadContentAndTemplates(language, userData) {
    // Load global JSON data
    $.getJSON('/json/global.json', function(globalData) {
      // Load language-specific JSON data
      $.getJSON(`/json/${language}.json`, function(jsonData) {
        // Load document templates (Proposal, NDA, Data Protection)
        $.get('/templates/proposal_template.html', function(proposalTemplate) {
          $.get('/templates/nda_template.html', function(ndaTemplate) {
            $.get('/templates/data_protection_letter_template.html', function(dataProtectionTemplate) {
              // Preserve the customer signature path during reload
              const previousSignature = userData.CUSTOMER_SIGNATURE_PATH || '';
  
              // Fill each document template
              const filledProposal = fillTemplate(proposalTemplate, jsonData.documents[0].content, globalData, userData);
              const filledNDA = fillTemplate(ndaTemplate, jsonData.documents[1].content, globalData, userData);
              const filledDataProtection = fillTemplate(dataProtectionTemplate, jsonData.documents[2].content, globalData, userData);
  
              // Insert the filled documents into the preview, including the signature
              const combinedContent = `
                <div class="document">
                  ${filledProposal}
                </div>
                <div class="document">
                  ${filledNDA}
                </div>
                <div class="document">
                  ${filledDataProtection}
                </div>
              `;
              $('#document .content').html(combinedContent);
  
              // Insert the global variables (e.g., logo) into the preview
              $('#document .header img').attr('src', globalData.YOUR_COMPANY_LOGO_URL);
              $('#document .company-name').text(globalData.YOUR_COMPANY_NAME);
              $('#document .footer').html(`
                <p>${globalData.YOUR_COMPANY_NAME} - ${globalData.YOUR_COMPANY_ADDRESS} - ${globalData.YOUR_COMPANY_PHONE} - ${globalData.YOUR_COMPANY_EMAIL}</p>
                <p>Page <span class="page-number"></span></p>
              `);
  
              // Modal preview logic
              $('#preview-document').click(function() {
                const filledPreviewContent = `
                  <div class="container">
                    <div class="header">
                      <img src="${globalData.YOUR_COMPANY_LOGO_URL}" alt="${globalData.YOUR_COMPANY_NAME} Logo">
                      <div class="company-name">${globalData.YOUR_COMPANY_NAME}</div>
                    </div>
                    <div class="content">
                      <div class="document">
                        ${filledProposal}
                      </div>
                      <div class="document">
                        ${filledNDA}
                      </div>
                      <div class="document">
                        ${filledDataProtection}
                      </div>
                      <!--<p>Owner's Signature:</p>
                      <img src="${globalData.YOUR_SIGNATURE_PATH}" alt="Owner Signature" width="300px" height="150px" />
                      <p>Customer's Signature:</p>
                      <img id="customer-signature-preview" src="${previousSignature}" alt="Customer Signature" width="300px" height="150px" /> -->
                    </div>
                    <div class="footer">
                      <p>${globalData.YOUR_COMPANY_NAME} - ${globalData.YOUR_COMPANY_ADDRESS} - ${globalData.YOUR_COMPANY_PHONE} - ${globalData.YOUR_COMPANY_EMAIL}</p>
                      <!--<p>Page <span class="page-number"></span></p>-->
                    </div>
                  </div>
                `;
                $('#preview-content').html(filledPreviewContent);
                $('#previewModal').modal('show');
              });
  
              // Handle PDF generation
              $('#accept-document').click(function() {
                generatePDF(filledProposal, filledNDA, filledDataProtection, signatureDataUrl);
              });
            });
          });
        });
      });
    });
  }

  function generatePDF(proposal, nda, dataProtection, signature) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      format: 'a4', // Set the PDF size to A4
      unit: 'mm',
    });
  
    html2canvas(document.querySelector('#document'), {
      scale: 2,
      useCORS: true,
      logging: true,
      windowWidth: document.body.scrollWidth
    }).then(function(canvas) {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add the image to the PDF, split into pages if needed
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Save the final PDF
      pdf.save('Documents.pdf');
    });
  }

  // Update form labels and load content based on language change
  $('#language-select').change(function() {
    const selectedLang = $(this).val();

    // Update form labels
    $('#name-label').text(formLabels[selectedLang].name + ":");
    $('#company-label').text(formLabels[selectedLang].company + ":");
    $('#email-label').text(formLabels[selectedLang].email + ":");

    // Load and fill templates with the appropriate content
    loadContentAndTemplates(selectedLang, userData);
  }).trigger('change'); // Trigger the change event on page load to set default language and load content

  // Handle form input updates and update the preview dynamically
  $('#form input').on('input', function() {
    const name = $('#name').val();
    const company = $('#company').val();
    const email = $('#email').val();
  
    // Keep the customer signature in userData if it already exists
    userData = { 
      NAME: name, 
      COMPANY_NAME: company, 
      COMPANY_ADDRESS: email,
      CUSTOMER_SIGNATURE_PATH: userData.CUSTOMER_SIGNATURE_PATH // Preserve the signature path
    };
  
    // Reload templates with updated user data
    const selectedLang = $('#language-select').val();
    loadContentAndTemplates(selectedLang, userData);
  });

  // Initialize SVG canvas for signature
  var draw = SVG().addTo('#signature-pad').size(500, 150);
  var path;
  var drawing = false;

  // Mouse down to start drawing
  $('#signature-pad').on('mousedown touchstart', function(event) {
    drawing = true;
    var pos = getMousePosition(event);
    path = draw.path().fill('none').stroke({ width: 2, color: '#000' });
    path.plot(`M ${pos.x} ${pos.y}`);
  });

  // Mouse move to continue drawing
  $('#signature-pad').on('mousemove touchmove', function(event) {
    if (drawing) {
      var pos = getMousePosition(event);
      var plot = path.array().toString();
      plot += ` L ${pos.x} ${pos.y}`;
      path.plot(plot);
    }
  });

  // Mouse up to stop drawing and capture customer signature
  $('#signature-pad').on('mouseup touchend mouseleave', function() {
    drawing = false;
  
    const svgString = $('#signature-pad').html();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
  
    img.onload = function() {
      canvas.width = 500;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0);
      const customerSignatureDataUrl = canvas.toDataURL('image/png');  // Capture the signature as PNG
  
      // Store the customer signature in userData for placeholder replacement
      userData['CUSTOMER_SIGNATURE_PATH'] = customerSignatureDataUrl;
      //debug
      console.log('Customer signature data URL:', customerSignatureDataUrl);

  
      // Update the preview with the customer signature immediately
      $('#customer-signature-preview').attr('src', customerSignatureDataUrl);
      
      // Reload the templates with the updated user data to ensure the preview reflects the change live
      const selectedLang = $('#language-select').val();
      loadContentAndTemplates(selectedLang, userData);
    };
  
    img.src = url;
  });

  function getMousePosition(event) {
    var rect = document.getElementById('signature-pad').getBoundingClientRect();
    var clientX = event.clientX || event.originalEvent.touches[0].clientX;
    var clientY = event.clientY || event.originalEvent.touches[0].clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Clear Signature
  $('#clear-signature').click(function() {
    draw.clear();
    signatureDataUrl = '';  // Reset signature data
  });
});