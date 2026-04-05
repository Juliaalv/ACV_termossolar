import { useState, useMemo } from "react";
import { lcaCompleta } from "../utils/finance.js";
import { fmt, fmtR } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabSAS() {
  const [sas, setSas] = useState({
    Cs: 10541,
    D: 1.0,
    nL: 0,
    dm: 0,
    d: 0.08,
    iFuel: 0.08,
    L: 7.56,
    CF1: 0.92,
    F: 0.65,
    nE: 20,
    R: 0.1,
    M1: 0.01,
    iGen: 0.05,
    tp: 0,
    te: 0,
    C_flag: 0,
    custoEletrico: 180,
    economiaMensal: 117,
  });

  const set = (k) => (v) => setSas((prev) => ({ ...prev, [k]: v }));

  const econAnual = sas.economiaMensal * 12;
  const paybackSimples = econAnual > 0 ? sas.Cs / econAnual : Infinity;

  const result = useMemo(() => {
    return lcaCompleta({
      Cs: sas.Cs,
      D: sas.D,
      nL: sas.nL,
      dm: sas.dm,
      d: sas.d,
      iFuel: sas.iFuel,
      CF1: sas.CF1,
      F: sas.F,
      L: sas.L,
      nE: sas.nE,
      R: sas.R,
      M1: sas.M1,
      iGen: sas.iGen,
      tp: sas.tp,
      te: sas.te,
      C_flag: sas.C_flag,
    });
  }, [sas]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
          borderRadius: 10,
          padding: "14px 20px",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800 }}>
          ☀ Meu SAS Residencial — João Pessoa, PB
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
          2× Coletor Solar 200×100 (5 m²) | Reservatório 400L Inox | 3 habitantes | NBR 15569
        </div>
      </div>

      <Card title="Dados do Projeto">
        <Grid cols={4}>
          <Input label="Custo total instalado" value={sas.Cs} onChange={set("Cs")} unit="R$" />
          <Input label="Entrada (D=1 → à vista)" value={sas.D} onChange={set("D")} />
          <Input label="Prazo financ." value={sas.nL} onChange={set("nL")} unit="anos" />
          <Input label="Juros financ." value={sas.dm} onChange={set("dm")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Taxa desconto" value={sas.d} onChange={set("d")} />
          <Input label="Inflação energia" value={sas.iFuel} onChange={set("iFuel")} />
          <Input label="Fração solar (F)" value={sas.F} onChange={set("F")} />
          <Input label="Vida útil" value={sas.nE} onChange={set("nE")} unit="anos" />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input
            label="Conta s/ SAS (mensal)"
            value={sas.custoEletrico}
            onChange={set("custoEletrico")}
            unit="R$/mês"
          />
          <Input
            label="Economia mensal c/ SAS"
            value={sas.economiaMensal}
            onChange={set("economiaMensal")}
            unit="R$/mês"
          />
          <Input label="Valor revenda (R)" value={sas.R} onChange={set("R")} />
          <Input label="Manutenção (M1)" value={sas.M1} onChange={set("M1")} />
        </Grid>
      </Card>

      <Grid cols={3}>
        <ResultBox
          label="Payback Simples"
          value={`${fmt(paybackSimples, 1)} anos`}
          sub={`Economia anual: ${fmtR(econAnual)}`}
          color="#2563eb"
        />
        <ResultBox
          label="LCS (20 anos)"
          value={fmtR(result.LCS)}
          sub="Análise ciclo de vida"
          color={result.LCS >= 0 ? "#16a34a" : "#dc2626"}
        />
        <ResultBox
          label="Economia total VP"
          value={fmtR(
            result.rows.reduce((s, r) => s + (r.fuelSav > 0 ? r.pwSav : 0), 0) + result.pwResale
          )}
          sub="VP economias + revenda"
        />
      </Grid>

      <Card title="Fluxo de Caixa Simplificado (Energia Elétrica substituída)">
        <div style={{ maxHeight: 350, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", position: "sticky", top: 0 }}>
                {["Ano", "Economia Anual", "VP Economia", "VP Acumulado"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "5px 6px",
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
              {(() => {
                let cum = -sas.Cs * sas.D;
                const r = [
                  <tr key={0} style={{ background: "#fef3c7" }}>
                    <td style={{ padding: "3px 6px", textAlign: "right", fontWeight: 600 }}>0</td>
                    <td style={{ padding: "3px 6px", textAlign: "right", color: "#dc2626" }}>
                      −{fmt(sas.Cs * sas.D)}
                    </td>
                    <td style={{ padding: "3px 6px", textAlign: "right" }}>
                      −{fmt(sas.Cs * sas.D)}
                    </td>
                    <td
                      style={{
                        padding: "3px 6px",
                        textAlign: "right",
                        color: "#dc2626",
                      }}
                    >
                      {fmt(cum)}
                    </td>
                  </tr>,
                ];
                for (let yr = 1; yr <= sas.nE; yr++) {
                  const econ = econAnual * Math.pow(1 + sas.iFuel, yr - 1);
                  const manut = sas.M1 * sas.Cs * Math.pow(1 + sas.iGen, yr - 1);
                  const net = econ - manut;
                  const pwNet = net / Math.pow(1 + sas.d, yr);
                  cum += pwNet;
                  r.push(
                    <tr key={yr} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "3px 6px", textAlign: "right" }}>{yr}</td>
                      <td style={{ padding: "3px 6px", textAlign: "right", color: "#16a34a" }}>
                        {fmt(net)}
                      </td>
                      <td style={{ padding: "3px 6px", textAlign: "right" }}>{fmt(pwNet)}</td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          fontWeight: 600,
                          color: cum >= 0 ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {fmt(cum)}
                      </td>
                    </tr>
                  );
                }
                return r;
              })()}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
