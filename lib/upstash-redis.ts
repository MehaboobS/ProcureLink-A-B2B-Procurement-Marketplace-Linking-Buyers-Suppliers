import { Redis } from '@upstash/redis';

export const otpRedis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL ?? 'https://better-jawfish-86530.upstash.io',
	token: process.env.UPSTASH_REDIS_REST_TOKEN ?? 'gQAAAAAAAVICAAIgcDE4NmVkOWJiY2E4YzE0MDBmOTA3N2FlZWU4Y2VlODkzOQ'
});

export const OTP_TTL_SECONDS = 300;

export function normalizeOtpValue(value: unknown) {
	return String(value ?? '').trim();
}

export async function setOtpValue(email: string, otp: string) {
	const key = `otp:${email}`;
	const normalizedOtp = normalizeOtpValue(otp);
	const maxAttempts = 2;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			await otpRedis.set(key, normalizedOtp, { ex: OTP_TTL_SECONDS });
			return;
		} catch (error) {
			if (attempt === maxAttempts) {
				throw error;
			}

			await new Promise((resolve) => setTimeout(resolve, 150));
		}
	}
}

export async function getOtpValue(email: string) {
	const value = await otpRedis.get<string>(`otp:${email}`);
	return normalizeOtpValue(value);
}

export async function deleteOtpValue(email: string) {
	await otpRedis.del(`otp:${email}`);
}