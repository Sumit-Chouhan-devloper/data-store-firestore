import React, { useState } from "react";

const Email = () => {
  const initialData = {
    name: "",
    email: "",
    number: "",
    password: "",
  };
  const [data, setData] = useState(initialData);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
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
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any field is empty or if there's a password error
    if (
      Object.values(data).some((value) => value.trim() === "") ||
      passwordError
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }
    console.log(data);
    setData(initialData);
  };

  return (
    <div className="flex justify-center h-screen items-center">
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
          name="number"
          value={data.number}
          onChange={handleChange}
          className="rounded-md outline-none px-2 py-1"
          type="number"
          placeholder="Number"
        />
        <input
          name="password"
          value={data.password}
          onChange={handleChange}
          className="rounded-md outline-none px-2 py-1"
          type="password"
          placeholder="Password"
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
      </form>
    </div>
  );
};

export default Email;
