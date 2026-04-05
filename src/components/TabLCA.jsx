import { useState, useMemo } from "react";
import { lcaCompleta } from "../utils/finance.js";
import { fmt, fmtR } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabLCA() {
  const [p, setP] = useState({
    Cs: 10540,
    D: 0.2,
    nL: 10,
    dm: 0.09,
    d: 0.08,
    iFuel: 0.08,
    CF1: 17.2,
    F: 0.65,
    L: 114.9,
    nE: 20,
    R: 0.3,
    M1: 0.006,
    iGen: 0.05,
    tp: 0.0,
    te: 0.0,
    C_flag: 0,
  });

  const set = (k) => (v) => setP((prev) => ({ ...prev, [k]: v }));

  const result = useMemo(() => lcaCompleta(p), [p]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Dados do Sistema">
        <Grid cols={4}>
          <Input label="Custo inicial (Cs)" value={p.Cs} onChange={set("Cs")} unit="R$" />
          <Input label="Entrada (D)" value={p.D} onChange={set("D")} />
          <Input label="Prazo hipoteca (nL)" value={p.nL} onChange={set("nL")} unit="anos" />
          <Input label="Juros hipoteca (dm)" value={p.dm} onChange={set("dm")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Taxa desconto (d)" value={p.d} onChange={set("d")} />
          <Input label="Inflação combust. (iF)" value={p.iFuel} onChange={set("iFuel")} />
          <Input label="Custo combust. 1ºano/GJ" value={p.CF1} onChange={set("CF1")} unit="R$/GJ" />
          <Input label="Fração solar (F)" value={p.F} onChange={set("F")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Carga anual (L)" value={p.L} onChange={set("L")} unit="GJ" />
          <Input label="Vida útil (nE)" value={p.nE} onChange={set("nE")} unit="anos" />
          <Input label="Valor revenda (R)" value={p.R} onChange={set("R")} />
          <Input label="Manutenção (M1=Cm/Cs)" value={p.M1} onChange={set("M1")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Inflação geral (i)" value={p.iGen} onChange={set("iGen")} />
          <Input label="Imposto propriedade (tp)" value={p.tp} onChange={set("tp")} />
          <Input label="Imposto renda (te)" value={p.te} onChange={set("te")} />
          <Input label="Comercial? (C=0 ou 1)" value={p.C_flag} onChange={set("C_flag")} />
        </Grid>
      </Card>

      <Grid cols={4}>
        <ResultBox
          label="LCS (Economia Ciclo Vida)"
          value={fmtR(result.LCS)}
          sub="Eq. 12.22"
          color={result.LCS >= 0 ? "#16a34a" : "#dc2626"}
        />
        <ResultBox label="Custo Sistema" value={fmtR(result.Cs)} />
        <ResultBox label="Economia Comb. 1ºAno" value={fmtR(result.fuelSaving1)} sub="F × L × CF1" />
        <ResultBox
          label="VP Revenda"
          value={fmtR(result.pwResale)}
          sub={`Revenda: ${fmtR(result.resale)}`}
        />
      </Grid>

      <Card title="Fluxo de Caixa — Análise do Ciclo de Vida Completa">
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", position: "sticky", top: 0 }}>
                {[
                  "Ano",
                  "Econ. Comb.",
                  "Hipoteca",
                  "Manut.",
                  "Imp.Prop.",
                  "Econ.IR",
                  "Econ. Anual",
                  "VP Econ.",
                  "VP Acum.",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "5px 4px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      borderBottom: "2px solid #e2e8f0",
                      fontSize: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((r) => (
                <tr
                  key={r.year}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: r.year === 0 ? "#fef3c7" : undefined,
                  }}
                >
                  <td style={{ padding: "3px 4px", textAlign: "right", fontWeight: 600 }}>
                    {r.year}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right", color: "#16a34a" }}>
                    {fmt(r.fuelSav)}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right", color: "#dc2626" }}>
                    {r.mortgage > 0 ? `-${fmt(r.mortgage)}` : "—"}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right", color: "#dc2626" }}>
                    {r.misc > 0 ? `-${fmt(r.misc)}` : "—"}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right", color: "#dc2626" }}>
                    {r.propTax > 0 ? `-${fmt(r.propTax)}` : "—"}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right", color: "#16a34a" }}>
                    {r.taxSav > 0 ? fmt(r.taxSav) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "3px 4px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: r.annualSav >= 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {fmt(r.annualSav)}
                  </td>
                  <td style={{ padding: "3px 4px", textAlign: "right" }}>{fmt(r.pwSav)}</td>
                  <td
                    style={{
                      padding: "3px 4px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: r.cumPwSav >= 0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {fmt(r.cumPwSav)}
                  </td>
                </tr>
              ))}
              {result.pwResale > 0 && (
                <tr style={{ background: "#f0fdf4", fontWeight: 700 }}>
                  <td colSpan={7} style={{ padding: "5px 4px", textAlign: "right" }}>
                    + VP Revenda
                  </td>
                  <td style={{ padding: "5px 4px", textAlign: "right" }}>
                    {fmt(result.pwResale)}
                  </td>
                  <td style={{ padding: "5px 4px", textAlign: "right", color: "#16a34a" }}>
                    {fmt(result.LCS)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
