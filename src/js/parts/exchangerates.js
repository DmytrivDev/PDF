export const exchangeRates = {
  regular: {
    // From 0$ to 1000$
    below_1k: {
      'USD-W_UAH': { buy: 40.85, sell: 41.0 }, // USD White
      'USD-B_UAH': { buy: 40.84, sell: 40.9 }, // USD Blue
      EUR_UAH: { buy: 45.1, sell: 45.5 },
      GBP_UAH: { buy: 52.0, sell: 53.5 },
      'EUR_USD-W': { buy: 1.101, sell: 1.119 }, // Relative to USD White
      'GBP_USD-W': { buy: 1.26, sell: 1.305 }, // Relative to USD White
    },
    // From 1000$ to 5000$
    between_1k_5k: {
      'USD-W_UAH': { buy: 40.95, sell: 41.1 },
      'USD-B_UAH': { buy: 40.95, sell: 41.2 },
      EUR_UAH: { buy: 45.2, sell: 45.6 },
      GBP_UAH: { buy: 52.1, sell: 53.6 },
      'EUR_USD-W': { buy: 1.201, sell: 1.219 },
      'GBP_USD-W': { buy: 1.36, sell: 1.405 },
    },
    // From 5000$
    above_5k: {
      'USD-W_UAH': { buy: 41.05, sell: 41.2 },
      'USD-B_UAH': { buy: 41.05, sell: 41.3 },
      EUR_UAH: { buy: 45.3, sell: 45.7 },
      GBP_UAH: { buy: 52.2, sell: 53.7 },
      'EUR_USD-W': { buy: 1.301, sell: 1.319 },
      'GBP_USD-W': { buy: 1.46, sell: 1.505 },
    },
  },

  usdt: {
    // Up to 1000$
    below_1k: {
      'USD-W': { buy: 1.014, sell: 1.018 }, // 1.4% / 1.8% (White)
      'USD-B': { buy: 1.011, sell: 1.014 }, // 1.1% / 1.4% (Blue)
      UAH: 'same_usd', // Identical to USD-W rates
    },
    // 1000$ - 10000$
    between_1k_10k: {
      'USD-W': { buy: 1.015, sell: 1.019 },
      'USD-B': { buy: 1.012, sell: 1.015 },
      UAH: 'cross', // Cross rate: USDT -> USD-W -> UAH
    },
    // 10000$ - 50000$
    between_10k_50k: {
      'USD-W': { buy: 1.016, sell: 1.02 },
      'USD-B': { buy: 1.013, sell: 1.016 },
      UAH: 'cross',
    },
    // Above 50000$
    above_50k: {
      'USD-W': { buy: 1.017, sell: 1.021 },
      'USD-B': { buy: 1.014, sell: 1.017 },
      UAH: 'cross',
    },
  },
};
