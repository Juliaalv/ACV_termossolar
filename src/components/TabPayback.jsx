import { useState } from "react";
import { paybackUndiscounted, paybackDiscounted } from "../utils/finance.js";
import { fmt } from "../utils/format.js";
import { Input, Card, ResultBox, Grid } from "./ui.jsx";

export default function TabPayback() {
  const [Cs, setCs] = useState(15100);
  const [F, setF] = useState(0.63);
  const [L, setL] = useState(185);
  const [CF1, setCF1] = useState(9);
  const [iF, setIF] = useState(0.09);
  const [d, setD] = useState(0.07);

  const npUnd = paybackUndiscounted(Cs, F, L, CF1, iF);
  const npDisc = paybackDiscounted(Cs, F, L, CF1, iF, d);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card title="Parâmetros de Entrada">
        <Grid cols={3}>
          <Input label="Custo do sistema (Cs)" value={Cs} onChange={setCs} unit="R$" />
          <Input label="Fração solar (F)" value={F} onChange={setF} />
          <Input label="Carga anual (L)" value={L} onChange={setL} unit="GJ" />
          <Input label="Custo combust. 1ºano (CF1)" value={CF1} onChange={setCF1} unit="R$/GJ" />
          <Input label="Inflação combustível (iF)" value={iF} onChange={setIF} />
          <Input label="Taxa desconto (d)" value={d} onChange={setD} />
        </Grid>
      </Card>

      <Grid cols={2}>
        <ResultBox
          label="Payback SEM Desconto"
          value={isFinite(npUnd) ? `${fmt(npUnd, 1)} anos` : "∞"}
          sub="Eq. 12.26"
          color="#2563eb"
        />
        <ResultBox
          label="Payback COM Desconto"
          value={isFinite(npDisc) ? `${fmt(npDisc, 1)} anos` : "∞"}
          sub="Eq. 12.29"
          color="#7c3aed"
        />
      </Grid>

      <Card title="Economia de Combustível Acumulada">
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f1f5f9", position: "sticky", top: 0 }}>
                {["Ano", "Econ. Comb. (R$)", "Acum. Nominal (R$)", "Acum. Descontada (R$)"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "5px 6px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: "#475569",
                        borderBottom: "2px solid #e2e8f0",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {(() => {
                let cumNom = 0;
                let cumDisc = 0;
                const maxYr = Math.min(
                  Math.ceil(Math.max(isFinite(npUnd) ? npUnd : 30, isFinite(npDisc) ? npDisc : 30) * 1.5),
                  50
                );
                const rows = [];
                for (let yr = 1; yr <= maxYr; yr++) {
                  const sav = F * L * CF1 * Math.pow(1 + iF, yr - 1);
                  cumNom += sav;
                  cumDisc += sav / Math.pow(1 + d, yr);
                  const nomOk = cumNom >= Cs;
                  const discOk = cumDisc >= Cs;
                  rows.push(
                    <tr key={yr} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "3px 6px", textAlign: "right" }}>{yr}</td>
                      <td style={{ padding: "3px 6px", textAlign: "right" }}>{fmt(sav)}</td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          fontWeight: nomOk ? 700 : 400,
                          color: nomOk ? "#16a34a" : undefined,
                        }}
                      >
                        {fmt(cumNom)}
                      </td>
                      <td
                        style={{
                          padding: "3px 6px",
                          textAlign: "right",
                          fontWeight: discOk ? 700 : 400,
                          color: discOk ? "#16a34a" : undefined,
                        }}
                      >
                        {fmt(cumDisc)}
                      </td>
                    </tr>
                  );
                  if (nomOk && discOk) break;
                }
                return rows;
              })()}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
