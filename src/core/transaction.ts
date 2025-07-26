export function findStatus(transactionStatus?: number, autoRenewStatus?: number) {
  if (transactionStatus === 2) return "expired" as const;
  if (autoRenewStatus === 1) return "active" as const;
  if (autoRenewStatus === 0) return "cancelled" as const;
  return "unknown" as const;
}
