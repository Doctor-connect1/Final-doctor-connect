'use client';
import React from 'react';
import Navbar from '@/components/Home/Navbar';

export default function ContactUs() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          topic: data.topic,
          message: data.message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      alert(result.message || 'Message sent successfully!');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <img 
          src="https://s3-alpha-sig.figma.com/img/29a1/83e9/4cfaa1c70f9923b9dff53e831733a031?Expires=1740355200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p2TueIS3OcgaRSEnzNVd29tl6sHuh3nE4NYPm9Uz-RNTenBtQdT8gN2miKK1eNny~wSuqAgenMeYojuG0WD0ch-s1AuzJbCFCbxTrbv75V49C3O2~At5HNWoC3LY5GLkBuXqEqX6M9oKXLmMPMy~5dsNWF3j2xiI-M1NAES8iLvIjb2fjKDs9Oa6K8lsg93szn7fUKSmR4AILpd1OnemGlsqY6I~2B~RJtaRbTeNaGPCBBDp5ACW3HhRRm4yUTLO2rXOe01S8G1Cio4Wx-JBVPHNJUhrOhwgSamfumO6T39PXOyZDob-eD~Dg3IBYNR66RUwUM12J~LTZknQSbb~vQ__" // Replace with your image URL
          alt="Healthcare Facility"
          className="w-full h-auto max-h-65 object-cover mb-4"
        />
        <h1 className="text-1xl font-bold mb-3">Get In Touch</h1>
        <h1 className='text-3xl font-bold mb-2'>Contact Us</h1>
        <p className="mb-8 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <form className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                placeholder="Enter your first name" 
                className="border border-teal-600 p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                placeholder="Enter your last name" 
                className="border border-teal-600 p-3 rounded-lg w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col">
              <label className="mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                className="border border-teal-600 p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="Enter your phone number" 
                className="border border-teal-600 p-3 rounded-lg w-full"
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2">Choose a topic</label>
            <select name="topic" className="border border-teal-600 p-3 rounded-lg w-full">
              <option>Select one...</option>
              <option>General Inquiry</option>
              <option>Support</option>
              <option>Feedback</option>
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2">Message</label>
            <textarea 
              name="message"
              placeholder="Type your message..." 
              className="border border-teal-600 p-3 rounded-lg w-full"
              rows={4} 
            />
          </div>
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
            />
            <span className="ml-2 text-gray-700">I accept the terms</span>
          </div>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}