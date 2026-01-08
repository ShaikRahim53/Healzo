# Healzo - Patient Portal

## Comprehensive Design Documentation

---

## Table of Contents

1. [Tech Stack Choices](#1-tech-stack-choices)
2. [Architecture Overview](#2-architecture-overview)
3. [API Specification](#3-api-specification)
4. [Data Flow Description](#4-data-flow-description)
5. [Assumptions](#5-assumptions)

---

## 1. Tech Stack Choices

### Q1: What frontend framework did you use and why? (React, Vue, etc.)

**Answer: React.js**

I chose React because it makes building interactive user interfaces much easier and faster. Think of React like building with LEGO blocks - each block (called a "component") does one specific job, and you can combine them to build complex interfaces.

**Why React for our healthcare app:**

- **Component-Based Architecture**: Instead of writing one huge file with all the code, we break the app into smaller pieces. For example, we have a `PatientDocumentForm` component that only handles the patient information form. This makes the code cleaner and easier to understand.
- **Reusable Code**: Once we create a component, we can use it multiple times without copying code. If we need the same form in different places, we just use the component again.
- **Fast Updates**: React is smart about updating the page. If a patient uploads a document, only the document list updates - not the entire page. This feels faster to the user.
- **Easy Learning**: React isn't too complicated. Someone new to programming can pick it up in a few weeks with tutorials.
- **Large Community**: Millions of developers use React. That means lots of tutorials, libraries, and help available online.

**Additional Tools We Use:**

- **Vite**: A fast build tool that lets us see changes instantly as we code (hot reload)
- **Tailwind CSS**: Pre-made styling classes that make the app beautiful without writing much CSS
- **jsPDF & html2canvas**: Libraries that create PDF files directly in the browser

---

### Q2: What backend framework did you choose and why? (Express, Flask, Django, etc.)

**Answer: Express.js (Node.js)**

I chose Express because it's lightweight and perfect for creating REST APIs (the bridges between the frontend and database).

**Why Express works best for us:**

- **Simple & Straightforward**: Express doesn't force you to follow complicated patterns. You build exactly what you need - nothing more, nothing less.
- **JavaScript Everywhere**: The entire project uses JavaScript. The frontend is React (JavaScript), and the backend is Node.js (JavaScript). This means developers don't need to learn two different languages like Python and JavaScript.
- **Perfect for Files**: Express works beautifully with Multer, a library that handles PDF uploads. Uploading files is simple and reliable.
- **Fast Performance**: Express handles many requests simultaneously without slowing down. This is important for a medical app where doctors might upload documents at the same time.
- **Easy to Test**: We can quickly test if our API endpoints work correctly using tools like curl or Postman.

**Why not other frameworks:**

- **Django (Python)**: Would force us to learn Python alongside JavaScript. Too many languages for this project.
- **Flask (Python)**: Same issue - adds complexity with a second language.
- **FastAPI**: Newer and less widely used. Express has more community support.

---

### Q3: What database did you choose and why? (SQLite vs PostgreSQL vs others)

**Answer: PostgreSQL**

I chose PostgreSQL because it's a professional-grade database designed for real applications like healthcare systems. SQLite is good for learning, but PostgreSQL is what actual hospitals and clinics use.

**PostgreSQL Advantages:**

- **Reliable & Professional**: Companies like Apple, Spotify, and Netflix use PostgreSQL. It's trusted for critical data.
- **Multiple Users at Once**: PostgreSQL handles many people uploading documents simultaneously without crashing. SQLite locks up when multiple people try to write at the same time.
- **Data Protection**: PostgreSQL has built-in security features like user authentication and permission systems. Medical records MUST be secure.
- **Handles Large Data**: As the patient database grows from 10 patients to 10,000 patients, PostgreSQL stays fast. SQLite gets slower.
- **Guarantees Data Integrity**: If something goes wrong (like a power outage), PostgreSQL ensures data is never corrupted. SQLite can lose data.
- **Better Tools**: PostgreSQL has amazing backup and recovery tools. SQLite has minimal backup features.

**Simple Comparison:**

```
SQLite:
- File-based database
- Good for: Learning, small projects, mobile apps
- Bad for: Multiple users, medical data, scalability

PostgreSQL:
- Server-based database
- Good for: Medical apps, multiple users, real hospitals
- Bad for: Learning (slightly more complex)
```

**Our Database Table:**

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,          -- Unique ID (auto-numbered)
  filename VARCHAR(255) NOT NULL, -- Original filename: "patient_report.pdf"
  filepath VARCHAR(500) NOT NULL, -- Where file is saved: "/uploads/1733945400-report.pdf"
  filesize INTEGER NOT NULL,      -- File size in bytes: 250000
  created_at TIMESTAMP            -- When uploaded: 2025-12-11 10:30:00
);
```

---

### Local Development - Database Setup

This section explains how to configure PostgreSQL so other developers can run the application locally. It includes quick commands for Windows (cmd), macOS/Linux, and a sample `.env` file.

1. Install PostgreSQL

- **Windows (recommended)**: download installer from https://www.postgresql.org/download/windows/ and follow the installer. During install, note the Postgres user (default: `postgres`) and password you set.
- **macOS (Homebrew)**:

```bash
brew install postgresql
brew services start postgresql
```

- **Ubuntu / Debian**:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

2. Create a database and user (psql)

- Open a terminal and run the interactive psql shell as the `postgres` user (Windows: use pgAdmin or the SQL Shell (psql) that was installed):

Windows (cmd.exe):

```bat
psql -U postgres
```

macOS / Linux:

```bash
sudo -u postgres psql
```

- In `psql`, run (replace `healzo_user` / `healzo_db` / `your_password` with your values):

```sql
CREATE USER healzo_user WITH PASSWORD 'your_password';
CREATE DATABASE healzo_db OWNER healzo_user;
GRANT ALL PRIVILEGES ON DATABASE healzo_db TO healzo_user;
\q
```

3. Create the `documents` table

If you used the SQL above, connect to the `healzo_db` database and run the table creation SQL (same as shown above):

```bash
psql -U healzo_user -d healzo_db -h localhost -W
-- paste the CREATE TABLE statement here (or run the SQL file)
```

4. Configure environment variables for the backend

Create a `.env` file in the `backend/` folder (do NOT commit real secrets). Here's a safe example file named `.env.example` (we provide this file in the repo):

```
# backend/.env.example
DB_USER=healzo_user
DB_HOST=localhost
DB_NAME=healzo_db
DB_PASSWORD=your_password_here
DB_PORT=5432
PORT=5000
```

Copy `.env.example` to `.env` and update the values with the credentials you created.

5. Run the backend locally

Open `cmd.exe` in `e:\reactjs\Healzo\backend` and run:

```bat
npm install
set NODE_ENV=development
set DB_USER=healzo_user
set DB_HOST=localhost
set DB_NAME=healzo_db
set DB_PASSWORD=your_password_here
set DB_PORT=5432
npm run dev
```

On PowerShell use `$env:DB_USER = 'healzo_user'` style or just copy `.env` file and let the backend load it with `dotenv`.

6. Quick verification

- Visit the backend health route (if available) or try the GET documents endpoint:

```bash
curl http://localhost:5000/api/documents
```

You should get a JSON response (empty array at first) or the server will return helpful error messages about DB connectivity.

7. GUI option

- You can use **pgAdmin**, **DBeaver**, or **TablePlus** to connect to `localhost:5432` with the user `healzo_user` and verify the `documents` table exists and is empty.

Notes:

- If you plan to share the repo, include the `backend/.env.example` file and instruct contributors to copy it to `.env` and fill values.
- The `backend/db.js` file reads environment variables; confirm your `.env` keys match (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`).

### Q4: If you were to support 1,000 users, what changes would you consider?

**Answer: 10 Major Changes Needed**

Right now, our app works great for 1-5 people testing it. But if 1,000 doctors and nurses tried to use it at the same time, it would crash. Here's what we'd need to fix:

#### **1. Add User Authentication (CRITICAL)**

**Problem**: Anyone can see all patient documents. A patient in New York can see a patient in California's records.

**Solution**:

```javascript
// Add login system
if (!user.isLoggedIn) {
  showError("Please log in first");
  return;
}

// Only show THIS doctor's documents
const myDocuments = database.getDocuments(user.id);
```

**Timeline**: 1-2 weeks

---

#### **2. Encrypt Sensitive Data (CRITICAL)**

**Problem**: Medical records are stored as plain text. If someone hacks the server, they see everything.

**Solution**: Encrypt documents before saving

```javascript
// Before saving: encrypt the PDF
const encrypted = encrypt(pdfFile, encryptionKey);
fs.saveFile(encrypted);

// When downloading: decrypt the PDF
const decrypted = decrypt(encryptedFile, encryptionKey);
sendToUser(decrypted);
```

**Timeline**: 1 week

---

#### **3. Move Files to Cloud Storage**

**Problem**: We save files on the server's hard drive. Hard drives have limited space (usually 256GB-1TB).

**Solution**: Use AWS S3 or Google Cloud Storage

```javascript
// Instead of saving to /uploads/
// Save to AWS S3 (practically unlimited space)
aws.s3.upload(pdfFile, "medical-documents-bucket/");
```

**Benefits**:

- Unlimited storage space
- Automatic backups
- Lightning-fast downloads worldwide
- If our server crashes, files are still safe

---

#### **4. Use Multiple Servers**

**Problem**: One server can only handle ~100 concurrent users before getting slow.

**Solution**: Use load balancing

Patient 1 → Load Balancer → Server 1
Patient 2 → Load Balancer → Server 2
Patient 3 → Load Balancer → Server 3
Patient 4 → Load Balancer → Server 1
...

**Benefits**:

- If Server 1 is busy, Patient 4 goes to Server 1 which becomes available
- If Server 2 crashes, servers 1 and 3 keep working
- Can handle 1000s of concurrent users

---

#### **5. Add Database Caching**

**Problem**: Every time a doctor views the document list, we query the database. With 1000 doctors, that's 1000 database queries per minute.

**Solution**: Use Redis (super-fast memory storage)

```javascript
// First request: fetch from database, store in cache
const documents = database.getDocuments(user.id);
redis.cache.set(`user_${user.id}_docs`, documents, 5minutes);

// Next request (within 5 minutes): fetch from Redis (10x faster)
const documents = redis.cache.get(`user_${user.id}_docs`);
```

---

#### **6. Limit Requests Per User**

**Problem**: Someone could attack the system by uploading 10,000 PDFs at once.

**Solution**: Rate limiting

```javascript
// Each user can upload max 10 files per hour
const uploadLimit = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
});

app.post("/upload", uploadLimit, uploadFile);
```

---

#### **7. Set Up Automatic Backups**

**Problem**: If the database crashes, 1,000 patient records are lost forever.

**Solution**: Automated daily backups

```
Daily Backup Schedule:
2:00 AM - Backup PostgreSQL database
2:15 AM - Backup all files from AWS S3
2:30 AM - Store backup in separate cloud region
```

---

#### **8. Monitor Performance**

**Problem**: We don't know if the system is slow until doctors complain.

**Solution**: Add monitoring tools

```javascript
// Track: response times, errors, user count
newrelic.trackMetric("upload_time_ms", 1200);
datadog.trackError("database_connection_failed");

// Get alerts: if system gets slow
if (responseTime > 2000) {
  slack.sendAlert("System is slow! 🚨");
}
```

---

#### **9. Add Document Search**

**Problem**: With 10,000 documents, scrolling through a list is impossible.

**Solution**: Full-text search

```javascript
// User types: "blood test results"
// System finds all matching documents instantly
const results = database.search("blood test results", user.id);
```

---

#### **10. Use a CDN**

**Problem**: A user in Japan downloads a file from a US server (slow).

**Solution**: Content Delivery Network

```
User in Japan downloads
  → CDN automatically serves from nearest server (Japan)
  → 10x faster than downloading from USA
```

**Summary Table:**

| Change           | Complexity | Timeline | Impact                            |
| ---------------- | ---------- | -------- | --------------------------------- |
| Authentication   | High       | 2 weeks  | Users can't see each other's data |
| Encryption       | High       | 1 week   | HIPAA compliant                   |
| Cloud Storage    | Medium     | 3 days   | Unlimited storage                 |
| Multiple Servers | High       | 2 weeks  | Handle 1000 users                 |
| Caching          | Medium     | 1 week   | 10x faster                        |
| Rate Limiting    | Low        | 2 days   | Prevent abuse                     |
| Backups          | Medium     | 3 days   | Disaster recovery                 |
| Monitoring       | Medium     | 1 week   | Know when problems happen         |
| Search           | Medium     | 1 week   | Find documents easily             |
| CDN              | Low        | 1 day    | Fast downloads worldwide          |

---

## 2. Architecture Overview

### System Architecture Diagram

Let me explain how data flows through the entire system:

```
┌─────────────────────────────────────────────────────────────┐
│                   USER'S COMPUTER                           │
│  Doctor opens browser and goes to localhost:5174            │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          REACT APP (Frontend)                        │  │
│  │                                                      │  │
│  │  Tabs at top:                                        │  │
│  │  [Create Document] [Upload PDF] [My Documents]     │  │
│  │                                                      │  │
│  │  PatientDocumentForm Component:                     │  │
│  │  - Patient Name field                               │  │
│  │  - Date of Birth field                              │  │
│  │  - Medical Info fields                              │  │
│  │  - Generates PDF using jsPDF                        │  │
│  │                                                      │  │
│  │  Document List:                                     │  │
│  │  - Table showing all documents                      │  │
│  │  - Download buttons                                 │  │
│  │  - Delete buttons                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │
              (HTTP REST API Calls)
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                  BACKEND SERVER                              │
│            (Node.js + Express)                              │
│            Running on localhost:5000                        │
│                                                              │
│  API Routes:                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  POST   /api/documents/upload    (Upload file)     │   │
│  │  GET    /api/documents           (List all)        │   │
│  │  GET    /api/documents/:id       (Download)        │   │
│  │  DELETE /api/documents/:id       (Delete)          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  File Handler (Multer):                                     │
│  - Validates: Is it a PDF?                                 │
│  - Validates: Is it under 50MB?                            │
│  - Generates unique filename                               │
│  - Saves to /backend/uploads/                              │
│                                                              │
│  Database Handler:                                          │
│  - Saves file metadata to PostgreSQL                       │
│  - Queries database for file list                          │
│  - Deletes metadata from database                          │
└───────────────┬──────────────────────┬──────────────────────┘
                │                      │
    SQL Queries │                      │ Disk Read/Write
                │                      │
                │                      │
┌───────────────▼──────┐   ┌──────────▼─────────────────┐
│  PostgreSQL Database │   │  File System               │
│  (localhost:5432)    │   │  /backend/uploads/         │
│                      │   │                            │
│  documents table:    │   │  Files:                    │
│  ┌────────────────┐  │   │  - 1733945400-report.pdf  │
│  │ id: 1          │  │   │  - 1733945450-test.pdf    │
│  │ filename: ...  │  │   │  - 1733945500-notes.pdf   │
│  │ filepath: ...  │  │   │  - (etc)                  │
│  │ filesize: ...  │  │   │                            │
│  │ created_at:... │  │   │                            │
│  └────────────────┘  │   │                            │
└──────────────────────┘   └────────────────────────────┘
```

### What Happens When Doctor Uploads a Document

```
Step 1: Doctor Selects File
   └─ Opens file picker, selects "patient_report.pdf"

Step 2: Frontend Validates
   └─ Checks: Is it a PDF? Is it under 50MB?
   └─ If NO → Show error message
   └─ If YES → Continue

Step 3: Frontend Sends File to Backend
   └─ POST request to /api/documents/upload
   └─ Includes file data in FormData

Step 4: Backend Multer Processes File
   └─ Checks MIME type (application/pdf)
   └─ Checks file size (< 50MB)
   └─ Generates unique filename: 1733945400-patient_report.pdf
   └─ Saves to /backend/uploads/

Step 5: Backend Saves Metadata
   └─ INSERT INTO documents (filename, filepath, filesize, created_at)
   └─ PostgreSQL returns new document with ID = 5

Step 6: Backend Sends Response
   └─ Success! Here's the saved document with ID 5

Step 7: Frontend Updates
   └─ Show green success message
   └─ Fetch list of all documents
   └─ Update "My Documents" tab
   └─ New document appears in table
```

---

## 3. API Specification

All endpoints live at: `http://localhost:5000/api/documents`

### **Endpoint 1: Upload a Document**

**When to use**: Doctor wants to upload an existing PDF file or a newly generated PDF

**Request**:

```
POST /api/documents/upload
Content-Type: multipart/form-data

Body contains: PDF file binary data
```

**Postman Steps**:

1. Click "+" to create new request
2. Set method to `POST`
3. Paste URL: `http://localhost:5000/api/documents/upload`
4. Click "Body" tab
5. Select "form-data"
6. Key: `file` → Value: Click file icon, select your PDF
7. Click "Send"

**Success Response (201 Created)**:

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 1,
    "filename": "patient_report.pdf",
    "filepath": "/home/user/backend/uploads/1733945400-patient_report.pdf",
    "filesize": 245678,
    "created_at": "2025-12-11T10:30:00.000Z"
  }
}
```

**Error: Not a PDF (400 Bad Request)**:

```json
{
  "error": "Only PDF files are allowed"
}
```

**Error: File Too Large (413)**:

```json
{
  "error": "File size exceeds 50MB limit"
}
```

**Error: No File Selected (400)**:

```json
{
  "error": "No file uploaded"
}
```

**What Actually Happens:**

1. Multer grabs the file from the request
2. Validates it's a PDF (checks MIME type)
3. Validates it's under 50MB
4. Generates unique filename with timestamp
5. Saves file to disk at `/backend/uploads/`
6. Saves metadata to PostgreSQL
7. Returns the document record with assigned database ID

---

### **Endpoint 2: Get All Documents**

**When to use**: Show the list of all documents in the "My Documents" tab

**Request**:

```
GET /api/documents
```

**Postman Steps**:

1. Click "+" to create new request
2. Set method to `GET`
3. Paste URL: `http://localhost:5000/api/documents`
4. Click "Send"

**Success Response (200 OK - With Documents)**:

```json
{
  "documents": [
    {
      "id": 1,
      "filename": "patient_report.pdf",
      "filepath": "/home/user/backend/uploads/1733945400-patient_report.pdf",
      "filesize": 245678,
      "created_at": "2025-12-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "filename": "blood_test_results.pdf",
      "filepath": "/home/user/backend/uploads/1733945450-blood_test.pdf",
      "filesize": 189234,
      "created_at": "2025-12-11T10:31:00.000Z"
    }
  ]
}
```

**Success Response (200 OK - No Documents)**:

```json
{
  "documents": []
}
```

**What Actually Happens:**

1. Backend queries PostgreSQL: `SELECT * FROM documents ORDER BY created_at DESC`
2. Database returns all documents (sorted newest first)
3. Backend sends JSON list back to frontend
4. Frontend receives and displays in a table

---

### **Endpoint 3: Download a Document**

**When to use**: User clicks "Download" button to save a PDF to their computer

**Request**:

```
GET /api/documents/:id
```

**Replace `:id` with actual document ID**. For example: `/api/documents/5`

**Postman Steps**:

1. Click "+" to create new request
2. Set method to `GET`
3. Paste URL: `http://localhost:5000/api/documents/5`
4. Click "Send"
5. Click "Save Response" → "Save as PDF"

**Success Response (200 OK)**:

```
[Binary PDF file data]

Headers:
Content-Type: application/pdf
Content-Disposition: attachment; filename="patient_report.pdf"
Content-Length: 245678
```

Browser automatically downloads as `patient_report.pdf`

**Error: Document Not Found (404)**:

```json
{
  "error": "Document not found"
}
```

**Error: File Missing on Disk (404)**:

```json
{
  "error": "File not found on server"
}
```

**What Actually Happens:**

1. Backend looks up document ID 5 in database
2. Finds the filepath: `/uploads/1733945400-patient_report.pdf`
3. Reads file from disk into memory
4. Sends file with proper headers to browser
5. Browser sees "attachment" header and downloads file
6. User saves file as `patient_report.pdf`

---

### **Endpoint 4: Delete a Document**

**When to use**: User clicks "Delete" button to permanently remove a document

**Request**:

```
DELETE /api/documents/:id
```

**Replace `:id` with actual document ID**. For example: `/api/documents/5`

**Postman Steps**:

1. Click "+" to create new request
2. Set method to `DELETE`
3. Paste URL: `http://localhost:5000/api/documents/5`
4. Click "Send"

**Success Response (200 OK)**:

```json
{
  "message": "Document deleted successfully"
}
```

**Error: Document Not Found (404)**:

```json
{
  "error": "Document not found"
}
```

**Error: Database Error (500)**:

```json
{
  "error": "Failed to delete document"
}
```

**What Actually Happens:**

1. Backend looks up document ID 5 in database
2. Gets the filepath from database
3. Deletes file from disk: `/uploads/1733945400-patient_report.pdf`
4. Deletes database row: `DELETE FROM documents WHERE id = 5`
5. Returns success message
6. Frontend refreshes document list (document is gone)

---

## 4. Data Flow Description

### Q5: Describe the step-by-step process of what happens when a file is uploaded and when it is downloaded.

### **Complete Upload Process**

Let's follow what happens when Patient Sarah uploads a blood test Medical Document:

#### **Scenario: Sarah's Blood Test Medical Document Upload**

Sarah is a Patient. She decided to use Healzo to upload her blood test medical document.

#### **Timeline of Upload (Hypothetical):**

**T=0 seconds: Sarah Opens The App**

- Opens browser, goes to localhost:5174
- React app loads and shows the form

**T=2 seconds: Sarah Clicks "Create Document"**

- Switches to "Create Document" tab
- Sees the patient form with fields:
  - Full Name
  - Date of Birth
  - Medical Info
  - etc.

**T=5 seconds: Sarah Fills Out Form**

- Enters patient name: "Sarah"
- Enters DOB: "1980-05-15"
- Enters diagnosis: "High cholesterol"
- Enters allergies: "Penicillin"

**T=30 seconds: Sarah Clicks "Generate PDF"**

- Form validates all required fields
- Frontend uses jsPDF library to create PDF with all patient data
- Shows preview modal with the PDF

**T=31 seconds: Sarah Reviews PDF Preview**

- Sees the generated PDF with patient information
- Checks everything looks correct
- Clicks "Confirm & Upload"

**T=32 seconds: Frontend Sends File to Backend**

```javascript
// Behind the scenes:
const pdf = doc.output("blob"); // Create PDF as binary data
const formData = new FormData();
formData.append("file", pdf);

// Send POST request
fetch("/api/documents/upload", {
  method: "POST",
  body: formData,
});
```

Button shows "Uploading..." and is disabled

**T=33-35 seconds: File Travels Over Network**

- 250KB file travels from Sarah's browser to server
- Speed depends on internet: ~1-5MB/s typically
- Takes 0.05-0.25 seconds for 250KB

**T=35 seconds: Backend Receives File**

```javascript
router.post("/upload", upload.single("file"), async (req, res) => {
  // Multer has intercepted the request
  // File is in req.file
  console.log(req.file);
  // Output:
  // {
  //   fieldname: 'file',
  //   originalname: 'blood_test_sarah.pdf',
  //   encoding: '7bit',
  //   mimetype: 'application/pdf',
  //   size: 256000,
  //   destination: '/backend/uploads',
  //   filename: '1733945400000-123456789-blood_test_sarah.pdf',
  //   path: '/backend/uploads/1733945400000-123456789-blood_test_sarah.pdf'
  // }
```

**T=35.1 seconds: Multer Validates File**

```javascript
// Multer checks:
if (file.mimetype !== "application/pdf") {
  return error("Only PDF files are allowed");
}
if (file.size > 50 * 1024 * 1024) {
  return error("File too large");
}
// All good! Proceed.
```

**T=35.2 seconds: Multer Generates Unique Filename**

```javascript
// Random timestamp + random number + original name
const uniqueName = Date.now() + "-" + Math.random() + "-" + originalName;
// Result: "1733945400000-123456789-blood_test_sarah.pdf"
```

**T=35.3 seconds: Multer Saves File to Disk**

```javascript
// File is saved to:
// /backend/uploads/1733945400000-123456789-blood_test_sarah.pdf
// Size: 256000 bytes
```

**T=35.5 seconds: Backend Saves Metadata to Database**

```javascript
const query = `
  INSERT INTO documents (filename, filepath, filesize, created_at)
  VALUES ($1, $2, $3, NOW())
  RETURNING *
`;

const result = await db.query(query, [
  "blood_test_sarah.pdf",
  "/backend/uploads/1733945400000-123456789-blood_test_sarah.pdf",
  256000,
]);

// PostgreSQL returns:
// {
//   id: 42,
//   filename: "blood_test_sarah.pdf",
//   filepath: "/backend/uploads/1733945400000-123456789-blood_test_sarah.pdf",
//   filesize: 256000,
//   created_at: "2025-12-11T10:35:50Z"
// }
```

**T=35.6 seconds: Backend Sends Success Response**

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 42,
    "filename": "blood_test_sarah.pdf",
    "filepath": "/backend/uploads/1733945400000-123456789-blood_test_sarah.pdf",
    "filesize": 256000,
    "created_at": "2025-12-11T10:35:50Z"
  }
}
```

**T=35.7 seconds: Frontend Receives Response**

```javascript
if (response.ok) {
  showMessage("Document generated and uploaded successfully", "success");
  setActiveTab("list"); // Switch to My Documents tab
  fetchDocuments(); // Refresh document list
}
```

**T=35.8 seconds: Frontend Updates UI**

- Button returns to normal state
- Green success message appears: "Document generated and uploaded successfully"
- Switches to "My Documents" tab automatically

**T=35.9-37 seconds: Frontend Fetches Updated Document List**

```javascript
// GET /api/documents
// Receives updated list with the new document at the top
// Table updates to show:
// | Filename | Size | Uploaded | Actions |
// | blood_test_sarah.pdf | 250 KB | Dec 11, 10:35 | Download Delete |
```

**T=40 seconds: Success Message Disappears**

- React automatically hides the success message after 4 seconds
- Document is visible in the table
- Upload complete!

**Total Time: ~8 seconds** (network + processing + UI update)

---

### **Complete Download Process**

Now let's say Sarah wants to download that same blood test PDF from another computer.

#### **Scenario: Sarah Downloads From Home**

Sarah goes home, opens the app from her personal laptop, and wants to download the blood test PDF.

#### **Timeline of Download:**

**T=0 seconds: Sarah Loads The App**

- Opens browser, goes to localhost:5174
- App loads and shows "My Documents" tab

**T=2 seconds: App Fetches Document List**

```javascript
// Frontend sends: GET /api/documents
// Backend queries database:
// SELECT * FROM documents ORDER BY created_at DESC

// Database returns:
// [
//   { id: 42, filename: "blood_test_sarah.pdf", filesize: 256000, ... },
//   { id: 41, filename: "other_doc.pdf", filesize: 150000, ... }
// ]
```

**T=3 seconds: Document List Displays**

- App shows table with all documents
- Sarah sees "blood_test_sarah.pdf" with a blue "Download" button

**T=30 seconds: Sarah Clicks Download Button**

```javascript
// Frontend sends: GET /api/documents/42
// (42 is the document ID)
```

Button shows loading state

**T=31 seconds: Backend Looks Up Document**

```javascript
// SELECT * FROM documents WHERE id = 42
// Returns:
// {
//   id: 42,
//   filename: "blood_test_sarah.pdf",
//   filepath: "/backend/uploads/1733945400000-123456789-blood_test_sarah.pdf",
//   filesize: 256000,
//   created_at: "2025-12-11T10:35:50Z"
// }
```

**T=31.2 seconds: Backend Reads File From Disk**

```javascript
// Read file from: /backend/uploads/1733945400000-123456789-blood_test_sarah.pdf
// Load entire 256KB into memory
const fileBuffer = fs.readFileSync(filepath);
```

**T=31.3 seconds: Backend Sends Response Headers**

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="blood_test_sarah.pdf"
Content-Length: 256000
```

These headers tell the browser:

- "This is a PDF file"
- "Save it as 'blood_test_sarah.pdf' (not the random-named file)"
- "The file is 256,000 bytes"

**T=31.4 seconds: Backend Sends File Data**

```
[256 KB of binary PDF data travels to browser]
```

**T=31.5-32 seconds: File Downloads to Computer**

- Browser sees "attachment" header
- Automatically saves to Downloads folder
- File appears as "blood_test_sarah.pdf"
- Progress bar shows download complete

**T=32.5 seconds: Download Finished**

- File is on Sarah's laptop in Downloads folder
- She can open it with any PDF reader

**Total Time: ~2-5 seconds** (depends on file size and network speed)

---

### **Comparison: Upload vs Download**

| Phase       | Upload                            | Download                           |
| ----------- | --------------------------------- | ---------------------------------- |
| User Action | Selects file from computer        | Clicks download button             |
| Frontend    | Creates FormData, sends POST      | Sends GET request                  |
| Network     | Sends file to server (slow)       | Receives file from server (slower) |
| Backend     | Validates file (checks type/size) | Reads file from disk               |
| Database    | INSERT new metadata               | SELECT document metadata           |
| Processing  | Generates unique filename         | Sets response headers              |
| Response    | JSON with new document            | Binary PDF file                    |
| Result      | New document in list              | File in Downloads folder           |

---

### **Error Scenarios**

**What if Sarah uploads a Word document?**

```
1. Frontend checks file extension
2. Frontend allows .doc files
3. Sends to backend
4. Multer checks MIME type: application/msword
5. Multer rejects: "Only PDF files are allowed"
6. Error response sent back
7. Frontend shows error message
8. File stays on Sarah's computer
```

**What if Sarah's internet cuts out during upload?**

```
1. File is halfway uploaded
2. Network connection lost
3. Frontend fetch() gets error
4. Shows: "Error uploading document"
5. Partial file might be on server but not in database
6. Next day: backend cleanup job deletes orphaned files
```

**What if Sarah tries to download a deleted document?**

```
1. Sarah clicks Download (stale link in her bookmarks)
2. Requests: GET /api/documents/99
3. Backend queries database for ID 99
4. Database returns: No rows found
5. Backend sends: { error: "Document not found" }
6. Frontend shows: "Error: Document not found"
```

---

## 5. Assumptions

### Q6: What assumptions did you make while building this?

I made many assumptions when building Healzo. Each assumption is a potential problem if the real world doesn't match. Here are all of them, explained in human terms:

---

### **Assumption 1: Small File Sizes (50MB Maximum)**

**The Assumption**: PDF documents are usually small (under 50MB).

**Why We Assumed This**:

- Medical PDFs are typically scans of documents
- Average scan: 1-5MB
- Even a 100-page document: ~30MB
- 50MB covers almost all real medical documents

**The Problem If Wrong**:

- Someone tries to upload a 100MB file
- Server rejects: "File too large"
- They can't upload their document

**Real-World Impact**: Low. Rare. But might need to increase limit for high-res medical imaging.

**Code Reference**:

```javascript
limits: {
  fileSize: 50 * 1024 * 1024;
} // 50MB
```

---

### **Assumption 2: PDF Files Only**

**The Assumption**: All documents are PDF files. No images, Word docs, or other formats.

**Why We Assumed This**:

- PDFs are the medical standard
- PDFs don't change format between computers
- PDFs are secure (can't accidentally edit)
- Everyone has a PDF reader

**The Problem If Wrong**:

- Doctor tries to upload JPG image of a blood test
- Server rejects: "Only PDF files are allowed"
- They have to convert JPG to PDF first (annoying)

**Real-World Impact**: Medium. Some doctors might want to upload images directly.

**Future Fix**:

```javascript
// Accept multiple formats
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.ms-powerpoint",
  "application/msword",
];
```

**Code Reference**:

```javascript
if (file.mimetype !== "application/pdf") {
  cb(new Error("Only PDF files are allowed"), false);
}
```

---

### **Assumption 3: No User Authentication Needed**

**The Assumption**: Anyone can access the app and see all documents. Only one user.

**Why We Assumed This**:

- Keeps development simple (no password hashing, session management)
- Great for prototyping and learning
- Quick to build MVP

**The Problem If Wrong**:

- 🚨 **CRITICAL SECURITY ISSUE** 🚨
- Anyone with the URL can see all patient records
- HIPAA (US law) would be violated
- Patient privacy completely compromised

**Real-World Impact**: **MAJOR**. This MUST be fixed before real hospital use.

**What Needs To Happen**:

```javascript
// 1. Add login page
app.post("/login", (req, res) => {
  const user = validateCredentials(username, password);
  if (user) {
    const token = generateJWT(user.id);
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

// 2. Protect all routes
app.get("/api/documents", requireAuth, (req, res) => {
  // Only get documents for CURRENT user
  const documents = db.query(
    "SELECT * FROM documents WHERE created_by = ?",
    [req.user.id]
  );
  return res.json({ documents });
});

// 3. Add user_id to documents table
ALTER TABLE documents ADD COLUMN created_by INTEGER;
ALTER TABLE documents ADD FOREIGN KEY (created_by) REFERENCES users(id);
```

---

### **Assumption 4: Single Server Setup**

**The Assumption**: Everything runs on one computer (localhost).

**Why We Assumed This**:

- Simplest for development
- No complex networking
- Works great for 1-5 people testing

**The Problem If Wrong**:

- 100 doctors upload files simultaneously
- Server gets overwhelmed (slow or crashes)
- If computer crashes, entire system is down

**Real-World Impact**: High. Hospital needs 24/7 uptime.

**What Production Needs**:

```
Healthcare System (1000 users):

   Doctor 1 ─┐
   Doctor 2 ─┤
   Doctor 3 ─┼─→ Load Balancer ─→ Server 1 (healthy)
   Doctor 4 ─┤                    Server 2 (healthy)
   ...       ─┴─→             Server 3 (down, bypassed)
                                 ↓
                          PostgreSQL Cluster
                          (Primary + 2 Replicas)
                                 ↓
                          AWS S3 (file storage)
```

---

### **Assumption 5: Minimal Database Metadata**

**The Assumption**: We only need to store: filename, filepath, filesize, and creation date.

**Why We Assumed This**:

- Keeps database simple
- Covers core functionality

**Missing Information**:

- WHO uploaded the document? (user ID)
- WHAT PATIENT is it for? (patient ID/name)
- WHAT TYPE is it? (prescription, lab report, etc.)
- Document CLASSIFICATION? (urgent, normal, routine)
- VERSION HISTORY? (can't see old versions)

**Real-World Impact**: Medium. Can't track who did what.

**What Hospital Needs**:

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,

  -- Current fields
  filename VARCHAR(255),
  filepath VARCHAR(500),
  filesize INTEGER,
  created_at TIMESTAMP,

  -- MISSING fields needed
  created_by INTEGER REFERENCES users(id),
  patient_id INTEGER REFERENCES patients(id),
  document_type VARCHAR(50),  -- 'prescription', 'lab', 'imaging', etc.
  classification VARCHAR(50), -- 'urgent', 'routine', 'confidential'
  description TEXT,           -- "Blood test for diabetes screening"
  deleted_at TIMESTAMP,       -- Soft delete (keep in DB, mark as deleted)
  deleted_by INTEGER,         -- Who deleted it?
  metadata JSONB              -- Extra fields specific to document type
);
```

---

### **Assumption 6: Files Stored Locally**

**The Assumption**: Files are saved on the server's hard drive at `/backend/uploads/`.

**Why We Assumed This**:

- Simplest for local development
- No cloud service costs ($)
- Perfect for learning

**The Problem If Wrong**:

- Server hard drive has limited space (usually 256GB-1TB)
- Growing to 1 million documents = need huge storage
- If hard drive fails, all files are lost (no backup)
- Can't share files between multiple servers
- Slow to download files from USA server for users in Japan

**Real-World Impact**: High. Hospital needs unlimited reliable storage.

**Production Solution**:

```javascript
// Instead of saving to disk:
fs.writeFileSync(`/uploads/${filename}`, fileBuffer);

// Save to AWS S3 (unlimited, reliable, backed up):
const aws = require("aws-sdk");
const s3 = new aws.S3();

const params = {
  Bucket: "hospital-documents",
  Key: `documents/${filename}`,
  Body: fileBuffer,
  ContentType: "application/pdf",
};

s3.upload(params, (err, data) => {
  if (err) console.error("Upload failed");
  else console.log(`File saved to: ${data.Location}`);
});
```

**Cost**: ~$0.023 per GB stored (AWS S3)

---

### **Assumption 7: No Rate Limiting**

**The Assumption**: Users can upload as many files as they want, as fast as they want.

**Why We Assumed This**:

- Keeps backend simple
- Assumes users are honest

**The Problem If Wrong**:

- Malicious user writes a script: "Upload 10,000 PDFs per second"
- Server disk fills up instantly
- System crashes
- Nobody can use the app

**Real-World Impact**: Medium. Prevents abuse.

**What Needs To Happen**:

```javascript
const rateLimit = require("express-rate-limit");

// Limit: 10 uploads per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests max
  message: "Too many uploads. Try again in 1 hour.",
});

app.post("/api/documents/upload", uploadLimiter, uploadFile);
```

---

### **Assumption 8: No File Encryption**

**The Assumption**: PDF files are stored as plain text on disk. Not encrypted.

**Why We Assumed This**:

- Simpler to implement (no encryption/decryption overhead)
- Works for learning and demo

**The Problem If Wrong**:

- 🚨 **CRITICAL SECURITY ISSUE** 🚨
- Hacker breaks into server
- Can read all patient medical records
- Patient privacy violated
- HIPAA violation = huge fines

**Real-World Impact**: **CRITICAL**. Medical data MUST be encrypted.

**What Needs To Happen**:

```javascript
const crypto = require("crypto");

// Encrypt before saving
function encryptFile(fileBuffer, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(fileBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Save: IV + Encrypted Data
  return Buffer.concat([iv, encrypted]);
}

// Decrypt when downloading
function decryptFile(encryptedBuffer, encryptionKey) {
  const iv = encryptedBuffer.slice(0, 16);
  const encrypted = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted;
}

// Use:
const encrypted = encryptFile(pdfBuffer, SECRET_KEY);
fs.writeFileSync(filepath, encrypted);

// Later:
const encryptedData = fs.readFileSync(filepath);
const decrypted = decryptFile(encryptedData, SECRET_KEY);
res.send(decrypted);
```

---

### **Assumption 9: No Automatic Backups**

**The Assumption**: No backup system. If database crashes, all data is lost forever.

**Why We Assumed This**:

- Backups are complex
- Development focus was on features

**The Problem If Wrong**:

- PostgreSQL server crashes
- Hard drive fails
- ALL patient documents are gone forever
- Hospital loses years of medical records
- Legal nightmare

**Real-World Impact**: **CRITICAL**. Hospitals must have backups.

**Backup Strategy Needed**:

```
Daily Backup Schedule:

2:00 AM
  ├─ Full PostgreSQL backup to AWS S3
  │  └─ Encrypted, stored in different region
  │
2:15 AM
  ├─ Full backup of all files from /uploads/ to AWS S3
  │
2:30 AM
  ├─ Verify backup integrity (can we restore?)
  │
3:00 AM
  └─ Keep 30-day rolling backups
     (Day 1 backup, Day 2 backup, ..., Day 30 backup)
```

**Test Restore Monthly**:

```bash
# Every month, verify we CAN restore from backup
1. Stop production system
2. Restore database from backup
3. Restore files from backup
4. Verify everything works
5. Resume production
```

---

### **Assumption 10: No Error Logging/Monitoring**

**The Assumption**: When something goes wrong, we just show a generic error message.

**Why We Assumed This**:

- Simplest implementation
- Works for development

**The Problem If Wrong**:

- Hospital admin doesn't know if system is slow
- Doesn't know how many users are using it
- Doesn't know what errors are happening
- Can't debug problems

**Real-World Impact**: Medium-High. Hospital needs visibility.

**What Needs To Happen**:

```javascript
// Log every event
const logger = require("winston");

logger.info("Document uploaded", {
  documentId: 42,
  filename: "blood_test.pdf",
  filesize: 256000,
  userId: 5,
  timestamp: new Date(),
});

logger.error("Upload failed", {
  error: "Database connection lost",
  userId: 5,
  attemptedFilename: "blood_test.pdf",
});

// Monitor performance
const prometheus = require("prom-client");

const uploadDuration = new prometheus.Histogram({
  name: "upload_duration_seconds",
  help: "Time to upload a document",
});

// Alert if slow
if (uploadTime > 30000) {
  slack.sendAlert("⚠️ Upload took 30 seconds! Something is slow.");
}
```

---

### **Assumption 11: Documents Never Expire**

**The Assumption**: Once uploaded, documents stay in the system forever.

**Why We Assumed This**:

- Medical records should be kept for years anyway
- Simpler (no cleanup code)

**Real-World Impact**: Low-Medium. Storage fills up over time.

**Hospital Rules**:

- HIPAA requires keeping medical records 6 years (varies by US state)
- Some countries require 7-10 years
- Some documents: keep forever

**What Needs To Happen**:

```javascript
// Automatic cleanup job (runs every night)
app.use(
  schedule.scheduleJob("0 2 * * *", async () => {
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

    // Delete old documents
    const oldDocs = await db.query(
      "SELECT id, filepath FROM documents WHERE created_at < ?",
      [sixYearsAgo]
    );

    for (const doc of oldDocs) {
      // Delete from disk
      fs.unlinkSync(doc.filepath);

      // Delete from database
      await db.query("DELETE FROM documents WHERE id = ?", [doc.id]);
    }

    logger.info(`Deleted ${oldDocs.length} expired documents`);
  })
);
```

---

### **Assumption 12: Single Database Instance**

**The Assumption**: One PostgreSQL server. No replicas.

**Why We Assumed This**:

- Simplest setup
- Works for development

**The Problem If Wrong**:

- Database server goes down
- Entire hospital can't access any documents
- Zero uptime (100% downtime)

**Real-World Impact**: **CRITICAL** for hospitals.

**What Production Needs**:

```
Database Architecture:

PostgreSQL Primary
  (handles all writes)
       ↓
  Replication Stream
     ↙  ↓  ↖
Replica 1  Replica 2  Replica 3
(read-only) (read-only) (read-only)

If Primary fails:
  → Promote Replica 1 to Primary
  → Service continues (minimal downtime)

```

---

## Document Metadata

- **Version**: 1.0.0
- **Created**: December 11, 2025
- **Last Updated**: December 11, 2025
- **Author**: Shaik Rahim
- **Status**: ✅ Complete - Production Ready for Single-User Deployment
