import { generatePDF } from './pdfGenerator.js';  // Import the generatePDF function
// Function to check if the user is logged in
function checkLoginStatus() {
  const session = localStorage.getItem('supabaseClient.auth.token');
  console.log('Session token found:', session); // Log session for debugging
  
  if (!session || session === 'null' || session === 'undefined') {
    console.log('No valid session found. Redirecting to login page...');
    window.location.href = 'login.html'; // Redirect to login if no session is found
  } else {
    console.log('User is logged in. Proceed to dashboard.');
  }
}

// Run the login status check when the page loads
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
});

// Handle logout button click
document.getElementById('logout-btn').addEventListener('click', function() {
  logoutUser();
});

// Logout function
function logoutUser() {
  // Remove the session token and all user-related data from localStorage
  localStorage.removeItem('supabaseClient.auth.token'); 
  localStorage.removeItem('user.name'); 
  localStorage.removeItem('user.email');
  localStorage.removeItem('user.company');
  localStorage.removeItem('user.uid');
  localStorage.removeItem('user.language');
  localStorage.removeItem('user.signature');
  
  // Redirect to login page after logout
  window.location.href = 'login.html';
}

$(document).ready(function() {
  
  // Show loading overlay immediately when the page is ready
  showLoadingOverlay();
  detectSystemDarkMode();  // Apply the correct mode on load

  const formLabels = {
    en: {
      name: "Customer Name",
      company: "Customer Company",
      email: "Customer Email",
      agree: "Print document",
      signature: "Customer Signature",
      choose: "Choose a language",
      documentTitle: "Document Signature",
      clearSignature: "Clear Signature",
      previewDocument: "Preview Document",
      submitButton: "Sign and Accept"
  },
  es: {
      name: "Nombre del Cliente",
      company: "Empresa del Cliente",
      email: "Correo del Cliente",
      agree: "Imprimir documento",
      signature: "Firma del Cliente",
      choose: "Elige un idioma",
      documentTitle: "Firma de Documento",
      clearSignature: "Limpiar Firma",
      previewDocument: "Vista Previa del Documento",
      submitButton: "Firmar y Aceptar"
  }
  };

  let userData = {
    NAME: '',
    COMPANY_NAME: '',
    COMPANY_ADDRESS: '',
    CUSTOMER_SIGNATURE_PATH: ''
  };

  let signatureDataUrl = '';  // Variable to store the signature image

  // Fill template function
  function fillTemplate(template, jsonData, globalData, userData) {
    let filledTemplate = template;
    const allData = { ...globalData, ...jsonData, ...userData };
    
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

  function showLoadingOverlay() {
    $('#loading-overlay').addClass('show');
  }
  
  // Hide the loading overlay
  function hideLoadingOverlay() {
    $('#loading-overlay').removeClass('show');
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
                
              // Create filledPreviewContent for both preview and PDF generation
              const filledPreviewContent = `
                <div class="container">
                  <div class="header">
                    <img src="${globalData.YOUR_COMPANY_LOGO_URL}" alt="${globalData.YOUR_COMPANY_NAME} Logo">
                    <div class="company-name">${globalData.YOUR_COMPANY_NAME}</div>
                  </div>
                  <div class="content">
                    <div class="document" style="page-break-after: always;">
                      ${filledProposal}
                    </div>
                    <div class="document" style="page-break-after: always;">
                      ${filledNDA}
                    </div>
                    <div class="document">
                      ${filledDataProtection}
                    </div>
                    <!--<p>Owner's Signature:</p>
                    <img src="${globalData.YOUR_SIGNATURE_PATH}" alt="Owner Signature" width="300px" height="150px" />
                    <p>Customer's Signature:</p>
                    <img id="customer-signature-preview" src="${previousSignature}" alt="Customer Signature" width="300px" height="150px" />-->
                  </div>
                  <div class="footer">
                    <p>${globalData.YOUR_COMPANY_NAME} - ${globalData.YOUR_COMPANY_ADDRESS} - ${globalData.YOUR_COMPANY_PHONE} - ${globalData.YOUR_COMPANY_EMAIL}</p>
                  </div>
                </div>
              `;
                
              // Insert the filled documents into the preview, including the signature
              const combinedContent = `
                <div class="document" style="page-break-after: always;">
                  ${filledProposal}
                </div>
                <div class="document" style="page-break-after: always;">
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
              `);
  
              // After everything is loaded and inserted:
              hideLoadingOverlay();  // Hide loading overlay when done

              // Now that the template is loaded, call the function to load the signature
              const signature = localStorage.getItem('user.signature') || '';
              loadSignaturePreview(signature);
  
              // Modal preview logic
              $('#preview-document').click(function() {
                  // Inject the initial content into the modal
                  $('#preview-content').html(filledPreviewContent);
              
                  // After the content is injected, check if there is a signature in localStorage
                  const signature = localStorage.getItem('user.signature') || '';
              
                  // If signature exists, update the `src` attribute of the image with the class `signature-preview`
                  if (signature) {
                      $('.signature-preview').attr('src', signature);
                  }
              
                  // Show the modal after ensuring the signature is injected
                  $('#previewModal').modal('show');
              });
  
              // Handle PDF generation
              $('#accept-document').click(function() {
                // Use the entire filledPreviewContent for PDF generation
                generatePDF(filledPreviewContent, signatureDataUrl);
              });
            });
          });
        });
      });
    });
  }

  function loadSignaturePreview(signature) {
    if (signature) {
        // Get all img elements with the class "signature-preview"
        const signatureElements = document.querySelectorAll('.signature-preview');

        // Set the signature image src to each img element
        signatureElements.forEach(function (element) {
            element.src = signature;  // Set the src attribute to the signature data URL
        });
    }
  }

  // Modal preview logic
  $('#upload-files-btn').click(function() {
      // Inject the initial content into the modal
      // Get the user UID from localStorage
      const signatureUserUid = 'http://react-secure-uploads-eosin.vercel.app/?userid=' + localStorage.getItem('user.uid') || '';
      // Get all img elements with the class "signature-preview"
      const uploadFilesIframe = document.getElementById('upload-files-iframe');

      // Set the signature image src to each img element
      uploadFilesIframe.src = signatureUserUid;  // Set the src attribute to the signature data URL

      // Show the modal after ensuring the signature is injected
      $('#uploadFilesModal').modal('show');
  });

  // Trigger loading content using saved language from localStorage, or default to 'en' if not set
  const savedLanguage = localStorage.getItem('user.language') || 'en';  // Load saved language or default to 'en'
  loadContentAndTemplates(savedLanguage, userData);

  // Language switch handling
  $('#language-select').change(function() {
    const selectedLang = $(this).val();
    
    // Update form labels based on language selection
    $('#name-label').text(formLabels[selectedLang].name + ":");
    $('#company-label').text(formLabels[selectedLang].company + ":");
    $('#email-label').text(formLabels[selectedLang].email + ":");
    $('#print-modal-content').text(formLabels[selectedLang].agree);
    $('#signature-label').text(formLabels[selectedLang].signature);
    $('#language-label').text(formLabels[selectedLang].choose + ":");
    $('#document-title').text(formLabels[selectedLang].documentTitle);
    $('#clear-signature').text(formLabels[selectedLang].clearSignature);
    $('#preview-document').text(formLabels[selectedLang].previewDocument);
    $('#previewModalLabel').text(formLabels[selectedLang].previewDocument);
    $('#submit-button').text(formLabels[selectedLang].submitButton);

    // Reload the templates with the selected language
    loadContentAndTemplates(selectedLang, userData);
  });

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
  var path = null; // Initialize path as null by default
  var drawing = false;

  function getCurrentStrokeColor() {
    return $('body').hasClass('dark-mode') ? '#ffffff' : '#000000';
  }

  // Mouse down to start drawing
  $('#signature-pad').on('mousedown touchstart', function(event) {
    drawing = true;
    var pos = getMousePosition(event);

    // Adjust the stroke color based on dark mode
    var strokeColor = getCurrentStrokeColor();
    path = draw.path().fill('none').stroke({ width: 2, color: strokeColor });
    path.plot(`M ${pos.x} ${pos.y}`);
    
    // Add the path to the drawnPaths array
    drawnPaths.push(path);
  });

  // Mouse move to continue drawing
  $('#signature-pad').on('mousemove touchmove', function(event) {
    if (drawing && path) {
      var pos = getMousePosition(event);
      var plot = path.array().toString();
      plot += ` L ${pos.x} ${pos.y}`;
      path.plot(plot);
    }
  });

  // Mouse up to stop drawing and capture customer signature
  $('#signature-pad').on('mouseup touchend mouseleave', function() {
    drawing = false;
    path = null;  // Reset path to null after drawing is finished

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

      // Store the customer signature in localStorage
      localStorage.setItem('user.signature', customerSignatureDataUrl);  // Save to localStorage

      // Store the customer signature in userData for placeholder replacement
      userData['CUSTOMER_SIGNATURE_PATH'] = customerSignatureDataUrl;
      console.log('Customer signature data URL:', customerSignatureDataUrl);

      // Update the preview with the customer signature immediately
      $('#customer-signature-preview').attr('src', customerSignatureDataUrl);

      // Reload the templates with the updated user data to ensure the preview reflects the change live
      const selectedLang = $('#language-select').val();
      loadContentAndTemplates(selectedLang, userData);
    };

    img.src = url;
  });

  // Mouse position helper
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

  // Function to toggle dark mode
  let drawnPaths = [];  // Array to store all drawn paths

  function toggleDarkMode() {
    $('body').toggleClass('dark-mode');
    localStorage.setItem('darkMode', $('body').hasClass('dark-mode') ? 'enabled' : 'disabled');
  
    // Get the current stroke color based on the mode
    const strokeColor = $('body').hasClass('dark-mode') ? '#ffffff' : '#000000';
  
    // Update the stroke color of all existing paths
    drawnPaths.forEach(function(p) {
      p.stroke({ color: strokeColor });
    });
  }

  // Signature Pad Drawing Logic (adjust stroke color based on mode)
  $('#signature-pad').on('mousedown touchstart', function(event) {
    drawing = true;
    var pos = getMousePosition(event);

    // Adjust the stroke color based on dark mode
    var strokeColor = getCurrentStrokeColor();
    path = draw.path().fill('none').stroke({ width: 2, color: strokeColor });
    path.plot(`M ${pos.x} ${pos.y}`);
    
    // Add the path to the drawnPaths array
    drawnPaths.push(path);
  });

  // Check system preferences for dark mode
  function detectSystemDarkMode() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const userPreference = localStorage.getItem('darkMode');

    if (userPreference === 'enabled' || (prefersDarkScheme && !userPreference)) {
      $('body').addClass('dark-mode');
    } else {
      $('body').removeClass('dark-mode');
    }
  }

  // Bind the dark mode toggle button
  $('#toggle-dark-mode').click(function() {
    toggleDarkMode();
  });

  $('#print-modal-content').click(function() {
    // Select the content inside the modal that you want to print
    const printContent = document.getElementById('preview-content').innerHTML;
    
    // Create a new window or tab for printing
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10px;
            }
            .header img {
              width: 100px;
            }
            * {
              box-sizing: border-box;
              font-family: "VT323", monospace;
              color: #1f1f1f;
            }
            h1 {
              font-size: 20px;
            }
            h2 {
              font-size: 16px;
            }
            p {
              font-size: 12px;
            }
            ul {
              padding-left: 20px;
            }
            li {
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          ${printContent}  <!-- Inject the modal content here -->
          <script>
            window.onload = function() {
              window.print();  // Automatically trigger the print dialog
              window.onafterprint = window.close;  // Close the window after printing
            };
          </script>
        </body>
      </html>
    `);
    
    newWindow.document.close();  // Close the document to finish writing
  });
});