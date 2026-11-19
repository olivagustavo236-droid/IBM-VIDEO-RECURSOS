// Glifos SVG de trazo, siempre en colores del tema (nunca emoji ni logos oficiales).
import React from "react";

export type IconKind =
  | "compute"
  | "lb"
  | "db"
  | "storage"
  | "cdn"
  | "func"
  | "search"
  | "identity"
  | "key"
  | "audit"
  | "model"
  | "doc"
  | "user"
  | "shield"
  | "monitor"
  | "vector"
  | "globe"
  | "lock"
  | "check"
  | "x"
  | "warn"
  | "chat"
  | "cart"
  | "scale"
  | "clock"
  | "image"
  | "folder"
  | "server"
  | "human"
  | "coin"
  | "split";

const paths: Record<IconKind, React.ReactNode> = {
  compute: (
    <>
      <rect x="10" y="10" width="28" height="28" rx="4" />
      <rect x="17" y="17" width="14" height="14" rx="2" />
      <path d="M17 4v6M24 4v6M31 4v6M17 38v6M24 38v6M31 38v6M4 17h6M4 24h6M4 31h6M38 17h6M38 24h6M38 31h6" />
    </>
  ),
  lb: (
    <>
      <circle cx="24" cy="10" r="5" />
      <circle cx="10" cy="38" r="5" />
      <circle cx="24" cy="38" r="5" />
      <circle cx="38" cy="38" r="5" />
      <path d="M24 15v18M22 14L11 33M26 14l11 19" />
    </>
  ),
  db: (
    <>
      <ellipse cx="24" cy="11" rx="15" ry="6" />
      <path d="M9 11v26c0 3.3 6.7 6 15 6s15-2.7 15-6V11M9 24c0 3.3 6.7 6 15 6s15-2.7 15-6" />
    </>
  ),
  storage: (
    <>
      <path d="M8 14l16-8 16 8-16 8z" />
      <path d="M8 14v20l16 8 16-8V14M24 22v20" />
    </>
  ),
  cdn: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7c5 5 7 11 7 17s-2 12-7 17c-5-5-7-11-7-17s2-12 7-17z" />
      <circle cx="40" cy="9" r="3" />
      <circle cx="8" cy="40" r="3" />
    </>
  ),
  func: <path d="M14 40c6 0 6-6 8-16s3-16 10-16M12 22h18M30 40l-6-8M24 40l8-10" />,
  search: (
    <>
      <circle cx="21" cy="21" r="12" />
      <path d="M30 30l11 11" />
    </>
  ),
  identity: (
    <>
      <rect x="5" y="10" width="38" height="28" rx="4" />
      <circle cx="17" cy="22" r="5" />
      <path d="M9 33c2-4 5-6 8-6s6 2 8 6M28 19h10M28 25h10M28 31h6" />
    </>
  ),
  key: (
    <>
      <circle cx="15" cy="24" r="8" />
      <path d="M23 24h20M37 24v7M31 24v5" />
    </>
  ),
  audit: (
    <>
      <path d="M12 5h18l8 8v30H12z" />
      <path d="M30 5v8h8M18 22h14M18 29h14M18 36h8" />
    </>
  ),
  model: (
    <>
      <circle cx="24" cy="24" r="6" />
      <circle cx="9" cy="12" r="4" />
      <circle cx="39" cy="12" r="4" />
      <circle cx="9" cy="36" r="4" />
      <circle cx="39" cy="36" r="4" />
      <path d="M12 14l7 6M36 14l-7 6M12 34l7-6M36 34l-7-6" />
    </>
  ),
  doc: (
    <>
      <path d="M12 4h17l9 9v31H12z" />
      <path d="M29 4v9h9M18 22h14M18 29h14M18 36h10" />
    </>
  ),
  user: (
    <>
      <circle cx="24" cy="16" r="8" />
      <path d="M8 43c2-9 9-13 16-13s14 4 16 13" />
    </>
  ),
  shield: (
    <>
      <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" />
      <path d="M17 24l5 5 9-10" />
    </>
  ),
  monitor: (
    <>
      <rect x="5" y="8" width="38" height="26" rx="3" />
      <path d="M10 27l8-8 6 5 9-10 5 4M18 42h12M24 34v8" />
    </>
  ),
  vector: (
    <>
      <path d="M8 40L40 8M8 40V20M8 40h20" />
      <circle cx="40" cy="8" r="3" />
      <circle cx="30" cy="22" r="2.5" />
      <circle cx="20" cy="14" r="2.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M6 24h36M24 6c6 6 8 12 8 18s-2 12-8 18c-6-6-8-12-8-18s2-12 8-18z" />
    </>
  ),
  lock: (
    <>
      <rect x="10" y="21" width="28" height="22" rx="4" />
      <path d="M16 21v-6a8 8 0 0116 0v6M24 30v6" />
    </>
  ),
  check: <path d="M10 25l9 9 19-20" />,
  x: <path d="M13 13l22 22M35 13L13 35" />,
  warn: (
    <>
      <path d="M24 5l20 36H4z" />
      <path d="M24 19v10M24 35v1" />
    </>
  ),
  chat: (
    <>
      <path d="M6 9h36v24H20l-9 8v-8H6z" />
      <path d="M14 18h20M14 25h12" />
    </>
  ),
  cart: (
    <>
      <path d="M4 8h7l5 24h22l4-16H14" />
      <circle cx="19" cy="40" r="3" />
      <circle cx="35" cy="40" r="3" />
    </>
  ),
  scale: (
    <>
      <rect x="6" y="26" width="10" height="16" rx="2" />
      <rect x="19" y="16" width="10" height="26" rx="2" />
      <rect x="32" y="6" width="10" height="36" rx="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 13v12l8 5" />
    </>
  ),
  image: (
    <>
      <rect x="5" y="9" width="38" height="30" rx="3" />
      <circle cx="16" cy="19" r="4" />
      <path d="M5 34l11-10 9 8 6-5 12 10" />
    </>
  ),
  folder: <path d="M4 12h15l4 5h21v23H4z" />,
  server: (
    <>
      <rect x="8" y="5" width="32" height="11" rx="2" />
      <rect x="8" y="19" width="32" height="11" rx="2" />
      <rect x="8" y="33" width="32" height="11" rx="2" />
      <path d="M14 10.5h2M14 24.5h2M14 38.5h2" />
    </>
  ),
  human: (
    <>
      <circle cx="17" cy="15" r="6" />
      <path d="M5 40c1-8 6-12 12-12s11 4 12 12" />
      <path d="M31 22l4 4 8-9" />
    </>
  ),
  coin: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M29 16h-7a4 4 0 000 8h4a4 4 0 010 8h-8M24 12v4M24 32v4" />
    </>
  ),
  split: <path d="M24 4v12M24 16L10 30v14M24 16l14 14v14M10 44h0M24 16v28" />,
};

export const Icon: React.FC<{ kind: IconKind; size?: number; color: string; stroke?: number; style?: React.CSSProperties }> = ({
  kind,
  size = 40,
  color,
  stroke = 3,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {paths[kind]}
  </svg>
);
