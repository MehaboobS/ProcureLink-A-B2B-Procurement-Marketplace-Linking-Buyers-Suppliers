import {resend } from "@/lib/resend";

import VerificationEmail from "@/emails/VerificationEmail";

import { ApiResponse } from "@/app/types/ApiResponse";



export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
   try{
    const data = await resend.emails.send({
        from:"onboarding.example.com",
        to:email,
        subject:"Verification Code",
        react:  VerificationEmail({username, otp: verifyCode})
    });
    console.log("Verification email sent:", data);
    return {success: true, message: "Verification email sent successfully"};
   }catch(error){
    console.log("error sending verification email:", error);
    return {
        success: false,
        message: "Failed to send verification email"
    }
   }
}