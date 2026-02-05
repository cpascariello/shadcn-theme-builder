"use client";

import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Users",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Mail",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export function SidebarRail() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="flex-shrink-0 hidden md:flex flex-col items-center py-3 w-14"
      style={{
        backgroundColor: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* App logo */}
      <button
        className="flex items-center justify-center w-9 h-9 rounded-md mb-4 transition-colors"
        style={{
          backgroundColor: "var(--sidebar-primary)",
          color: "var(--sidebar-primary-foreground)",
        }}
        aria-label="Home"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </button>

      {/* Separator */}
      <div
        className="w-8 mb-3"
        style={{
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      />

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => setActiveIndex(i)}
            className="flex items-center justify-center w-9 h-9 rounded-md transition-colors"
            style={
              i === activeIndex
                ? {
                    backgroundColor: "var(--sidebar-primary)",
                    color: "var(--sidebar-primary-foreground)",
                  }
                : {
                    color: "var(--sidebar-foreground)",
                  }
            }
            onMouseEnter={(e) => {
              if (i !== activeIndex) {
                e.currentTarget.style.backgroundColor = "var(--sidebar-accent)";
                e.currentTarget.style.color = "var(--sidebar-accent-foreground)";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== activeIndex) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--sidebar-foreground)";
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 2px var(--sidebar-ring)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label={item.label}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Separator */}
      <div
        className="w-8 mt-auto mb-3"
        style={{
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      />

      {/* User avatar */}
      <button
        className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold transition-colors"
        style={{
          backgroundColor: "var(--sidebar-accent)",
          color: "var(--sidebar-accent-foreground)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 2px var(--sidebar-ring)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        aria-label="User profile"
        title="User profile"
      >
        JD
      </button>
    </div>
  );
}
