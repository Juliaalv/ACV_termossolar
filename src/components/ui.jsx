import React from "react";

export function Input({ label, value, onChange, unit, step, min, type = "number" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 140 }}>
      <label
        style={{
          fontSize: 11,
          color: "#6b7a8d",
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
          }
          step={step || "any"}
          min={min}
          style={{
            padding: "6px 8px",
            border: "1px solid #c8d6e0",
            borderRadius: 6,
            fontSize: 13,
            width: "100%",
            background: "#f8fafc",
            fontFamily: "inherit",
            outline: "none",
            transition: "border 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2a7f62")}
          onBlur={(e) => (e.target.style.borderColor = "#c8d6e0")}
        />
        {unit && (
          <span style={{ fontSize: 11, color: "#8a9bae", whiteSpace: "nowrap" }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

export function Card({ title, children, accent = "#2a7f62" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "16px 20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {title && (
        <h3
          style={{
            margin: "0 0 12px 0",
            fontSize: 14,
            fontWeight: 700,
            color: accent,
            borderBottom: `2px solid ${accent}22`,
            paddingBottom: 6,
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function ResultBox({ label, value, sub, color = "#1a5c45" }) {
  return (
    <div
      style={{
        background: `${color}0a`,
        border: `1px solid ${color}20`,
        borderRadius: 8,
        padding: "10px 14px",
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 11, color: "#6b7a8d", marginBottom: 2 }}>{label}</div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: "#8a9bae", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function Grid({ children, cols = 3 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}
