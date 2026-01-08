# 📦 Smart Order & Inventory Management System

A full-stack enterprise-style application for managing orders, inventory, warehouses, payments, invoices, notifications, and reports.  
Built using **ASP.NET Core Web API**, **Entity Framework Core**, **SQL Server**, and **Angular**.

---

## 🚀 Tech Stack

### Backend
- ASP.NET Core Web API (.NET 8 / .NET 9)
- Entity Framework Core (Code-First)
- SQL Server
- ASP.NET Core Identity
- xUnit & Moq (Unit Testing)

### Frontend
- Angular
- Angular Material
- TypeScript
- HTML, CSS

---

## 📂 Project Structure

CapstoneProject  
├── SmartOrderandInventoryApi        (Backend – ASP.NET Core Web API)  
├── SmartOrderInventory-tests        (Unit Tests – xUnit)  
└── smartOrderInventory-ui           (Frontend – Angular)

---

## 👥 User Roles

- Admin  
- Sales Executive  
- Warehouse Manager  
- Finance Officer  
- Customer  

---

## ⚙️ Backend Setup

### 1️⃣ Open Backend Project

Open the solution file in Visual Studio:

SmartOrderandInventoryApi.sln

---

### 2️⃣ Configure Database

Update `appsettings.json`:

"ConnectionStrings": {
"DefaultConnection":  "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=SmartOrderInventoryDB;Integrated Security=True;"
}

### 4️⃣ Default Seeded Users

| Role | Email | Password |
|-----|------|---------|
| Admin | admin@system.com | Admin@123 |
| Warehouse Manager | wm1@system.com | WM1@123 |
| Sales Executive | sales1@system.com | Sales@123 |
| Finance Officer | sandy@finance.com | Sandy@123 |
| Customer | murari@gmail.com | Murari@123 |

## 🧪 Unit Testing (xUnit)

### Open Test Project

Open:

SmartOrderInventory-tests.csproj

### Run Tests

Using Visual Studio:
- Test → Test Explorer → Run All
  
### Services Covered by Unit Tests

- AdminService  
- CategoryService  
- ProductService  
- InventoryService  
- OrderService  
- InvoiceService  
- PaymentService  
- ReportService  
- WarehouseService

---

## 🎨 Frontend Setup (Angular)

### 1️⃣ Navigate to UI Folder

cd smartOrderInventory-ui
(Note: `node_modules` is excluded from GitHub)

---

### 3️⃣ Run Angular Application

ng serve

Frontend runs at:
http://localhost:4200

---

---

## 🔔 Key Features

- Role-based authentication & authorization
- Order creation and tracking
- Inventory management with low-stock alerts
- Invoice generation & payment handling
- Warehouse-wise stock management
- Notification system
- Reports & dashboards
- Unit testing using xUnit and Moq

---

## 📌 Notes

- Backend uses SQL Server (not in-memory DB)
- Identity services are mocked in unit tests
- Notifications are handled via background services
- Clean architecture with Services and Repositories

---

## 🧾 Submission Summary

- Backend implemented using ASP.NET Core Web API  
- Unit testing implemented using xUnit  
- Database seeded automatically  
- Frontend built using Angular  
- Role-based access implemented  

---

## UI Screenshots
All user interface screenshots demonstrating application functionality and workflows have been documented and included in a PowerPoint (PPT) file as part of the project submission.
 
 ---
 ## Deliverables
The repository includes detailed documentation files for better understanding of the system design and implementation.

Database Schema Diagram is provided in a Word document.

Project Presentation (PPT) contains UI screenshots and end-to-end workflow explanation.

LINQ Usage Report documents all LINQ queries used across the application with code snippets.

All documents can be downloaded from the repository and viewed locally.

## 👩‍💻 Author

Sneha Latha Avala   
Capstone Project
