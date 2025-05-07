const localRatesStore = {
  regular: [
    {
      maxAmount: 1000,
      rates: {
        'USD-W_UAH': { buy: 40.85, sell: 41.0 },
        EUR_UAH: { buy: 45.1, sell: 45.5 },
        GBP_UAH: { buy: 52.0, sell: 53.5 },
        'EUR_USD-W': { buy: 1.101, sell: 1.119 },
        'GBP_USD-W': { buy: 1.26, sell: 1.305 },
      },
    },
    {
      maxAmount: 5000,
      rates: {
        'USD-W_UAH': { buy: 40.95, sell: 41.1 },
        EUR_UAH: { buy: 45.2, sell: 45.6 },
        GBP_UAH: { buy: 52.1, sell: 53.6 },
        'EUR_USD-W': { buy: 1.201, sell: 1.219 },
        'GBP_USD-W': { buy: 1.36, sell: 1.405 },
      },
    },
    {
      maxAmount: Infinity,
      rates: {
        'USD-W_UAH': { buy: 41.05, sell: 41.2 },
        EUR_UAH: { buy: 45.3, sell: 45.7 },
        GBP_UAH: { buy: 52.2, sell: 53.7 },
        'EUR_USD-W': { buy: 1.301, sell: 1.319 },
        'GBP_USD-W': { buy: 1.46, sell: 1.505 },
      },
    },
  ],

  usdt: [
    {
      maxAmount: 1000,
      rates: {
        'USD-W': { buy: 1.014, sell: 1.018 },
        EUR: 'same_usd',
        GBP: 'same_usd',
        UAH: 'same_usd',
      },
    },
    {
      maxAmount: 10000,
      rates: {
        'USD-W': { buy: 1.015, sell: 1.019 },
        EUR: 'cross',
        GBP: 'cross',
        UAH: 'cross',
      },
    },
    {
      maxAmount: 50000,
      rates: {
        'USD-W': { buy: 1.016, sell: 1.02 },
        EUR: 'cross',
        GBP: 'cross',
        UAH: 'cross',
      },
    },
    {
      maxAmount: Infinity,
      rates: {
        'USD-W': { buy: 1.017, sell: 1.021 },
        EUR: 'cross',
        GBP: 'cross',
        UAH: 'cross',
      },
    },
  ],
};

localStorage.setItem('localRatesStore', JSON.stringify(localRatesStore));

export const exchangeRates = JSON.parse(
  localStorage.getItem('localRatesStore')
);
