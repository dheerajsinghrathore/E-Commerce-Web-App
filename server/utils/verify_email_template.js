
const verifyEmailTemplate = ({name, verifyToken}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p>Thank you for registering on our platform. Please verify your email address by clicking the link below:</p>
      <a href="${process.env.FRONT_END_URL}/verify-email?token=${verifyToken}" 
         style="display: inline-block; padding: 10px 20px; margin: 20px 0; 
                background-color: #28a745; color: #fff; text-decoration: none; 
                border-radius: 5px;">
        Verify Email Address
      </a>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br/>The Team</p>
    </div>
  `;
};

export default verifyEmailTemplate;
