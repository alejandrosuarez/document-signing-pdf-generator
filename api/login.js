// /api/login.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Perform login using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const userId = data.user.id;

    // Fetch user data from 'view_user_signatures' after login
    const { data: userData, error: userError } = await supabase
      .from('view_user_signatures')
      .select('*')
      .eq('user_id', userId)
      .single(); // Single record per user

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Send session and user data back to the client
    res.status(200).json({ session: data.session, userData });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}