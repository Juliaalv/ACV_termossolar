import { useState } from "react";
import TabPWF from "./components/TabPWF.jsx";
import TabLCA from "./components/TabLCA.jsx";
import TabPayback from "./components/TabPayback.jsx";
import TabP1P2 from "./components/TabP1P2.jsx";
import TabOptimize from "./components/TabOptimize.jsx";
import TabSAS from "./components/TabSAS.jsx";

const tabs = [
  { id: "pwf", label: "PWF / Valor Presente" },
  { id: "lca", label: "Análise Ciclo de Vida" },
  { id: "payback", label: "Tempo de Retorno" },
  { id: "p1p2", label: "Método P₁, P₂" },
  { id: "optimize", label: "Otimização" },
  { id: "sas", label: "Meu SAS" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("sas");

  const renderTab = () => {
    switch (activeTab) {
      case "pwf":
        return <TabPWF />;
      case "lca":
        return <TabLCA />;
      case "payback":
        return <TabPayback />;
      case "p1p2":
        return <TabP1P2 />;
      case "optimize":
        return <TabOptimize />;
      case "sas":
        return <TabSAS />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        padding: 16,
        color: "#1e293b",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          background: "linear-gradient(135deg, #0f766e 0%, #065f46 50%, #1a472a 100%)",
          borderRadius: 12,
          padding: "18px 24px",
          marginBottom: 16,
          color: "#fff",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
           Análise Econômica - Projeto Termossolar
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: 12, opacity: 0.8 }}>
          LCC · LCS · PWF · Payback · Método P₁P₂ · Otimização 
        </p>
      </header>

      <nav
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 14,
          overflowX: "auto",
          padding: "4px 0",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "none",
              background: activeTab === t.id ? "#065f46" : "#e2e8f0",
              color: activeTab === t.id ? "#fff" : "#475569",
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {renderTab()}

      <footer
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#94a3b8",
          marginTop: 20,
          padding: 8,
        }}
      >
        Baseado em Kalogirou, S.A. — Cap. 12 · Eqs. 12.1–12.51
      </footer>
    </div>
  );
}
