# Inventory Management SaaS

A multi-user Inventory Management System built to help users manage products, monitor stock levels, and maintain inventory records through a web-based dashboard.

## Project Overview

This project is being developed as a technical assignment for Webcomms Global (Pvt) Ltd.

The application is designed as a SaaS platform where each registered user can manage their own inventory securely.

## Technologies Used

### Frontend
- Angular 21
- TypeScript
- HTML
- CSS

### Backend
- ASP.NET Core Web API (.NET 9)
- C#
- Entity Framework Core

### Database
- Microsoft SQL Server Express

## Current Development Progress

### Completed
- [x] Created Angular frontend application.
- [x] Created ASP.NET Core Web API project.
- [x] Configured SQL Server Express connection.
- [x] Created the InventoryManagementDB database.
- [x] Implemented the initial database structure using Entity Framework Core.
- [x] Created ApplicationUser model.
- [x] Created Product model.
- [x] Created StockMovement model.
- [x] Configured user-product relationships.
- [x] Added a unique SKU constraint for each user.
- [x] Added initial EF Core database migration.

### Planned Features
- [ ] User registration and login.
- [ ] JWT-based authentication.
- [ ] User-specific inventory dashboard.
- [ ] Product creation, viewing, updating, and deletion.
- [ ] Stock addition and reduction.
- [ ] Prevention of negative stock quantities.
- [ ] Low-stock alerts.
- [ ] Product search and category filtering.
- [ ] Responsive user interface.
- [ ] Stock movement history.

## Project Structure

```text
inventory-management-saas/
│
├── frontend/                  # Angular application
│
├── backend/
│   └── InventoryManagement.API/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Models/
│       ├── Services/
│       ├── Migrations/
│       ├── Program.cs
│       └── appsettings.json
│
├── .gitignore
└── README.md
```

## Database Configuration

The application uses SQL Server Express.

Database name: `InventoryManagementDB`

Configure the database connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=InventoryManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

## How to Run the Project

### Prerequisites

- Node.js and npm
- Angular CLI
- .NET 9 SDK
- SQL Server Express
- Visual Studio Code

### 1. Clone the repository

```bash
git clone https://github.com/lochana2002/inventory-management-saas.git
cd inventory-management-saas
```

### 2. Run the Backend

```powershell
cd backend/InventoryManagement.API
dotnet restore
dotnet run
```

API URL: `http://localhost:5174`

Swagger documentation: `http://localhost:5174/swagger`

### 3. Run the Frontend

Open another terminal:

```powershell
cd frontend
npm install
ng serve
```

Frontend URL: `http://localhost:4200`

## Author

**Lochana Thathsarani**

Software Engineering Undergraduate

NSBM Green University

## Project Status

Currently under development.