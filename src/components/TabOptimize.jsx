import { useState, useMemo } from "react";
import { lcaCompleta } from "../utils/finance.js";
import { fmt, fmtR } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabOptimize() {
  const [rows, setRows] = useState([
    { area: 0, F: 0 },
    { area: 25, F: 0.35 },
    { area: 50, F: 0.55 },
    { area: 75, F: 0.65 },
    { area: 100, F: 0.72 },
    { area: 125, F: 0.77 },
  ]);

  const [CA, setCA] = useState(250);
  const [CI, setCI] = useState(1250);
  const [p, setP] = useState({
    D: 0.2,
    nL: 20,
    dm: 0.07,
    d: 0.08,
    iFuel: 0.09,
    CF1: 17.2,
    L: 114.9,
    nE: 20,
    R: 0.3,
    M1: 0.006,
    iGen: 0.05,
    tp: 0.015,
    te: 0.3,
    C_flag: 0,
  });

  const set = (k) => (v) => setP((prev) => ({ ...prev, [k]: v }));
  const addRow = () => setRows([...rows, { area: 0, F: 0 }]);
  const updateRow = (i, k, v) => {
    const nr = [...rows];
    nr[i] = { ...nr[i], [k]: v };
    setRows(nr);
  };
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const results = useMemo(() => {
    return rows.map((r) => {
      const Cs = CA * r.area + CI;
      const res = lcaCompleta({ ...p, Cs, F: r.F });
      return { ...r, Cs, LCS: res.LCS, fuelSav1: r.F * p.L * p.CF1 };
    });
  }, [rows, CA, CI, p]);

  const best = results.reduce((a, b) => (b.LCS > a.LCS ? b : a), results[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Custos do Sistema">
        <Grid cols={4}>
          <Input label="Custo depend. área (CA)" value={CA} onChange={setCA} unit="R$/m²" />
          <Input label="Custo indep. área (CI)" value={CI} onChange={setCI} unit="R$" />
          <Input
            label="Custo comb. 1ºano (CF1)"
            value={p.CF1}
            onChange={set("CF1")}
            unit="R$/GJ"
          />
          <Input label="Carga anual (L)" value={p.L} onChange={set("L")} unit="GJ" />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Entrada (D)" value={p.D} onChange={set("D")} />
          <Input label="Prazo hipoteca" value={p.nL} onChange={set("nL")} unit="anos" />
          <Input label="Juros hipoteca" value={p.dm} onChange={set("dm")} />
          <Input label="Taxa desconto" value={p.d} onChange={set("d")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Inflação comb." value={p.iFuel} onChange={set("iFuel")} />
          <Input label="Vida útil" value={p.nE} onChange={set("nE")} unit="anos" />
          <Input label="Revenda (R)" value={p.R} onChange={set("R")} />
          <Input label="Imp. renda (te)" value={p.te} onChange={set("te")} />
        </Grid>
      </Card>

      <Card title="Relação Área × Fração Solar">
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "5px 8px", textAlign: "center" }}>Área (m²)</th>
              <th style={{ padding: "5px 8px", textAlign: "center" }}>Fração Solar (F)</th>
              <th style={{ padding: "5px 8px" }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "3px 4px" }}>
                  <input
                    type="number"
                    value={r.area}
                    onChange={(e) => updateRow(i, "area", parseFloat(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "4px 6px",
                      border: "1px solid #d1d5db",
                      borderRadius: 4,
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  />
                </td>
                <td style={{ padding: "3px 4px" }}>
                  <input
                    type="number"
                    value={r.F}
                    step="0.01"
                    onChange={(e) => updateRow(i, "F", parseFloat(e.target.value) || 0)}
                    style={{
                      width: "100%",
                      padding: "4px 6px",
                      border: "1px solid #d1d5db",
                      borderRadius: 4,
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  />
                </td>
                <td style={{ padding: "3px 4px", textAlign: "center" }}>
                  <button
                    onClick={() => removeRow(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addRow}
          style={{
            padding: "4px 12px",
            background: "#2a7f62",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          + Adicionar linha
        </button>
      </Card>

      <Card title="Resultados da Otimização">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Área (m²)", "F", "Cs (R$)", "Econ. Comb. 1ºano (R$)", "LCS (R$)"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontWeight: 700,
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isBest = r === best;
              return (
                <tr
                  key={i}
                  style={{
                    background: isBest ? "#f0fdf4" : undefined,
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <td
                    style={{
                      padding: "4px 8px",
                      textAlign: "right",
                      fontWeight: isBest ? 700 : 400,
                    }}
                  >
                    {r.area}
                  </td>
                  <td style={{ padding: "4px 8px", textAlign: "right" }}>
                    {(r.F * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: "4px 8px", textAlign: "right" }}>{fmt(r.Cs)}</td>
                  <td style={{ padding: "4px 8px", textAlign: "right" }}>{fmt(r.fuelSav1)}</td>
                  <td
                    style={{
                      padding: "4px 8px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: r.LCS >= 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {fmt(r.LCS)} {isBest ? " ◀ MAX" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {best && (
        <ResultBox
          label="Área Ótima"
          value={`${best.area} m² — F = ${(best.F * 100).toFixed(1)}%`}
          sub={`LCS máxima = ${fmtR(best.LCS)} | Cs = ${fmtR(best.Cs)}`}
          color="#16a34a"
        />
      )}
    </div>
  );
}
