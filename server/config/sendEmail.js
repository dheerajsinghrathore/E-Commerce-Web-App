import { Resend } from "resend";

// Lazy initialization to ensure dotenv.config() has run
let resend = null;

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in environment variables");
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

const sendEmail = async (name, sendTo, subject, html) => {
  try {
    const resendInstance = getResend();
    const { data, error } = await resendInstance.emails.send({
      from: "Dheeraj E-Commerce <onboarding@resend.dev>",
      to: [sendTo],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API error:", error);
      const errorMessage = error.message || `Resend API error: ${JSON.stringify(error)}`;
      throw new Error(errorMessage);
    }
    
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to let the caller handle it
  }
};

export default sendEmail;
