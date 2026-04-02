# <p align="center">pix — Discover Beautiful Photos</p>

<p align="center">
  <a href="https://github.com/Abhigyan-29/pin/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Abhigyan-29/pin?style=flat-square&color=black" alt="License">
  </a>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

<p align="center">
  <strong>A premium, minimalist photography discovery platform built with Express.js and MongoDB.</strong>
  <br />
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 🌟 Overview

**pix** is a high-performance image gallery and discovery platform designed for creators and enthusiasts. It features a sleek, dark-themed UI with infinite scrolling, smart search across 30+ categories, and a seamless serverless architecture optimized for Vercel.

## ✨ Features

- 🖼️ **Premium Gallery**: High-quality 4K photography discovery.
- 🔍 **Smart Search**: Find content across categories like Architecture, Space, Cyberpunk, and more.
- ⚡ **Built for Speed**: Optimized server-side rendering with EJS.
- ☁️ **Serverless Ready**: Pre-configured for deployment on Vercel's Edge network.
- 🔒 **Secure Auth**: Integrated user authentication via Passport.js.
- 📱 **Fully Responsive**: Designed to look stunning on every device.

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **View Engine**: [EJS](https://ejs.co/) (Embedded JavaScript)
- **Auth**: [Passport.js](http://www.passportjs.org/)
- **Styling**: Vanilla CSS (Premium Dark Theme)
- **Hosting**: [Vercel](https://vercel.com/)

## 🚀 Installation

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Abhigyan-29/pin.git
cd pin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Start the server
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## ☁️ Deployment

This project is pre-configured for **Vercel** with a serverless entry point in the `api/` directory.

### Deploying to Vercel
1. Push your code to GitHub.
2. Import the repository in the [Vercel Dashboard](https://vercel.com).
3. Add the `MONGODB_URI` environment variable in the Project Settings.
4. Click **Deploy**.

## 📂 Directory Structure

```text
├── api/            # Serverless entry point for Vercel
├── bin/            # Web server scripts
├── public/         # Static assets (images, CSS, JS)
├── routes/         # Express routing logic
├── views/          # EJS templates (UI components)
├── app.js          # Main application configuration
├── vercel.json     # Vercel deployment configuration
└── .gitignore      # Git exclusion rules
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ by <a href="https://github.com/Abhigyan-29">Abhigyan Prakash</a>
</p>
