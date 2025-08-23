import React, { useState } from "react";
import Field from "../components/Field";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to a backend.
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Contact Us</h2>
      <p className="text-neutral-600 mt-2 text-center">Have questions? We're here to help!</p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Field label="Name">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
          </Field>
          <Field label="Email">
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 rounded-xl border border-neutral-300" />
          </Field>
          <Field label="Message">
            <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full px-3 py-2 rounded-xl border border-neutral-300"></textarea>
          </Field>
          <button type="submit" className="w-full px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow">Send Message</button>
        </form>
      ) : (
        <div className="mt-8 p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-center">
          <h3 className="font-bold text-lg">Message Sent!</h3>
          <p className="mt-2 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
          <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-green-700 hover:underline">Send another message</button>
        </div>
      )}

      <div className="mt-10 text-center text-neutral-600">
        <p>Email: <a href="mailto:info@visprint.com" className="text-indigo-600 hover:underline">info@visprint.com</a></p>
        <p>Phone: <a href="tel:+18001234567" className="text-indigo-600 hover:underline">1-800-123-4567</a></p>
      </div>
    </section>
  );
}

