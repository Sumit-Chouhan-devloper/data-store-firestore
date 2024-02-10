import React, { useState, useEffect } from "react";
import { db } from "./Firebase"; // Importing the Firebase database instance
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore"; // Importing Firestore functions

const Email = () => {
  const initialData = {
    name: "",
    email: "",
    password: "",
  };

  const [data, setData] = useState(initialData); // State for form data
  const [passwordError, setPasswordError] = useState(""); // State for password validation error
  const [formSubmissions, setFormSubmissions] = useState([]); // State for form submissions
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null); // State for selected submission ID
  const [showUpdateButton, setShowUpdateButton] = useState(false); // State to control the visibility of the Update button
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      // Password validation
      const isValidPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(
        value
      );
      if (!isValidPassword) {
        setPasswordError(
          "Password must be 6 to 20 characters and contain at least one numeric digit, one uppercase, and one lowercase letter."
        );
      } else {
        setPasswordError("");
      }
    }
    setData({ ...data, [name]: value }); // Update form data
    setShowUpdateButton(true); // Show the Update button when any input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...data, file: selectedFile };
    // Add new form submission to the database
    await addDoc(collection(db, "form-new-data"), formData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        setData(initialData); // Reset form data
        setSelectedFile(null); // Reset selected file
        setShowUpdateButton(false); // Hide the Update button after submitting
        getFormSubmissions(); // Refresh submissions after adding new data
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const getFormSubmissions = async () => {
    // Retrieve form submissions from the database
    const submissions = [];
    const querySnapshot = await getDocs(collection(db, "form-new-data"));
    querySnapshot.forEach((doc) => {
      const submissionData = doc.data();
      // Check if the submission has a file
      if (submissionData.file) {
        // Assuming the file is stored as a URL in the database
        // You may need to adjust this based on how you're storing the file
        submissionData.fileUrl = submissionData.file;
      }
      submissions.push({ id: doc.id, ...submissionData });
    });
    setFormSubmissions(submissions); // Update form submissions state
  };

  const handleDelete = async (id) => {
    // Delete a form submission
    await deleteDoc(doc(db, "form-new-data", id));
    getFormSubmissions(); // Refresh submissions after deleting data
  };

  // update the form data
  const handleUpdate = async () => {
    if (!selectedSubmissionId) return;
    // Update a form submission
    await updateDoc(doc(db, "form-new-data", selectedSubmissionId), data);
    setData(initialData); // Reset form data
    setSelectedSubmissionId(null); // Reset selected submission ID
    setShowUpdateButton(false); // Hide the Update button after updating
    getFormSubmissions(); // Refresh submissions after updating data
  };

  useEffect(() => {
    getFormSubmissions(); // Fetch form submissions when component mounts
  }, []);

  // form data for edition the data
  const handleEdit = (submission) => {
    setData(submission); // Set form data to the selected submission
    setSelectedSubmissionId(submission.id); // Set the selected submission ID
    setShowUpdateButton(true); // Show the Update button when editing
  };

  return (
    <div className="flex justify-center flex-col h-screen items-center">
      <form className="bg-slate-600 w-[400px] mx-auto flex flex-col gap-4 p-6 rounded-md">
        <h2 className="text-center text-white text-2xl mb-4">Register Form</h2>
        <input
          name="name"
          value={data.name}
          onChange={handleChange}
          className="rounded-md outline-none px-2 py-1"
          type="text"
          placeholder="Name"
        />
        <input
          name="email"
          value={data.email}
          onChange={handleChange}
          className="rounded-md outline-none px-2 py-1"
          type="email"
          placeholder="Email"
        />
        <input
          name="password"
          value={data.password}
          onChange={handleChange}
          className="rounded-md outline-none px-2 py-1"
          type="password"
          placeholder="Password"
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        {passwordError && (
          <p className="text-red-500 text-sm">{passwordError}</p>
        )}
        <button
          onClick={handleSubmit}
          className="py-1 rounded-md hover:bg-red-500 transition-all duration-300 bg-green-500 text-white font-bold"
          disabled={
            Object.values(data).some((value) => value.trim() === "") ||
            passwordError
          }
        >
          Submit
        </button>
        {showUpdateButton && (
          <button
            onClick={handleUpdate}
            className="py-1 rounded-md hover:bg-red-500 transition-all duration-300 bg-blue-500 text-white font-bold"
            disabled={!selectedSubmissionId} // Disable if no submission selected
          >
            Update
          </button>
        )}
      </form>
      <div className="mt-8">
        <h2 className="text-center text-white text-2xl mb-4">
          Form Submissions
        </h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Password</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td className="border px-4 py-2">{submission.name}</td>
                <td className="border px-4 py-2">{submission.email}</td>
                <td className="border px-4 py-2">{submission.password}</td>
                <td className="border px-4 py-2">
                  {submission.fileUrl && (
                    <img
                      src={submission.fileUrl}
                      alt="Submission Image"
                      style={{ maxWidth: "100px" }}
                    />
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mr-2 rounded"
                    onClick={() => handleEdit(submission)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(submission.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Email;
