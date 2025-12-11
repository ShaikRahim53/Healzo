// Test script to verify all API endpoints
const API_BASE_URL = "http://localhost:5000/api/documents";

async function testGetDocuments() {
  console.log("\n=== Testing GET /documents ===");
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    console.log(
      "✓ Successfully fetched documents:",
      data.documents?.length || 0,
      "documents"
    );
    return data.documents || [];
  } catch (error) {
    console.error("✗ Failed to fetch documents:", error.message);
    return [];
  }
}

async function testDownloadDocument(documentId, filename) {
  console.log(`\n=== Testing GET /documents/${documentId} (Download) ===`);
  try {
    const response = await fetch(`${API_BASE_URL}/${documentId}`);
    if (response.ok) {
      console.log("✓ Successfully prepared document for download:", filename);
      return true;
    } else {
      console.error("✗ Download failed:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("✗ Download error:", error.message);
    return false;
  }
}

async function testDeleteDocument(documentId) {
  console.log(`\n=== Testing DELETE /documents/${documentId} ===`);
  try {
    const response = await fetch(`${API_BASE_URL}/${documentId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (response.ok) {
      console.log("✓ Successfully deleted document");
      return true;
    } else {
      console.error("✗ Delete failed:", data.error);
      return false;
    }
  } catch (error) {
    console.error("✗ Delete error:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("🏥 Medical Document Portal - API Test Suite");
  console.log("==========================================");

  // Test 1: Get documents
  const documents = await testGetDocuments();

  if (documents.length > 0) {
    const firstDoc = documents[0];

    // Test 2: Download a document
    await testDownloadDocument(firstDoc.id, firstDoc.filename);

    // Test 3: Delete a document (commented out to preserve test data)
    // await testDeleteDocument(firstDoc.id);
  }

  console.log("\n✅ API Tests Complete!");
}

// Run tests
runTests();
