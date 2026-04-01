"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: ReactNode;
  target?: Element;
}

export function ClientPortal({ children, target }: ClientPortalProps) {
  if (typeof document === "undefined") return null;

  const portalTarget = target || document.body;

  return createPortal(children, portalTarget);
}
