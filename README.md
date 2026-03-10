# NexusShop - Full-Stack E-Commerce Platform

NexusShop is a responsive, full-stack e-commerce web application built using the MERN stack. It features secure user authentication, product browsing, dynamic cart management, and comprehensive order tracking.

## 🚀 Features

* **User Authentication:** Secure signup and login functionality using JWT (JSON Web Tokens) and bcrypt.
* **Product Catalog:** Browse a dynamically loaded list of products with high-quality images.
* **Shopping Cart:** Add products to the cart, update quantities, and remove items seamlessly.
* **Checkout & Delivery:** Choose between different delivery options and view a calculated payment summary before placing an order.
* **Order Management:** Track past orders and view detailed order history.
* **Auto-Seeding Database:** The backend automatically seeds the database with default products and delivery options on the first run if the database is empty.

## 🛠️ Tech Stack

**Frontend**
* **React 19** - UI Library
* **Vite** - Frontend Tooling & Bundler
* **Tailwind CSS v4** - Utility-first CSS framework for styling
* **React Router v7** - Declarative routing
* **Axios** - Promise-based HTTP client
* **Day.js** - Date and time formatting

**Backend**
* **Node.js & Express.js** - Server environment and RESTful API framework
* **MongoDB & Mongoose** - NoSQL database and object data modeling
* **JWT & bcryptjs** - Authentication and password hashing
* **Cors & Dotenv** - Middleware and environment variable management

## 📁 Project Structure

```text
react-ecommerce-project/
├── ecommerce-backend/       # Node.js Express API server
│   ├── models/              # Mongoose database schemas
│   ├── routes/              # Express API endpoints
│   ├── defaultData/         # Default JSON data for initial DB seeding
│   ├── images/              # Static product and UI images
│   └── server.js            # Main backend entry point
│
└── ecommerce-frontend/      # React Vite application
    ├── src/
    │   ├── components/      # Reusable UI components (e.g., Header)
    │   ├── pages/           # Page views (Home, Checkout, Orders, etc.)
    │   └── App.jsx          # Root React component
    └── vite.config.js       # Vite configuration
