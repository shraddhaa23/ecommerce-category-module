# E-Commerce Category Management System

A full-stack web application for managing product categories in an e-commerce platform. Built with React (frontend) and Java Spring Boot (backend).

## 🌐 Live Demo

**Application URL:** [https://ecommerce-category-module-nine.vercel.app](https://ecommerce-category-module-nine.vercel.app)

## 🏗️ Architecture

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │         │                  │
│   React Frontend │◄────────►  Spring Boot    │◄────────►  Aiven MySQL     │
│   (Vercel)       │  HTTP   │   Backend        │  JDBC   │  (Cloud DB)      │
│                  │  REST   │   (Render.com)   │  SSL    │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

## 🛠️ Tech Stack

- **Frontend:** React.js, JavaScript, CSS3
- **Backend:** Java, Spring Boot, Spring Data JPA, Maven
- **Database:** MySQL (Aiven - managed cloud hosting)
- **Deployment:** Vercel (frontend), Render.com (backend), Aiven (database)

## ✨ Features

- View, add, and edit product categories
- Toggle categories between Active and Inactive status
- Filter by status (All / Active / Inactive)
- Pagination (10 items per page)
- Confirmation modals for status changes
- Form validation with character limits
- Responsive design

## 🔐 Business Rules

1. New categories are created as **Active** by default
2. **Inactive** categories cannot be edited until reactivated
3. Status changes require user confirmation
4. Category name: max 100 characters (required)
5. Description: max 300 characters (required)

## 📡 API

**Base URL:** `https://ecommerce-category-module.onrender.com/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories (supports `?page`, `?size`, `?status`) |
| GET | `/categories/{id}` | Get category by ID |
| POST | `/categories` | Create new category |
| PUT | `/categories/{id}` | Update category |
| PATCH | `/categories/{id}/status` | Toggle category status |

## 🚢 Deployment

### Database (Aiven)
1. Create a free account at [aiven.io](https://aiven.io)
2. Create a new **MySQL** service
3. From the **Overview** tab, note down: Host, Port, Database name, Username, Password

### Backend (Render.com)
1. Push code to GitHub and connect to Render as a **Web Service**
2. Set build/start commands:
   - Build: `mvn clean install`
   - Start: `java -jar target/your-app.jar`
3. Add these environment variables in the Render dashboard:

| Variable | Value |
|---|---|
| `DB_HOST` | Aiven MySQL host |
| `DB_PORT` | Aiven MySQL port |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Aiven username |
| `DB_PASSWORD` | Aiven password |

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variable: `REACT_APP_API_URL` → your Render backend URL
3. Build command: `npm run build` | Output directory: `build`
4. Deploy!

## 👤 Author

**Shraddha** — [@shraddhaa23](https://github.com/shraddhaa23)

Project: [github.com/shraddhaa23/ecommerce-category-module](https://github.com/shraddhaa23/ecommerce-category-module)
