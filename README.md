# ☀ Análise Econômica Solar — Kalogirou Cap. 12

Ferramenta interativa para análise econômica de sistemas de energia solar, baseada no **Capítulo 12** do livro *Engenharia de Energia Solar* de **Soteris Kalogirou**.

Todos os valores em **R$ (Reais)**.

## Funcionalidades

| Aba | Descrição | Equações |
|-----|-----------|----------|
| **PWF / Valor Presente** | Calcula PWF(n, i, d), TPW e valor presente de pagamento único | Eq. 12.11, 12.15–12.18 |
| **Análise Ciclo de Vida** | LCA completa ano a ano com fluxo de caixa detalhado | Eq. 12.5–12.14, 12.22 |
| **Tempo de Retorno** | Payback com e sem desconto | Eq. 12.26, 12.29, 12.30 |
| **Método P₁, P₂** | Cálculo rápido de LCS via parâmetros P₁ e P₂ | Eq. 12.31–12.37 |
| **Otimização** | Encontra a área de coletor que maximiza LCS | Seção 12.3.3 |
| **Meu SAS** | Análise pré-carregada para um SAS residencial em João Pessoa-PB | — |

## Como rodar

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/analise-economica-solar.git
cd analise-economica-solar

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Build para produção

```bash
npm run build
```

Os arquivos estáticos ficam em `dist/`.

## Estrutura do projeto

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Componente principal com abas
│   ├── index.css             # Estilos globais
│   ├── utils/
│   │   ├── finance.js        # Funções financeiras (PWF, LCA, P1P2, Payback)
│   │   └── format.js         # Formatação pt-BR e R$
│   └── components/
│       ├── ui.jsx            # Componentes reutilizáveis (Input, Card, Grid, ResultBox)
│       ├── TabPWF.jsx        # Aba: PWF / Valor Presente
│       ├── TabLCA.jsx        # Aba: Análise Ciclo de Vida
│       ├── TabPayback.jsx    # Aba: Tempo de Retorno
│       ├── TabP1P2.jsx       # Aba: Método P₁, P₂
│       ├── TabOptimize.jsx   # Aba: Otimização
│       └── TabSAS.jsx        # Aba: Meu SAS Residencial
```

## Referências

- Kalogirou, S.A. — *Solar Energy Engineering: Processes and Systems*, Chapter 12
- Duffie, J.A. & Beckman, W.A. — *Solar Engineering of Thermal Processes*
- NBR 15569:2021 — Sistemas de aquecimento solar de água

## Licença

MIT
