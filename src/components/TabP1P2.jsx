import { useState, useMemo } from "react";
import { calcP1P2, pwf } from "../utils/finance.js";
import { fmt, fmtR } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabP1P2() {
  const [p, setP] = useState({
    nE: 20,
    iFuel: 0.09,
    d: 0.08,
    te: 0.3,
    C_flag: 0,
    D: 0.2,
    nL: 20,
    dm: 0.07,
    M1: 0.006,
    iGen: 0.05,
    tp: 0.015,
    V1: 1,
    R: 0.3,
    nd: 0,
    CF1: 17.2,
    F: 0.65,
    L: 114.9,
    Cs: 20000,
  });

  const set = (k) => (v) => setP((prev) => ({ ...prev, [k]: v }));

  const res = useMemo(() => {
    const r = calcP1P2(p);
    const LCS = r.P1 * p.CF1 * p.F * p.L - r.P2 * p.Cs;
    return { ...r, LCS };
  }, [p]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Parâmetros do Sistema">
        <Grid cols={4}>
          <Input label="Custo sistema (Cs)" value={p.Cs} onChange={set("Cs")} unit="R$" />
          <Input label="Fração solar (F)" value={p.F} onChange={set("F")} />
          <Input label="Carga (L)" value={p.L} onChange={set("L")} unit="GJ" />
          <Input
            label="Custo comb. 1ºano (CF1)"
            value={p.CF1}
            onChange={set("CF1")}
            unit="R$/GJ"
          />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Entrada (D)" value={p.D} onChange={set("D")} />
          <Input label="Prazo hipoteca (nL)" value={p.nL} onChange={set("nL")} unit="anos" />
          <Input label="Juros hipoteca (dm)" value={p.dm} onChange={set("dm")} />
          <Input label="Taxa desconto (d)" value={p.d} onChange={set("d")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Inflação combust. (iF)" value={p.iFuel} onChange={set("iFuel")} />
          <Input label="Inflação geral (i)" value={p.iGen} onChange={set("iGen")} />
          <Input label="Imp. renda (te)" value={p.te} onChange={set("te")} />
          <Input label="Comercial? (0/1)" value={p.C_flag} onChange={set("C_flag")} />
        </Grid>
        <div style={{ height: 8 }} />
        <Grid cols={4}>
          <Input label="Manut. (M1)" value={p.M1} onChange={set("M1")} />
          <Input label="Imp. propriedade (tp)" value={p.tp} onChange={set("tp")} />
          <Input label="Revenda (R)" value={p.R} onChange={set("R")} />
          <Input label="Vida útil (nE)" value={p.nE} onChange={set("nE")} unit="anos" />
        </Grid>
      </Card>

      <Grid cols={3}>
        <ResultBox label="P₁" value={fmt(res.P1, 4)} sub="Eq. 12.32" color="#2563eb" />
        <ResultBox label="P₂" value={fmt(res.P2, 4)} sub="Eq. 12.34" color="#7c3aed" />
        <ResultBox
          label="LCS = P₁·CF1·F·L − P₂·Cs"
          value={fmtR(res.LCS)}
          sub="Eq. 12.31"
          color={res.LCS >= 0 ? "#16a34a" : "#dc2626"}
        />
      </Grid>

      <Card title="Detalhamento de P₂">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
          <div>P₂,₁ (Entrada) = {fmt(res.P2_1, 4)}</div>
          <div>P₂,₂ (Hipoteca) = {fmt(res.P2_2, 4)}</div>
          <div style={{ color: "#16a34a" }}>−P₂,₃ (Dedução IR juros) = −{fmt(res.P2_3, 4)}</div>
          <div>P₂,₄ (Manutenção) = {fmt(res.P2_4, 4)}</div>
          <div>P₂,₅ (Imp. propriedade) = {fmt(res.P2_5, 4)}</div>
          <div style={{ color: "#16a34a" }}>−P₂,₆ (Depreciação) = −{fmt(res.P2_6, 4)}</div>
          <div style={{ color: "#16a34a" }}>−P₂,₇ (Revenda) = −{fmt(res.P2_7, 4)}</div>
        </div>
      </Card>
    </div>
  );
}
