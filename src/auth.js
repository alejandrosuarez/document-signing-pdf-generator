// Check if 'window.env' exists, otherwise fallback to Vercel's process.env
const SUPABASE_URL = window.env ? window.env.SUPABASE_URL : process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.env ? window.env.SUPABASE_ANON_KEY : process.env.SUPABASE_ANON_KEY;

console.log("Supabase URL: ", SUPABASE_URL);
console.log("Supabase Anon Key: ", SUPABASE_ANON_KEY);

// Check if Supabase is available
if (typeof supabase === 'undefined') {
    console.error('Supabase is not loaded. Check the script source.');
} else {
    // Initialize Supabase Client
    // Initialize Supabase Client
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase Client Initialized:', supabaseClient);

    // Login function in auth.js
    async function loginUser(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }

        const userId = data.user.id;

        // Save session to localStorage to track login status
        //localStorage.setItem('supabase.auth.token', JSON.stringify(data));
        localStorage.setItem('supabaseClient.auth.token', JSON.stringify(data.session));

        // After successful login, load the user data from 'view_user_signatures' table
        const { data: userData, error: userError } = await supabaseClient
            .from('view_user_signatures')
            .select('*')
            .eq('user_id', userId)
            .single();  // Assuming one record per user

        if (userError) {
            console.error('Error loading user data:', userError.message);
            return { success: true, data };  // Proceed with login even if user data can't be loaded
        }

        // Save the fetched data to localStorage
        if (userData) {
            localStorage.setItem('user.uid', userData.user_id);
            localStorage.setItem('user.name', userData.name || '');
            localStorage.setItem('user.company', userData.company || '');
            localStorage.setItem('user.email', userData.email || email);  // Fallback to email used for login
            localStorage.setItem('user.signature', userData.signature || '');
            localStorage.setItem('user.language', userData.language || 'en');  // Fallback to 'en' if language isn't set
        }

        return { success: true, data };
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