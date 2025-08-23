import React from "react";
import { FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";

export default function SocialLinks({ align = "center", size = 20, className = "" }) {
  const social = [
    { href: "https://instagram.com/visnecprint", label: "Instagram", icon: <FaInstagram size={size} /> },
    { href: "https://x.com/visnecprint", label: "X (Twitter)", icon: <FaXTwitter size={size} /> },
    { href: "https://linkedin.com/company/visnecprint", label: "LinkedIn", icon: <FaLinkedin size={size} /> },
    { href: "https://youtube.com/@visnecprint", label: "YouTube", icon: <FaYoutube size={size} /> },
  ];
  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <nav aria-label="Social media" className={`flex ${justify} gap-5 text-neutral-500 ${className}`}>
      {social.map(({ href, label, icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="hover:opacity-80 hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
        >
          {icon}
        </a>
      ))}
    </nav>
  );
}
