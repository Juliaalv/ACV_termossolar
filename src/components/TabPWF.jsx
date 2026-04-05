import { useState } from "react";
import { pwf, pv } from "../utils/finance.js";
import { fmt, fmtR } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabPWF() {
  const [n, setN] = useState(20);
  const [i, setI] = useState(5);
  const [d, setD] = useState(8);
  const [C, setC] = useState(1000);

  const iDec = i / 100;
  const dDec = d / 100;
  const PWF_val = pwf(n, iDec, dDec);
  const TPW = C * PWF_val;
  const PW_single = pv(C, dDec, n);

  const tableRows = [];
  for (let yr = 1; yr <= n; yr++) {
    const futCost = C * Math.pow(1 + iDec, yr - 1);
    const pwVal = futCost / Math.pow(1 + dDec, yr);
    tableRows.push({ yr, futCost, pwVal });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Parâmetros">
        <Grid cols={4}>
          <Input label="Nº de períodos (n)" value={n} onChange={setN} unit="anos" />
          <Input label="Taxa de inflação (i)" value={i} onChange={setI} unit="%" />
          <Input label="Taxa de desconto (d)" value={d} onChange={setD} unit="%" />
          <Input label="Pagamento 1º ano (C)" value={C} onChange={setC} unit="R$" />
        </Grid>
      </Card>

      <Grid cols={3}>
        <ResultBox
          label="PWF(n, i, d)"
          value={fmt(PWF_val, 4)}
          sub={`Eq. ${Math.abs(iDec - dDec) < 1e-10 ? "12.17" : "12.18"}`}
        />
        <ResultBox label="Valor Presente Total (TPW)" value={fmtR(TPW)} sub="C × PWF — Eq. 12.15" />
        <ResultBox
          label="PV pagamento único no ano n"
          value={fmtR(PW_single)}
          sub="Eq. 12.11"
          color="#7c3aed"
        />
      </Grid>

      <Card title="Tabela Ano a Ano">
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", position: "sticky", top: 0 }}>
                {["Ano", "Custo Futuro (R$)", "Valor Presente (R$)"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#475569",
                      borderBottom: "2px solid #e2e8f0",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r.yr} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "4px 8px", textAlign: "right" }}>{r.yr}</td>
                  <td style={{ padding: "4px 8px", textAlign: "right", fontFeatureSettings: '"tnum"' }}>
                    {fmt(r.futCost)}
                  </td>
                  <td style={{ padding: "4px 8px", textAlign: "right", fontFeatureSettings: '"tnum"' }}>
                    {fmt(r.pwVal)}
                  </td>
                </tr>
              ))}
              <tr style={{ background: "#f0fdf4", fontWeight: 700 }}>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>Total</td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {fmt(tableRows.reduce((s, r) => s + r.futCost, 0))}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {fmt(tableRows.reduce((s, r) => s + r.pwVal, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
