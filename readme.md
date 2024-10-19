# ✍️ Document Signing and PDF Generator 📝

Welcome to the **Document Signing and PDF Generator** project! This web application allows users to sign documents, generate PDFs with embedded signatures, and supports multiple languages (English/Spanish). It’s built with HTML, Bootstrap, and JavaScript, and it's fully deployable on **Vercel**. 🚀

## 🌟 Features

- 🌐 **Multi-language Support** (English/Spanish)
- ✍️ **Signature Drawing** using SVG
- 🖨️ **PDF Generation** with User Data and Signature
- 🎨 **Bootstrap UI** for a clean, responsive design
- ☁️ **Vercel-ready Deployment** for easy hosting

## 🛠️ Project Setup

### 💻 Local Setup

Since this project is built using **HTML**, **CSS**, and **JavaScript**, no special setup is required. Just follow these steps:

1. **Clone the repository**:
   ```
   git clone https://github.com/alejandrosuarez/document-signing-pdf-generator.git
   cd document-signing-pdf-generator
   ```

2. **Open the `index.html` file** directly in your browser or serve it using a simple HTTP server (like Python's built-in server):
   ```
   python3 -m http.server
   ```
   Then open your browser at `http://localhost:8000`.

### 🚀 Deployment on Vercel

Deploying the app on **Vercel** is easy! Just follow these steps:

1. **Push your repository** to GitHub (or any Git platform):
   ```
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create a Vercel account** (if you don’t have one) and go to the [Vercel dashboard](https://vercel.com/dashboard).

3. **Import your repository**:
   - Click "New Project" and select your GitHub repository.
   - Follow the steps to configure and deploy your project.

4. **Set Environment Variables** (if needed):
   - Go to your Vercel project settings and add your environment variables under the **Environment Variables** section.

### 🧩 Environment Variables

For local development, you can create a `.env` file based on the provided `.env.example`. Here’s an overview of the variables you might need:

| Key                        | Description                               | Default Value              |
|----------------------------|-------------------------------------------|----------------------------|
| `SUPABASE_URL`                 | Your Supabase project URL              | `https://xyzcompany.supabase.co`         |
| `SUPABASE_ANON_KEY`            | Your Supabase anon public key          | `your-anon-key`                          |


### 🛠️ Supabase Setup (NEW)

To integrate **Supabase** for authentication and database management, follow these steps:

1. **Create a Supabase Account**:  
   - Go to [Supabase](https://supabase.com) and create an account.  
   - Create a new project and get your **API URL** and **Anon Key** from the Supabase dashboard.  

2. **Set Environment Variables in Vercel**:  
   - In your Vercel dashboard, navigate to your project’s settings.  
   - Under the **Environment Variables** section, add the following keys:

   | Key                         | Description                            | Example Value                          |
   |-----------------------------|----------------------------------------|----------------------------------------|
   | SUPABASE_URL                 | Your Supabase project URL              | https://xyzcompany.supabase.co         |
   | SUPABASE_ANON_KEY            | Your Supabase anon public key          | your-anon-key                          |

3. **Local Development**:  
   - For local development, create a `src/hardcoded-env.js` file (which will be ignored in your `.gitignore`) with the following:

   ```
   window.env = {
     SUPABASE_URL: "your-supabase-url",
     SUPABASE_ANON_KEY: "your-anon-key"
   };
   ```

4. **Database Creation**:  
   - In your Supabase dashboard, create the necessary tables and views. 
   - find directory `SQL/` for the SQL files:

   ```
   📁 SQL/create-table-user_signatures.sql
   ```

   - And a view that combines `auth.users` and `user_signatures`:

   ```
   📁 SQL/create-view-view_user_signatures.sql
   ```
   - these are required to be executed on supabase.

### 📂 File Structure

Here's a quick look at the most important files in this project:
```
📁 document-signing-pdf-generator
├── 📄 index.html          # Main HTML file
├── 📄 README.md           # Project README with instructions
├── 📄 .gitignore          # Git ignore file (excludes sensitive files)
├── 📄 .env.example        # Example environment configuration
├── 📁 assets/             # Any assets like images or stylesheets
├── 📁 templates/          # Templates for the documents
├── 📁 SQL/                # SQL files for the database
└── 📁 src/                # Source files for the project
```
### 🌐 Live Demo

Once deployed, your app will be live at:  
[https://document-signing-pdf-generator.vercel.app](https://document-signing-pdf-generator.vercel.app) 🌍

### 🛠️ Future Features

We plan to add more exciting features in future versions:

- 🔐 **API Integration** for document storage and retrieval
- 👤 **User Authentication** for secure access

### 🙌 Contributing

We welcome contributions! 🎉  
Feel free to fork this repository and submit pull requests. If you encounter any issues, please open an issue on GitHub.

### ⚖️ License

This project is licensed under the **MIT License**. See the BLABLABLA file for more details.

---

Built with ❤️ by 888✨