import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import PatientDocumentForm from "./PatientDocumentForm";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [activeTab, setActiveTab] = useState("form"); // 'upload', 'form', or 'list'

  // Fetch documents on component mount
  useEffect(() => {
    const initializeFetch = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/documents`);
        const data = await response.json();

        if (response.ok) {
          // support both response shapes: either an array (legacy test route)
          // or an object { documents: [...] }
          const rawDocs = Array.isArray(data) ? data : data.documents || [];
          const sanitized = rawDocs.map((d) => ({
            ...d,
            filename: d.filename || "(unnamed)",
            // normalize filesize (accept strings like "29mb" or numbers)
            filesize: parseFileSize(d.filesize),
            created_at: d.created_at || new Date().toISOString(),
          }));
          setDocuments(sanitized);
        } else {
          showMessage("Failed to fetch documents", "error");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showMessage("Error fetching documents", "error");
      } finally {
        setLoading(false);
      }
    };

    initializeFetch();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/documents`);
      const data = await response.json();

      if (response.ok) {
        const rawDocs = Array.isArray(data) ? data : data.documents || [];
        const sanitized = rawDocs.map((d) => ({
          ...d,
          filename: d.filename || "(unnamed)",
          filesize: parseFileSize(d.filesize),
          created_at: d.created_at || new Date().toISOString(),
        }));
        setDocuments(sanitized);
      } else {
        showMessage("Failed to fetch documents", "error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showMessage("Error fetching documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        showMessage("Please select a PDF file", "error");
        setFile(null);
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        showMessage("File size must be less than 50MB", "error");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      showMessage("Please select a file to upload", "error");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Document uploaded successfully", "success");
        setFile(null);
        const fileInput = document.getElementById("file-input");
        if (fileInput) fileInput.value = "";
        await fetchDocuments();
      } else {
        showMessage(data.error || "Failed to upload document", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showMessage("Error uploading document", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const response = await fetch(`${API_BASE}/api/documents/${id}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        showMessage("Failed to download document", "error");
      }
    } catch (error) {
      console.error("Download error:", error);
      showMessage("Error downloading document", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/documents/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Document deleted successfully", "success");
        await fetchDocuments();
      } else {
        showMessage(data.error || "Failed to delete document", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Error deleting document", "error");
    }
  };

  const handleGenerateAndUpload = async (formData) => {
    try {
      setUploading(true);

      // Create PDF using jsPDF with comprehensive medical information
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const textWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add section with color
      const addColoredSection = (title, bgColor, textColor) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = margin;
        }
        doc.setFillColor(...bgColor);
        doc.rect(margin, yPosition - 4, textWidth, 8, "F");
        doc.setTextColor(...textColor);
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(title, margin + 5, yPosition + 2);
        doc.setTextColor(0, 0, 0);
        yPosition += 15;
      };

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("MEDICAL DOCUMENT", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      // Patient Header Section (Indigo)
      addColoredSection(
        "1. PATIENT INFORMATION",
        [79, 70, 229],
        [255, 255, 255]
      );
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");

      const patientInfo = [
        `Full Name: ${formData.fullName || "-"}`,
        `Date of Birth: ${formData.dateOfBirth || "-"}`,
        `Age: ${
          formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : "-"
        } years`,
        `Gender: ${formData.gender || "-"}`,
        `Patient ID: ${formData.patientID || "-"}`,
        `Contact: ${formData.contactNumber || "-"}`,
        `Email: ${formData.email || "-"}`,
        `Address: ${formData.address || "-"}`,
      ];

      patientInfo.forEach((info) => {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(info, margin + 5, yPosition);
        yPosition += 6;
      });

      yPosition += 3;

      // Medical Information Section (Green)
      addColoredSection(
        "2. MEDICAL INFORMATION",
        [34, 197, 94],
        [255, 255, 255]
      );

      const medicalInfo = [
        `Diagnosis: ${formData.primaryDiagnosis || "-"}`,
        `Visit Date: ${formData.visitDate || "-"}`,
        `Medications: ${formData.currentMedications || "-"}`,
      ];

      medicalInfo.forEach((info) => {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(info, margin + 5, yPosition);
        yPosition += 6;
      });

      // Allergies in red box
      if (formData.allergies) {
        yPosition += 3;
        doc.setFillColor(239, 68, 68);
        doc.rect(margin, yPosition - 4, textWidth, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, "bold");
        doc.text(
          "⚠ ALLERGIES: " + formData.allergies,
          margin + 5,
          yPosition + 2
        );
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
      }

      if (formData.pastMedicalHistory) {
        doc.setFont(undefined, "normal");
        doc.text(
          `Past History: ${formData.pastMedicalHistory}`,
          margin + 5,
          yPosition
        );
        yPosition += 6;
      }

      yPosition += 3;

      // Test/Report Details Section (Purple)
      addColoredSection(
        "3. TEST/REPORT DETAILS",
        [168, 85, 247],
        [255, 255, 255]
      );

      const reportInfo = [
        `Report Type: ${formData.reportType || "-"}`,
        `Doctor Name: ${formData.doctorName || "-"}`,
        `Description: ${formData.description || "-"}`,
      ];

      reportInfo.forEach((info) => {
        if (yPosition > pageHeight - margin - 10) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(info, margin + 5, yPosition);
        yPosition += 6;
      });

      yPosition += 3;

      // Additional Comments Section (if present)
      if (formData.additionalComments) {
        addColoredSection(
          "4. ADDITIONAL INFORMATION",
          [234, 179, 8],
          [0, 0, 0]
        );
        const splitComments = doc.splitTextToSize(
          formData.additionalComments,
          textWidth
        );
        splitComments.forEach((line) => {
          if (yPosition > pageHeight - margin - 10) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin + 5, yPosition);
          yPosition += 6;
        });
      }

      // Footer with generation timestamp
      yPosition = pageHeight - 15;
      doc.setFontSize(8);
      doc.setFont(undefined, "italic");
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      // Convert PDF to blob and upload
      const pdfBlob = doc.output("blob");
      const timestamp = Date.now();
      const filename = `medical_document_${formData.fullName
        .replace(/\s+/g, "_")
        .toLowerCase()}_${timestamp}.pdf`;

      const formDataObj = new FormData();
      formDataObj.append("file", pdfBlob, filename);

      const response = await fetch(`${API_BASE}/api/documents/upload`, {
        method: "POST",
        body: formDataObj,
      });

      const uploadData = await response.json();

      if (response.ok) {
        showMessage("Document generated and uploaded successfully", "success");
        await fetchDocuments();
        // Switch to documents list tab
        setActiveTab("list");
      } else {
        showMessage(
          uploadData.error || "Failed to upload generated document",
          "error"
        );
      }
    } catch (error) {
      console.error("PDF generation/upload error:", error);
      showMessage("Error generating or uploading document", "error");
    } finally {
      setUploading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatFileSize = (bytes) => {
    // handle non-numeric gracefully
    if (bytes === 0) return "0 Bytes";
    if (bytes == null) return "-";
    if (typeof bytes !== "number" || !isFinite(bytes)) {
      // return string representation for unexpected values
      return String(bytes);
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Parse filesize values stored in the DB. Accept numbers or human-friendly strings like "29mb"
  function parseFileSize(val) {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    const s = String(val).trim().toLowerCase();
    // try to extract a numeric prefix
    const num = parseFloat(s.replace(/,/g, ""));
    if (Number.isNaN(num)) return 0;
    if (s.includes("kb")) return Math.round(num * 1024);
    if (s.includes("mb")) return Math.round(num * 1024 * 1024);
    if (s.includes("gb")) return Math.round(num * 1024 * 1024 * 1024);
    // if just a number assume bytes
    return Math.round(num);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Healzo</h1>
          <p className="text-gray-600">
            Upload and manage your medical documents safely
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-white font-medium ${
              messageType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "form"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Create Document
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "upload"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "list"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            My Documents
          </button>
        </div>

        {/* Create Document Form Tab */}
        {activeTab === "form" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <PatientDocumentForm
              onSubmit={handleGenerateAndUpload}
              isLoading={uploading}
            />
          </div>
        )}

        {/* Upload PDF Tab */}
        {activeTab === "upload" && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upload Existing PDF
            </h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label
                  htmlFor="file-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select PDF File
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100
                    cursor-pointer border border-gray-300 rounded-lg p-3"
                />
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </form>
          </div>
        )}

        {/* Documents List Tab */}
        {activeTab === "list" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Documents
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No documents yet. Create or upload one to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Filename
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Size
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Uploaded
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 text-gray-800 font-medium">
                          {doc.filename}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatFileSize(doc.filesize)}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {formatDate(doc.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleDownload(doc.id, doc.filename)
                              }
                              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
