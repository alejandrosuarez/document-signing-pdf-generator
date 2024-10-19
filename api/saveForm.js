// /api/saveForm.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, name, company, signature, language } = req.body;
    
    // Insert form data into 'user_signatures'
    const { data, error } = await supabase
      .from('user_signatures')
      .insert([{ user_id: userId, name, company, signature, language }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}