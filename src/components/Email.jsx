import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Email = () => {
  const initialData = {
    name: "",
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      await emailjs.sendForm(
        "service_jgppl1a",
        "template_qv7c8vs",
        e.target.form,
        "wVVUO2SdWymVMbuXv"
      );
      console.log("Email sent successfully!");
      setData(initialData);
    } catch (error) {
      console.error("Error sending email:", error);
    }
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
          disabled={passwordError !== ""}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Email;
