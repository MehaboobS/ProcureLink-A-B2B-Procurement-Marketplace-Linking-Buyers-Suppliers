import React from 'react';

// Using standard HTML elements instead of @react-email/components to avoid
// missing module errors. Styles are inline for email compatibility.

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>Verification Code</title>
      </head>
      <body style={{ fontFamily: 'Verdana, Arial, sans-serif', color: '#000' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
          <h2 style={{ margin: '0 0 12px 0' }}>Hello {username},</h2>
          <p style={{ margin: '0 0 12px 0' }}>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </p>
          <p style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 2 }}>{otp}</p>
          <p style={{ marginTop: 20 }}>If you did not request this code, please ignore this email.</p>
          {/* Uncomment and update link if needed
          <p>
            <a href={`http://localhost:3000/verify/${username}`} style={{ color: '#61dafb' }}>Verify here</a>
          </p>
          */}
        </div>
      </body>
    </html>
  );
}