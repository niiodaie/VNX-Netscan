import React from "react";
import { siteConfig } from "../lib/siteConfig";

export default function FooterSocial() {
  const { socials } = siteConfig;
  return (
    <div className="mt-4 flex gap-2">
      <IconLink href={socials.linkedin} label="LinkedIn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5a2.5 2.5 0 1 0 .02 5 2.5 2.5 0 0 0-.02-5zM3 8.98h4v12H3v-12zM9 8.98h3.83v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.09v6.22h-4v-5.51c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.43-2.12 2.92v5.61H9v-12z"/>
        </svg>
      </IconLink>
      <IconLink href={socials.instagram} label="Instagram">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5zM18.5 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
        </svg>
      </IconLink>
      <IconLink href={socials.facebook} label="Facebook">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M13 22v-8h2.5l.5-3H13V9.5c0-.87.29-1.5 1.67-1.5H16V5.17C15.74 5.12 14.9 5 13.94 5 11.78 5 10.3 6.24 10.3 8.77V11H8v3h2.3v8H13z"/>
        </svg>
      </IconLink>
    </div>
  );
}

function IconLink({ href, label, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 hover:border-neutral-400">
      {children}
    </a>
  );
}