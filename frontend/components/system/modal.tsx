"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { Box } from "@/components/system/primitives";
import { Button, Card, CardDescription, CardTitle } from "@/components/system/ui";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  allowClose?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "640px",
  allowClose = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !allowClose) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [allowClose, onClose, open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <Box
      alignItems="center"
      backgroundColor="rgba(15, 23, 42, 0.52)"
      display="flex"
      inset="0"
      justifyContent="center"
      padding={[4, 5]}
      position="fixed"
      zIndex={200}
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && allowClose) {
          onClose();
        }
      }}
    >
      <Card
        width="100%"
        maxWidth={maxWidth}
        boxShadow="glow"
        css={{
          position: "relative",
        }}
      >
        <Box padding="24px 24px 0">
          {allowClose ? (
            <Button
              aria-label="Close dialog"
              variant="ghost"
              size="sm"
              css={{
                position: "absolute",
                right: 16,
                top: 16,
              }}
              onClick={onClose}
            >
              <XIcon size={16} />
            </Button>
          ) : null}
          <CardTitle as="h2">{title}</CardTitle>
          {description ? (
            <CardDescription as="p" marginTop="8px">
              {description}
            </CardDescription>
          ) : null}
        </Box>

        <Box padding="24px">{children}</Box>

        {footer ? (
          <Box
            borderTop="1px solid"
            borderColor="line"
            display="flex"
            gap="12px"
            justifyContent="flex-end"
            padding="18px 24px 24px"
          >
            {footer}
          </Box>
        ) : null}
      </Card>
    </Box>,
    document.body,
  );
}
