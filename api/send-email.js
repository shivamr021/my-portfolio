const { Resend } = require('resend');

// Initialize Resend with the API key from Vercel's environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Vercel will process this function when a request is made to /api/send-email
module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      // IMPORTANT: Replace with your verified domain and a custom email address
      // The 'onboarding@resend.dev' is a temporary address for testing.
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['shivamrathod145@gmail.com'], // Your personal email to receive messages
      subject: `New Portfolio Message from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Message via Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    // Handle potential errors from the Resend API
    if (error) {
      console.error({ error });
      return res.status(400).json({ error });
    }

    // Send a success response
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sorry, something went wrong.' });
  }
};