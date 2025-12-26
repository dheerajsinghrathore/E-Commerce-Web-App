const forgotPasswordTemplate = (name, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Use the OTP below to proceed:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007BFF;">
        ${otp}
      </div>
      <p>This OTP is valid for the next 1 hour. If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,<br/>The Support Team</p>
    </div>
  `;
};

export default forgotPasswordTemplate;
