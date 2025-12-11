import { useState } from "react";

export default function PatientDocumentForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    // Patient Information
    fullName: "",
    dateOfBirth: "",
    gender: "not-specified",
    contactNumber: "",
    email: "",
    address: "",

    // Medical Information
    patientID: "",
    primaryDiagnosis: "",
    currentMedications: "",
    allergies: "",
    pastMedicalHistory: "",
    visitDate: new Date().toISOString().split("T")[0],

    // Test/Report Details
    reportType: "prescription",
    description: "",
    doctorName: "",

    // Additional
    additionalComments: "",
    consent: false,
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateAge = () => {
    if (!formData.dateOfBirth) return "";
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
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

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Full Name is required";
    }
    if (!formData.description.trim()) {
      return "Description/Notes is required";
    }
    if (!formData.consent) {
      return "You must consent to upload the document";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    onSubmit(formData);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    setShowPreview(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Patient Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            1
          </span>
          Patient Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., Shaik Rahim"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age (Auto-calculated)
            </label>
            <input
              type="text"
              value={calculateAge() || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g., +91 9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., rs123@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, city, state"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Medical Information Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            2
          </span>
          Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID (Optional)
            </label>
            <input
              type="text"
              name="patientID"
              value={formData.patientID}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Visit / Report Date
            </label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Diagnosis / Condition
            </label>
            <input
              type="text"
              name="primaryDiagnosis"
              value={formData.primaryDiagnosis}
              onChange={handleChange}
              placeholder="e.g., Hypertension"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g., Penicillin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Medications
            </label>
            <textarea
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
              placeholder="e.g., Medication 1 - 10mg twice daily, Medication 2 - 5mg once daily"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Past Medical History (Brief)
            </label>
            <textarea
              name="pastMedicalHistory"
              value={formData.pastMedicalHistory}
              onChange={handleChange}
              placeholder="e.g., Had appendectomy in 2015, history of asthma"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Test/Report Details Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            3
          </span>
          Test / Report Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Report *
            </label>
            <select
              name="reportType"
              value={formData.reportType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="blood_test">Blood Test</option>
              <option value="imaging">Imaging (X-ray, CT, MRI)</option>
              <option value="prescription">Prescription</option>
              <option value="discharge_summary">Discharge Summary</option>
              <option value="referral_note">Referral Note</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor / Specialist Name
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="e.g., Dr. Ram, MD"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / Notes *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter test results, prescription details, clinical notes, or any other relevant information..."
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
            4
          </span>
          Additional Information
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            name="additionalComments"
            value={formData.additionalComments}
            onChange={handleChange}
            placeholder="Any additional information or comments..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Consent Section */}
      <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="w-5 h-5 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-600 cursor-pointer"
          />
          <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
            <span className="font-semibold text-red-700">*</span> I confirm that
            this document is accurate and I consent to upload it to Healzo
            Portal. I understand that the information provided will be stored
            securely.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isLoading}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          Preview PDF
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? "Generating & Uploading..." : "Generate & Upload"}
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Document Preview</h2>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4 text-sm">
              <div>
                <p className="font-bold text-lg">
                  {formData.reportType
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-gray-600 text-xs">Patient Name</p>
                  <p className="font-semibold">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Date of Birth</p>
                  <p className="font-semibold">
                    {formData.dateOfBirth || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Age</p>
                  <p className="font-semibold">{calculateAge() || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Gender</p>
                  <p className="font-semibold">
                    {formData.gender || "Not provided"}
                  </p>
                </div>
              </div>

              {formData.contactNumber && (
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-xs">Contact Number</p>
                  <p className="font-semibold">{formData.contactNumber}</p>
                </div>
              )}

              {formData.primaryDiagnosis && (
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-xs">Primary Diagnosis</p>
                  <p className="font-semibold">{formData.primaryDiagnosis}</p>
                </div>
              )}

              {formData.knownAllergies && (
                <div>
                  <p className="text-gray-600 text-xs">Known Allergies</p>
                  <p className="font-semibold text-red-600">
                    {formData.knownAllergies}
                  </p>
                </div>
              )}

              {formData.doctorName && (
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-xs">Doctor / Specialist</p>
                  <p className="font-semibold">{formData.doctorName}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-gray-600 text-xs">Description / Notes</p>
                <p className="whitespace-pre-wrap text-gray-800">
                  {formData.description}
                </p>
              </div>

              {formData.additionalComments && (
                <div className="border-t pt-4">
                  <p className="text-gray-600 text-xs">Additional Comments</p>
                  <p className="text-gray-800">{formData.additionalComments}</p>
                </div>
              )}

              <div className="border-t pt-4 text-gray-500 text-xs">
                <p>Generated: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Back to Edit
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  handleSubmit({
                    preventDefault: () => {},
                  });
                }}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
