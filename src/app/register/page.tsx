import React, { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", age: "", email: "", password: "", phone: "", tier: "basic" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    });
    const data = await res.json();
    setMessage(data.success ? "Registration successful!" : data.error);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <h1 className="text-3xl font-bold text-white mb-6">Register</h1>
      <form className="bg-white/10 rounded-xl p-8 w-full max-w-md shadow-lg flex flex-col gap-4" onSubmit={handleSubmit}>
        <input className="p-2 rounded bg-gray-900 text-white" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="p-2 rounded bg-gray-900 text-white" name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input className="p-2 rounded bg-gray-900 text-white" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="p-2 rounded bg-gray-900 text-white" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input className="p-2 rounded bg-gray-900 text-white" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <select className="p-2 rounded bg-gray-900 text-white" name="tier" value={form.tier} onChange={handleChange} required>
          <option value="basic">Basic</option>
          <option value="plus">Plus</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-2" type="submit">Register</button>
        {message && <p className="text-red-400 mt-2">{message}</p>}
      </form>
    </div>
  );
}
