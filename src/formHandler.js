// Initialize Supabase in formHandler.js (if not already initialized)
let SUPABASE_URL;
let SUPABASE_ANON_KEY;

if (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    // Running on Vercel (production environment)
    SUPABASE_URL = process.env.SUPABASE_URL;
    SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
} else if (typeof window !== 'undefined' && window.env) {
    // Running locally (development environment with hardcoded-env.js)
    SUPABASE_URL = window.env.SUPABASE_URL;
    SUPABASE_ANON_KEY = window.env.SUPABASE_ANON_KEY;
} else {
    console.error("Supabase configuration not found!");
}

// Function to load form data from localStorage and populate fields
function loadFormData() {
    const name = localStorage.getItem('user.name') || '';
    const company = localStorage.getItem('user.company') || '';
    const email = localStorage.getItem('user.email') || '';
    const signature = localStorage.getItem('user.signature') || '';
    const language = localStorage.getItem('user.language') || 'en';  // Load language from localStorage, default to 'en'

    // Populate the form fields
    document.getElementById('name').value = name;
    document.getElementById('company').value = company;
    document.getElementById('email').value = email;

    // Set the language dropdown to the saved language
    document.getElementById('language-select').value = language;

    // If signature exists, show it
    if (signature) {
      const img = new Image();
      img.src = signature;
      img.width = 300;
      img.height = 150;
      document.getElementById('signature-pad').appendChild(img);
    }

    // If data exists, make fields inactive
    if (name && company && email) {
      disableFormFields();
    }
}

// Function to disable the form fields
function disableFormFields() {
    document.getElementById('name').disabled = true;
    document.getElementById('company').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('language-select').disabled = true; // Disable language dropdown
    document.getElementById('signature-pad').style.pointerEvents = 'none';
    document.getElementById('clear-signature').disabled = true;
}

// Function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();

    const userId = localStorage.getItem('user.uid');
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
    const signature = localStorage.getItem('user.signature') || '';
    const language = document.getElementById('language-select').value;

    // Send data to the API to save it
    const response = await fetch('/api/saveForm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, name, company, signature, language })
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Data saved successfully:', result.data);

        // Save data to localStorage
        localStorage.setItem('user.name', name);
        localStorage.setItem('user.company', company);
        localStorage.setItem('user.signature', signature);
        localStorage.setItem('user.language', language);

        // Disable form fields after submission
        disableFormFields();
    } else {
        console.error('Error saving data:', result.error);
    }
}

// Attach event listener to form submission
document.getElementById('form').addEventListener('submit', handleSubmit);


// Check if user is authenticated by verifying localStorage for the user UID
function checkAuthentication() {
    const userId = localStorage.getItem('user.uid');
    if (!userId) {
      window.location.href = 'login.html';  // Redirect to login page if not authenticated
    } else {
      loadFormData();  // If authenticated, load the form data
    }
}

// Call authentication check on page load
checkAuthentication();
