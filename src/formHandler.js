// Initialize Supabase in formHandler.js (if not already initialized)
if (typeof supabaseClient === 'undefined') {
    const SUPABASE_URL = window.env ? window.env.SUPABASE_URL : process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = window.env ? window.env.SUPABASE_ANON_KEY : process.env.SUPABASE_ANON_KEY;

    // Check if supabase is defined (loaded via CDN)
    if (typeof supabase !== 'undefined') {
      var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("Supabase Client Initialized:", supabaseClient);
    } else {
      console.error('Supabase is not defined. Please check the script source or import.');
    }
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

    const userId = localStorage.getItem('user.uid');  // Retrieve user ID from localStorage
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;
    const email = document.getElementById('email').value;
    const signature = localStorage.getItem('user.signature') || '';  // Retrieve the signature data URL from localStorage
    const language = document.getElementById('language-select').value;  // Get the selected language from the dropdown

    // Ensure that Supabase client is initialized
    if (!supabaseClient) {
      console.error('Supabase client is not initialized.');
      return;
    }

    // Save data to Supabase
    const { data, error } = await supabaseClient
      .from('user_signatures')
      .insert([
        {
          user_id: userId,
          name: name,
          company: company,
          //email: email,
          signature: signature,
          language: language  // Save the selected language
        }
      ]);

    if (error) {
      console.error('Error saving data:', error.message);
    } else {
      console.log('Data saved successfully:', data);

      // Save data to localStorage
      localStorage.setItem('user.name', name);
      localStorage.setItem('user.company', company);
      localStorage.setItem('user.email', email);
      localStorage.setItem('user.signature', signature);
      localStorage.setItem('user.language', language);  // Save the selected language to localStorage

      // Disable form fields after submission
      disableFormFields();
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
