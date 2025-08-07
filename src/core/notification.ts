export function resolveEventName(notificationType = "UNKNOWN_EVENT", subtype?: string) {
  if (!subtype) return notificationType;
  return `${notificationType}:${subtype}`;
}
