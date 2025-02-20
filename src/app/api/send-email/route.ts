import nodemailer from 'nodemailer';
export async function POST(request: Request) {
  const { firstName, lastName, email, phone, topic, message } = await request.json();
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "bochrabenromdhane2003@gmail.com",
      pass: "llqq ckaq bvly hryf ",
    },
  });


  const mailOptions = {
    from: "bochrabenromdhane2003@gmail.com",
    to: "bochrabenromdhane2003@gmail.com",
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
    throw error
  }
} 