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
| `NEXT_PUBLIC_API_URL`       | Base API URL                              | `https://api.example.com`   |
| `NEXT_PUBLIC_VERCEL_ENV`    | Vercel environment (development/production) | `development`              |

### 📂 File Structure

Here's a quick look at the most important files in this project:
📁 document-signing-pdf-generator
├── 📄 index.html          # Main HTML file
├── 📄 README.md           # Project README with instructions
├── 📄 .gitignore          # Git ignore file (excludes sensitive files)
├── 📄 .env.example        # Example environment configuration
├── 📁 assets/             # Any assets like images or stylesheets
└── 📁 src/                # Source files for the project

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