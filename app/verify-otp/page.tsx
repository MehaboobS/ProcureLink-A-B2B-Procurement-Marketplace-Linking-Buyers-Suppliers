"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { apiFetch } from "@/lib/api";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = params.get("email") || "";

  const [digits, setDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  const otp = digits.join("");
  const isOtpComplete = digits.every((digit) => digit.length === 1);

  useEffect(() => {
    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    inputRefs.current[0]?.focus();
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);

    setDigits((current) => {
      const nextDigits = [...current];
      nextDigits[index] = cleaned;
      return nextDigits;
    });

    setError("");

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, index) => pastedValue[index] || "");
    setDigits(nextDigits);
    setError("");

    const nextIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Missing email. Please register again.");
      return;
    }

    if (!isOtpComplete) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      localStorage.setItem("token", response.token);
      setSuccess("Email verified. Redirecting...");

      window.setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (err: any) {
      const message = String(err?.message || "Something went wrong");

      if (message.toLowerCase().includes("expired")) {
        setError("This OTP has expired. Please request a new code.");
      } else if (message.toLowerCase().includes("invalid")) {
        setError("Wrong OTP. Please check the code and try again.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      setError("");
      setSuccess("");

      await apiFetch("/api/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      setCountdown(RESEND_SECONDS);
      inputRefs.current[0]?.focus();
      setSuccess("A new OTP has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 py-8 flex items-center justify-center">
      <Card className="w-full max-w-md border-0 shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-[#1E3A5F] to-[#2563EB] px-8 py-6 text-white text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="mt-2 text-sm text-blue-100">
            Enter the 6-digit code sent to {email || "your email"}
          </p>
        </div>

        <div className="px-8 py-8 space-y-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">OTP Code</Label>
              <div className="grid grid-cols-6 gap-2">
                {digits.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) => updateDigit(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    aria-label={`OTP digit ${index + 1}`}
                    className="h-12 px-0 text-center text-lg font-bold border-slate-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">
                Use the 6-digit code. You can paste the full OTP as well.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-[#2563EB]" />
                <span>Resend available in</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#1E3A5F" }}>
                {countdown > 0 ? formatTime(countdown) : "0:00"}
              </span>
            </div>

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={loading || !isOtpComplete}
              className="w-full h-11 rounded-lg font-semibold text-white"
              style={{ backgroundColor: loading || !isOtpComplete ? "#94a3b8" : "#2563EB" }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="pt-2">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500">Didn’t receive the code?</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={countdown > 0 || resendLoading || !email}
              className="w-full h-11 rounded-lg border-2 border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resendLoading
                ? "Sending..."
                : countdown > 0
                  ? `Resend OTP in ${formatTime(countdown)}`
                  : "Resend OTP"}
            </Button>
          </div>

          <div className="text-center">
            <Link href={`/signup?email=${encodeURIComponent(email)}`} className="text-sm font-medium text-[#2563EB] hover:underline">
              Use a different email
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}