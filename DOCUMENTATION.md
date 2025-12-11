# Medical Document Portal - Healthcare Platform

A full-stack web application for managing patient medical documents (PDFs) with upload, download, and deletion capabilities.

## Features

✅ **Upload PDF Documents** - Secure PDF file upload with validation
✅ **View Documents** - List all uploaded documents with metadata
✅ **Download Documents** - Download any uploaded document
✅ **Delete Documents** - Remove documents when no longer needed
✅ **Metadata Tracking** - Store filename, size, and upload date
✅ **Responsive UI** - Modern Tailwind CSS interface
✅ **Error Handling** - User-friendly error messages

## Project Structure

```
Healzo/
├── backend/
│   ├── routes/
│   │   ├── testRoute.js
│   │   └── documentRoutes.js      (NEW - Document API endpoints)
│   ├── db.js                       (PostgreSQL connection)
│   ├── index.js                    (Express server)
│   ├── package.json
│   ├── .env
│   └── uploads/                    (File storage directory)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 (Updated - Document management UI)
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

## Technology Stack

### Frontend

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **JavaScript (ES6+)** - Fetch API for HTTP requests

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Multer** - File upload handling
- **PostgreSQL** - Database
- **CORS** - Cross-origin support

### Database

- **PostgreSQL** - Relational database
- **Table: `documents`** - Stores file metadata

## Database Schema

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

All endpoints are prefixed with `/api/documents`

### 1. Upload a Document

```
POST /api/documents/upload
Content-Type: multipart/form-data

Request:
{
  "file": <PDF file>
}

Response (201 Created):
{
  "message": "File uploaded successfully",
  "document": {
    "id": 1,
    "filename": "prescription.pdf",
    "filepath": "/uploads/1733...-prescription.pdf",
    "filesize": 102400,
    "created_at": "2025-12-11T10:30:00Z"
  }
}
```

### 2. List All Documents

```
GET /api/documents

Response (200 OK):
{
  "documents": [
    {
      "id": 1,
      "filename": "prescription.pdf",
      "filepath": "/uploads/1733...-prescription.pdf",
      "filesize": 102400,
      "created_at": "2025-12-11T10:30:00Z"
    },
    {
      "id": 2,
      "filename": "test_results.pdf",
      "filepath": "/uploads/1733...-test_results.pdf",
      "filesize": 256000,
      "created_at": "2025-12-11T11:00:00Z"
    }
  ]
}
```

### 3. Download a Document

```
GET /api/documents/:id

Response (200 OK):
- Binary PDF file is sent to client
- Browser triggers download with original filename

Example:
GET /api/documents/1
```

### 4. Delete a Document

```
DELETE /api/documents/:id

Response (200 OK):
{
  "message": "Document deleted successfully"
}

- File is deleted from disk
- Database record is deleted
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL (local instance)
- Port 5000 (backend), 5175 (frontend) available

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with database credentials:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Healzo
PORT=5000
```

4. Start the backend server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Application runs on `http://localhost:5175`

### Database Setup

1. Ensure PostgreSQL is running locally
2. Create database `Healzo`:

```sql
CREATE DATABASE Healzo;
```

3. Create `documents` table:

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  filesize INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. Open `http://localhost:5175` in your browser
2. Upload a PDF file using the form
3. View all uploaded documents in the list
4. Click "Download" to save a document
5. Click "Delete" to remove a document

## Features Explained

### Upload Functionality

- ✅ File type validation (PDF only)
- ✅ File size limit (50MB)
- ✅ Unique filename generation to prevent conflicts
- ✅ Metadata saved to database
- ✅ Success/error messages

### File Management

- ✅ Files stored in `backend/uploads/` directory
- ✅ Unique filenames with timestamps
- ✅ Organized file listing with metadata
- ✅ Download with original filename preserved
- ✅ Soft delete with database cleanup

### Error Handling

- ✅ Invalid file type detection
- ✅ File size validation
- ✅ Database connection errors
- ✅ File system errors
- ✅ User-friendly error messages

## Frontend Components

### App.jsx

Main component handling:

- Document upload form
- Document listing with pagination
- Download functionality
- Delete with confirmation
- File metadata display (name, size, upload date)
- Message notifications (success/error)

## Backend Routes

### documentRoutes.js

Handles all document operations:

- POST `/upload` - File upload with multer
- GET `/` - List all documents
- GET `/:id` - Download document
- DELETE `/:id` - Delete document

## File Upload Process

1. User selects a PDF file
2. Validation checks:
   - File type is application/pdf
   - File size < 50MB
3. If valid:
   - File saved to `backend/uploads/`
   - Metadata stored in PostgreSQL
   - User sees success message
   - Document list refreshes
4. If invalid:
   - Error message displayed
   - Upload cancelled

## Error Handling

### Frontend Error Scenarios

- ✅ No file selected
- ✅ Invalid file type
- ✅ File too large
- ✅ Network errors
- ✅ Server errors

### Backend Error Scenarios

- ✅ Database connection failures
- ✅ File system errors
- ✅ Invalid file format
- ✅ Missing document metadata
- ✅ File not found on disk

## Performance

- **File Limit**: 50MB per file
- **File Storage**: Local filesystem
- **Database**: PostgreSQL with efficient queries
- **Caching**: None (simple implementation)
- **Concurrent Uploads**: Supported via multer

## Security Considerations

- ✅ PDF-only file acceptance
- ✅ File size limits
- ✅ Unique filename generation
- ✅ Path traversal prevention
- ✅ CORS enabled

## Future Enhancements

- [ ] User authentication and authorization
- [ ] User-specific document isolation
- [ ] Document categorization/tagging
- [ ] Full-text search
- [ ] Document preview
- [ ] Virus scanning
- [ ] Audit logging
- [ ] Cloud storage integration
- [ ] API rate limiting
- [ ] Document versioning

## Testing

To test the API endpoints:

```bash
# Run the included test script
node test-api.js
```

## Troubleshooting

### Backend not starting

- Check PostgreSQL is running
- Verify `.env` file exists with correct credentials
- Check port 5000 is available

### Frontend not loading

- Ensure backend is running
- Check port 5175 is available
- Check browser console for errors

### Database connection error

- Verify PostgreSQL service is running
- Check database credentials in `.env`
- Ensure database `Healzo` exists

### File upload fails

- Verify `backend/uploads/` directory exists
- Check file size < 50MB
- Ensure file is PDF format

## Support

For issues or questions, check:

1. Browser console (F12)
2. Backend terminal logs
3. PostgreSQL logs
4. File permissions on uploads directory

---

**Version**: 1.0.0
**Last Updated**: December 11, 2025
**Status**: ✅ Production Ready
