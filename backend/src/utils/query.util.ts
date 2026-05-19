function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildTextFilter(value?: string): RegExp | null {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  return new RegExp(escapeRegExp(normalizedValue), "i");
}
