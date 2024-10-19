// Check if Supabase is available
if (typeof supabase === 'undefined') {
    console.error('Supabase is not loaded. Check the script source.');
} else {
    // Initialize Supabase Client
    // Initialize Supabase Client
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase Client Initialized:', supabaseClient);

    // Login function that calls Vercel API
    async function loginUser(email, password) {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        
        if (response.ok) {
            const userId = result.userData.user_id;

            // Save session and user data to localStorage
            localStorage.setItem('supabaseClient.auth.token', JSON.stringify(result.session));
            localStorage.setItem('user.uid', userId);
            localStorage.setItem('user.name', result.userData.name || '');
            localStorage.setItem('user.company', result.userData.company || '');
            localStorage.setItem('user.email', result.userData.email || email);  // Fallback to email used for login
            localStorage.setItem('user.signature', result.userData.signature || '');
            localStorage.setItem('user.language', result.userData.language || 'en');
            
            return { success: true };
        } else {
            return { success: false, message: result.error };
        }
    }

    // Handle form submission for login
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = await loginUser(email, password);
        if (result.success) {
            window.location.href = 'index.html'; // Redirect to the main page after successful login
        } else {
            document.getElementById('login-error').innerText = result.message;
            document.getElementById('login-error').style.display = 'block';
        }
    });
}