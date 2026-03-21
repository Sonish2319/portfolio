import nodemailer from "nodemailer";

const GOOGLE_APP_USER = process.env.NEXT_PUBLIC_GOOGLE_APP_USER;
const GOOGLE_APP_PASSWORD = process.env.NEXT_PUBLIC_GOOGLE_APP_PASSWORD;

export async function POST(req) {
  try {
    const { from, subject, message } = await req.json();


    //gmail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GOOGLE_APP_USER,
        pass: GOOGLE_APP_PASSWORD,
      },
    });


    //send mail functionality
    
    const info = await transporter.sendMail({
      from: `"Portfolio CLI" <${GOOGLE_APP_USER}>`,
      to: GOOGLE_APP_USER, 
      replyTo: from, 
      subject: subject || "New CLI Message",
      text: `
From: ${from}

Message:
${message}
      `,
    });

    console.log("Email sent:", info.response);

    return Response.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);

    return Response.json({
      success: false,
      error: err.message,
    });
  }
}