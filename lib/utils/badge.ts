export function getBuyerBadge(kycStatus: string, tier: string) {
  if (kycStatus === "APPROVED" && tier === "PREMIUM") return "Gold Buyer";
  if (kycStatus === "APPROVED") return "Verified Buyer";
  return "Basic Buyer";
}