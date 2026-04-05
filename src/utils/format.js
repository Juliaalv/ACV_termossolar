/**
 * Formata número no padrão brasileiro
 */
export function fmt(value, decimals = 2) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formata como moeda R$
 */
export function fmtR(value) {
  return `R$ ${fmt(value)}`;
}
