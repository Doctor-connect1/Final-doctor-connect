import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { firstName, lastName, email, phone, topic, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Make sure EMAIL is defined in .env
      
      pass: process.env.PASSWORD, // Ensure PASSWORD is set correctly as well
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,  // Ensure this is set properly
    to: process.env.EMAIL,    // The recipient should be the same as 'from', or a different valid address
    subject: `New Contact Form Submission: ${topic}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), {
      status: 500,
    });
  }
}
