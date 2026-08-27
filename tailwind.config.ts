import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: "#060b10",
          card: "#0a131b",
          cardHover: "#0e1a26",
          border: "#162838",
          borderBright: "#23425d",
          cyan: "#00f0ff",
          cyanDark: "#0284c7",
          safe: "#10b981",
          safeDark: "#059669",
          warning: "#f59e0b",
          warningDark: "#b45309",
          critical: "#ef4444",
          criticalDark: "#b91c1c",
          muted: "#64748b",
          text: "#94a3b8",
          textBright: "#f8fafc",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glowCyan: "0 0 15px rgba(0, 240, 255, 0.35)",
        glowSafe: "0 0 15px rgba(16, 185, 129, 0.35)",
        glowWarning: "0 0 15px rgba(245, 158, 11, 0.35)",
        glowCritical: "0 0 15px rgba(239, 68, 68, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar 4s linear infinite",
        "fog-drift": "drift 20s ease-in-out infinite alternate",
        "ping-slow": "ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        drift: {
          "0%": { transform: "translateX(-20px) translateY(-10px) scale(0.95)" },
          "100%": { transform: "translateX(20px) translateY(10px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
