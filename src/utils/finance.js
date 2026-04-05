/**
 * Funções financeiras — Kalogirou, Cap. 12
 * Engenharia de Energia Solar (tradução PT-BR)
 *
 * Todas as taxas são decimais (ex: 8% → 0.08)
 */

/**
 * Fator de Valor Presente — PWF(n, i, d)
 * Eq. 12.17 (i === d) e Eq. 12.18 (i ≠ d)
 *
 * @param {number} n  - número de períodos
 * @param {number} i  - taxa de inflação (decimal)
 * @param {number} d  - taxa de desconto de mercado (decimal)
 * @returns {number}
 */
export function pwf(n, i, d) {
  if (Math.abs(i - d) < 1e-10) {
    return n / (1 + i); // Eq. 12.17
  }
  return (1 / (d - i)) * (1 - Math.pow((1 + i) / (1 + d), n)); // Eq. 12.18
}

/**
 * Valor presente de um fluxo de caixa futuro — Eq. 12.11
 * P = F / (1 + d)^n
 */
export function pv(F, d, n) {
  return F / Math.pow(1 + d, n);
}

/**
 * Fator de valor presente para um único ano — Eq. 12.12
 * PWn = 1 / (1 + d)^n
 */
export function pwFactor(d, n) {
  return 1 / Math.pow(1 + d, n);
}

/**
 * Custo futuro com inflação — Eq. 12.13
 * F = C * (1 + i)^(n-1)
 */
export function futureCost(C, i, n) {
  return C * Math.pow(1 + i, n - 1);
}

/**
 * Valor presente de um custo inflacionado no ano n — Eq. 12.14
 * PWn = C * (1 + i)^(n-1) / (1 + d)^n
 */
export function pvInflated(C, i, d, n) {
  return (C * Math.pow(1 + i, n - 1)) / Math.pow(1 + d, n);
}

// ─── Tempo de Retorno (Payback) ───

/**
 * Payback SEM desconto — Eq. 12.26
 * np = ln(Cs·iF / (F·L·CF1) + 1) / ln(1 + iF)
 */
export function paybackUndiscounted(Cs, F, L, CF1, iF) {
  const denom = F * L * CF1;
  if (denom <= 0 || iF <= 0) return Infinity;
  return Math.log((Cs * iF) / denom + 1) / Math.log(1 + iF);
}

/**
 * Payback COM desconto — Eq. 12.29 (iF ≠ d) e Eq. 12.30 (iF === d)
 */
export function paybackDiscounted(Cs, F, L, CF1, iF, d) {
  const denom = F * L * CF1;
  if (denom <= 0) return Infinity;

  if (Math.abs(iF - d) < 1e-10) {
    return (Cs * (1 + iF)) / denom; // Eq. 12.30
  }

  const arg = (Cs * (iF - d)) / denom + 1;
  if (arg <= 0) return Infinity;
  return Math.log(arg) / Math.log((1 + iF) / (1 + d)); // Eq. 12.29
}

// ─── Análise Ciclo de Vida Completa (Exemplo 12.7) ───

/**
 * Realiza a análise LCA ano a ano.
 *
 * @param {object} params
 * @param {number} params.Cs       - custo total do sistema (R$)
 * @param {number} params.D        - fração de entrada (0–1)
 * @param {number} params.nL       - prazo da hipoteca (anos)
 * @param {number} params.dm       - taxa de juros da hipoteca
 * @param {number} params.d        - taxa de desconto de mercado
 * @param {number} params.iFuel    - inflação do combustível/energia
 * @param {number} params.CF1      - custo combustível 1ºano (R$/GJ)
 * @param {number} params.F        - fração solar
 * @param {number} params.L        - carga anual (GJ)
 * @param {number} params.nE       - vida útil / prazo análise (anos)
 * @param {number} params.R        - fração de revenda
 * @param {number} params.M1       - manutenção 1ºano / Cs
 * @param {number} params.iGen     - inflação geral
 * @param {number} params.tp       - imposto sobre propriedade
 * @param {number} params.te       - imposto de renda efetivo
 * @returns {object} { rows, LCS, pwResale, resale, downPayment, annualMortgage, Cs, fuelSaving1, loan }
 */
export function lcaCompleta(params) {
  const { Cs, D, nL, dm, d, iFuel, CF1, F, L, nE, R, M1, iGen, tp, te } = params;

  const downPayment = D * Cs;
  const loan = (1 - D) * Cs;
  let annualMortgage = 0;

  if (loan > 0 && nL > 0) {
    const PWF_loan = pwf(nL, 0, dm);
    annualMortgage = loan / PWF_loan; // Eq. 12.20
  }

  const fuelSaving1 = F * L * CF1;
  const misc1 = M1 * Cs;
  const propTax1 = tp * Cs;

  const rows = [];
  let balance = loan;
  let cumPwSav = -downPayment;

  // Ano 0 — apenas entrada
  rows.push({
    year: 0,
    fuelSav: 0,
    mortgage: 0,
    misc: 0,
    propTax: 0,
    taxSav: 0,
    annualSav: -downPayment,
    pwSav: -downPayment,
    cumPwSav: -downPayment,
    interest: 0,
    principal: 0,
    balance: loan,
  });

  let totalPwSav = -downPayment;

  for (let yr = 1; yr <= nE; yr++) {
    // Economia de combustível inflacionada — Eq. 12.13
    const fuelSav = fuelSaving1 * Math.pow(1 + iFuel, yr - 1);

    // Hipoteca
    let mortgage = 0;
    let interest = 0;
    let principal = 0;
    if (yr <= nL && balance > 0) {
      mortgage = annualMortgage;
      interest = balance * dm;
      principal = annualMortgage - interest;
      balance = Math.max(0, balance - principal);
    }

    // Custos de manutenção, seguro, parasitários
    const misc = misc1 * Math.pow(1 + iGen, yr - 1);

    // Imposto sobre propriedade
    const propTax = propTax1 * Math.pow(1 + iGen, yr - 1);

    // Economia de imposto de renda — Eq. 12.6
    const taxSav = te * (interest + propTax);

    // Economia solar anual — Eq. 12.10
    const annualSav = fuelSav - mortgage - misc - propTax + taxSav;

    // Valor presente — Eq. 12.11
    const pwSav = annualSav / Math.pow(1 + d, yr);
    totalPwSav += pwSav;
    cumPwSav += pwSav;

    rows.push({
      year: yr,
      fuelSav,
      mortgage,
      misc,
      propTax,
      taxSav,
      annualSav,
      pwSav,
      cumPwSav,
      interest,
      principal,
      balance: Math.max(0, balance),
    });
  }

  // Revenda
  const resale = R * Cs;
  const pwResale = resale / Math.pow(1 + d, nE);

  // LCS total — Eq. 12.22
  const LCS = totalPwSav + pwResale;

  return {
    rows,
    LCS,
    pwResale,
    resale,
    downPayment,
    annualMortgage,
    Cs,
    fuelSaving1,
    loan,
  };
}

// ─── Método P1, P2 (Seção 12.4) ───

/**
 * Calcula P1, P2 e todos os subtermos.
 *
 * @param {object} params
 * @returns {object} { P1, P2, P2_1..P2_7 }
 */
export function calcP1P2(params) {
  const { nE, iFuel, d, te, C_flag, D, nL, dm, M1, iGen, tp, V1, R, nd } = params;

  const nMin = Math.min(nL, nE);

  // P1 — Eq. 12.32
  const P1 = (1 - C_flag * te) * pwf(nE, iFuel, d);

  // P2 termos — Eq. 12.34
  const P2_1 = D;

  const P2_2 = (1 - D) * pwf(nMin, 0, d) / pwf(nL, 0, dm);

  const P2_3 =
    (1 - D) *
    te *
    (pwf(nMin, dm, d) * (dm - 1 / pwf(nL, 0, dm)) + pwf(nMin, 0, d) / pwf(nL, 0, dm));

  const P2_4 = (1 - C_flag * te) * M1 * pwf(nE, iGen, d);

  const P2_5 = tp * (1 - te) * V1 * pwf(nE, iGen, d);

  const nMinDep = nd > 0 ? Math.min(nE, nd) : 0;
  const P2_6 = nd > 0 ? (C_flag * te / nd) * pwf(nMinDep, 0, d) : 0;

  const P2_7 = R / Math.pow(1 + d, nE);

  const P2 = P2_1 + P2_2 - P2_3 + P2_4 + P2_5 - P2_6 - P2_7;

  return { P1, P2, P2_1, P2_2, P2_3, P2_4, P2_5, P2_6, P2_7 };
}
