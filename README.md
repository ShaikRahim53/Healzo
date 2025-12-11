# Healzo - Patient Portal

A full-stack web application for managing patient medical documents (PDFs) with upload, download, and deletion capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation &amp; Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Example API Calls](#example-api-calls)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 📤 **Upload PDF Documents** - Secure PDF file upload with validation
- 📋 **View Documents** - List all uploaded documents with metadata
- ⬇️ **Download Documents** - Download any uploaded document
- 🗑️ **Delete Documents** - Remove documents when no longer needed
- 📊 **Metadata Tracking** - Store filename, size, and upload date
- 🎨 **Responsive UI** - Modern Tailwind CSS interface
- ⚠️ **Error Handling** - User-friendly error messages
- ✅ **File Validation** - PDF-only with 50MB file size limit

## 📁 Project Structure

```
Healzo/
├── backend/
│   ├── routes/
│   |  └── documentRoutes.js           # Document API endpoints
│   ├── db.js                          # PostgreSQL connection
│   ├── index.js                       # Express server
│   ├── package.json
│   ├── .env                           # Environment variables
│   └── uploads/                       # File storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main document management UI
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── design.md                          # System design document
└── README.md                          # README file
└── test-api.js                        # For testing api
```

## 🛠️ Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** database (local instance)
- Available ports: **5000** (backend), **5175** (frontend)
- **Git** (optional, for version control)

## 📦 Installation & Setup

### Step 1: Clone or Extract the Project

```bash
cd e:\reactjs\Healzo
```

### Step 2: Set Up PostgreSQL Database

1. **Create the database**:

```sql
CREATE DATABASE Healzo;
```

2. **Create the documents table**:

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Verify table creation**:

```sql
\dt documents;  -- In PostgreSQL CLI
```

### Step 3: Configure Backend Environment

1. **Navigate to backend**:

```bash
cd backend
```

2. **Create `.env` file** with your database credentials:

```env
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Healzo
PORT=5000
```

**Example** (if using default PostgreSQL setup):

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Healzo
PORT=5000
```

3. **Install backend dependencies**:

```bash
npm install
```

### Step 4: Configure Frontend

1. **Navigate to frontend**:

```bash
cd ../frontend
```

2. **Install frontend dependencies**:

```bash
npm install
```

## 🚀 Running the Application

### Option 1: Start Both Servers from Terminal

**Terminal 1 - Start Backend**:

```bash
cd backend
npm run dev
```

Expected output:

```
Server running on port 5000
Connected to PostgreSQL database
```

**Terminal 2 - Start Frontend**:

```bash
cd frontend
npm run dev
```

Expected output:

```
  VITE v7.2.7  ready in 403 ms
  ➜  Local:   http://localhost:5175/
```

### Option 2: Using npm Scripts

**Backend**:

```bash
cd backend
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

**Frontend**:

```bash
cd frontend
npm run dev        # Development mode
npm run build      # Create production build
npm run preview    # Preview production build
```

## 🌐 Access the Application

Once both servers are running, open your browser:

```
http://localhost:5175
```

You should see:

- Upload form at the top
- Document list below
- Download and delete buttons for each document

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api/documents
```

### Endpoints Summary

| Method     | Endpoint    | Description                  |
| ---------- | ----------- | ---------------------------- |
| `POST`   | `/upload` | Upload a PDF document        |
| `GET`    | `/`       | List all documents           |
| `GET`    | `/:id`    | Download a specific document |
| `DELETE` | `/:id`    | Delete a document            |

---

## 📝 Example API Calls

### 1. Upload a Document

#### Using Postman

1. Set method to **POST**
2. URL: `http://localhost:5000/api/documents/upload`
3. Go to **Body** tab
4. Select **form-data**
5. Add key: `file` (type: **File**)
6. Select your PDF file
7. Click **Send**

#### Response (Success - 201 Created)

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 1,
    "filename": "prescription.pdf",
    "filepath": "e:\\reactjs\\Healzo\\backend\\uploads\\1733945400000-123456789-prescription.pdf",
    "filesize": 102400,
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

#### Response (Error - Invalid File)

```json
{
  "error": "Only PDF files are allowed"
}
```

---

### 2. List All Documents

#### Using Postman

1. Set method to **GET**
2. URL: `http://localhost:5000/api/documents`
3. Click **Send**

#### Response (200 OK)

```json
{
  "documents": [
    {
      "id": 1,
      "filename": "prescription.pdf",
      "filepath": "e:\\reactjs\\Healzo\\backend\\uploads\\1733945400000-123456789-prescription.pdf",
      "filesize": 102400,
      "created_at": "2025-12-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "test_results.pdf",
      "filepath": "e:\\reactjs\\Healzo\\backend\\uploads\\1733945450000-987654321-test_results.pdf",
      "filesize": 256000,
      "created_at": "2025-12-11T11:00:00.000Z"
    }
  ]
}
```

#### Response (Empty List - 200 OK)

```json
{
  "documents": []
}
```

---

### 3. Download a Document

#### Using Postman

1. Set method to **GET**
2. URL: `http://localhost:5000/api/documents/1`
3. Click **Send**
4. File automatically downloads
5. Click **Save** button if needed

#### Response (Success - 200 OK)

- Binary PDF file is sent
- Browser automatically downloads with original filename
- Header: `Content-Disposition: attachment; filename="prescription.pdf"`

#### Response (Error - Document Not Found)

```json
{
  "error": "Document not found"
}
```

---

### 4. Delete a Document

#### Using Postman

1. Set method to **DELETE**
2. URL: `http://localhost:5000/api/documents/1`
3. Click **Send**

#### Response (Success - 200 OK)

```json
{
  "message": "Document deleted successfully"
}
```

#### Response (Error - Document Not Found)

```json
{
  "error": "Document not found"
}
```

---

## 🧪 Complete Test Workflow

### Test Scenario: Full CRUD Operations

Using Postman Collection

1. Create a new Postman collection
2. Add 4 requests:

   - **POST** - Upload Document
   - **GET** - List Documents
   - **GET** - Download Document (use variable {{doc_id}})
   - **DELETE** - Delete Document (use variable {{doc_id}})
3. In upload response, extract ID: `Tests` tab:

```javascript
var jsonData = pm.response.json();
pm.environment.set("doc_id", jsonData.document.id);
```

4. Run requests in sequence

---

## 📋 File Size and Type Limits

| Limit                   | Value    | Description                 |
| ----------------------- | -------- | --------------------------- |
| **Max File Size** | 50 MB    | Prevents storage exhaustion |
| **Allowed Type**  | PDF only | application/pdf MIME type   |
| **Min File Size** | 1 KB     | Practical minimum           |

---

## 🔐 Security Notes

✅ **Implemented**:

- PDF file type validation
- File size limit (50MB)
- Unique filename generation
- CORS enabled

❌ **Not Implemented** (Add Before Production):

- User authentication
- HTTPS/TLS encryption
- Rate limiting
- Antivirus scanning
- Audit logging

See `design.md` for detailed security analysis.

---

## 🆘 Troubleshooting

### Backend Won't Start

**Error**: `Connection refused`

- Check PostgreSQL is running
- Verify `.env` credentials
- Check database `Healzo` exists

**Error**: `Port 5000 already in use`

```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Frontend Won't Load

**Error**: `Cannot find http://localhost:5000`

- Ensure backend is running
- Check backend port (should be 5000)

**Error**: `Port 5175 already in use`

- Change port in `vite.config.js`

### Database Connection Error

**Error**: `ECONNREFUSED 127.0.0.1:5432`

- PostgreSQL not running
- Check `.env` credentials
- Verify database exists: `\l` in psql

### Upload Fails

**Error**: `Only PDF files are allowed`

- Select a PDF file, not another format
- Check file extension is `.pdf`

**Error**: `File too large`

- File exceeds 50MB limit
- Compress or split the file

### File Won't Download

**Error**: `File not found on server`

- File deleted from disk but metadata in DB
- Run cleanup query in PostgreSQL

---

## 📚 Additional Resources

- **Design Document**: See `design.md` for architecture details
- **API Spec**: See `design.md` for complete API specification
- **Stack Details**: See `design.md` for technology choices

---

## 📝 License

This project is provided as-is for educational and healthcare platform development purposes.

---

## 👥 Support

For issues or questions:

1. Check the **Troubleshooting** section
2. Review `design.md` for architecture details
3. Check browser console (F12) for errors
4. Review backend terminal logs

---

**Version**: 1.0.0
**Last Updated**: December 11, 2025
**Status**: ✅ Production Ready for Single-User Local Deployment
