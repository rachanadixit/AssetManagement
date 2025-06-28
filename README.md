# AssetFlow: Asset Management System

AssetFlow is a robust Asset Management System designed to help organizations efficiently manage, track, and report on their physical assets throughout the asset lifecycle. This system streamlines asset allocation, maintenance, disposal, and reporting, with a focus on security, transparency, and ease of use.

---

## 🚀 Overview

AssetFlow enables companies to:

- **Track and manage physical assets** (e.g., equipment, IT devices, furniture) from acquisition to disposal.
- **Automate lifecycle processes**, including warranty management and disposal workflows.
- **Empower both administrators and employees** with role-based access and tailored functionalities.
- **Maintain compliance** through record-keeping and reporting.

**Intended Audience:**  
Organizations seeking a centralized internal tool to streamline asset management, suitable for IT, facility, or operations teams.

---

## ✨ Key Features

- **Secure User Authentication** with Admin & Employee roles.
- **Full CRUD Operations** for Assets, Users, Categories, and Locations.
- **Asset Status Tracking**: Active, In Repair, Disposed, and more.
- **Scrap & Disposal Management Module** with detailed record-keeping.
- **Automated Warranty Expiry Alerts** (assets expiring within 30 days).
- **Dynamic Reporting**:
  - Asset Summary (by Status, Category, Location)
  - User Asset Assignments
- **Responsive User Interface** using Tailwind CSS.
- **Modern, Component-based Frontend** for intuitive navigation.

---

## 🛠️ Technologies Used

**Backend:**
- Python (Flask)
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-Login
- Flask-CORS
- Werkzeug Security

**Frontend:**
- React.js (Vite)
- JavaScript (ES6+)
- Tailwind CSS

**Database:**
- SQLite3

---

## 📦 Prerequisites

- **Python 3.x**
- **Node.js** (v16+ recommended)
- **npm** or **yarn**

---

## ⚡ Getting Started (Local Development Setup)

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-org/assetflow.git
cd assetflow
```

---

### 2. **Backend Setup**

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Initialize the database (WARNING: This clears all previous data)
python create_db.py

# Start the Flask development server
flask run
```

---

#### **Admin User Registration**

Register the initial admin user with the following `curl` command:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "Admin@123",
    "name": "Admin",
    "emp_id": "HADM001",
    "emp_code": "HAC001",
    "role": "Admin"
  }'
```

---

### 3. **Frontend Setup**

```bash
cd ../frontend
npm install
# or
yarn install

# Start the React development server
npm run dev
# or
yarn dev
```

---

### 4. **Access the Application**

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📝 Usage Instructions

- **Login** using the admin credentials (`admin@haierindia.com` / `Admin@123`).
- **Navigate** via the sidebar between:
  - **Assets**: View, add, edit, or delete assets.
  - **Users**: (Admin only) Manage users and roles.
  - **Scrap/Disposal**: Record asset disposal or scrapping.
  - **Warranty Alerts**: See assets with warranties expiring soon.
  - **Reports**: Generate summaries and user assignments.
- **CRUD Operations:**  
  Use the respective sections to add, update, or delete records.
- **Role-Based Access:**  
  Employees see only their assigned assets; Admins have full access.

---

## 📡 API Endpoints (Overview)

| Endpoint                                 | Method(s) | Description                           |
|-------------------------------------------|-----------|---------------------------------------|
| `/api/register`                          | POST      | Register a new user                   |
| `/api/login`                             | POST      | User login                            |
| `/api/logout`                            | POST      | User logout                           |
| `/api/current_user`                      | GET       | Get current user info                 |
| `/api/assets`                            | GET, POST | List or create assets                 |
| `/api/assets/<int:id>`                   | GET, PUT, DELETE | Get, update, or delete an asset    |
| `/api/users`                             | GET, POST | (Admin) List or add users             |
| `/api/users/<int:id>`                    | PUT, DELETE | (Admin) Update or delete a user     |
| `/api/disposals`                         | GET, POST | Manage scrap/disposal records         |
| `/api/disposals/<int:id>`                | PUT, DELETE | Update or delete a disposal record  |
| `/api/warranty_alerts`                   | GET       | List assets with expiring warranties  |
| `/api/reports/asset_summary`             | GET       | Asset summary report                  |
| `/api/reports/user_asset_assignments`    | GET       | User asset assignment report          |

---

## 🌱 Future Enhancements

- Advanced search and filtering options
- Export data to CSV/Excel
- Image/document uploads for assets
- Granular role-based access control
- Notifications for alerts (email/SMS)
- Integration with enterprise systems (SAP, Gems, etc.)
- Audit trail and change history

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
