"use client";

import { Loader2Icon } from "lucide-react";

export function Spinner({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Loader2Icon
      className={className}
      size={size}
      style={{
        animation: "spin 0.9s linear infinite",
      }}
    />
  );
}
