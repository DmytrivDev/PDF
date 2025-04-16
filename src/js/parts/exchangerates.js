export const exchangeRates = {
  ranges: [
    {
      min: 0,
      max: 1000,
      rates: {
        UAH: {
          'USD-W': { buy: 1, sell: 1 },
          'USD-B': { buy: 1, sell: 1 },
          EUR: { buy: 1, sell: 1 },
          GBP: { buy: 1, sell: 1 },
          USDT: { buy: 1, sell: 1 },
        },
        'USD-W': {
          UAH: { buy: 40.85, sell: 41.0 },
          USDT: { buy: 1.4, sell: 1.8 },
        },
        'USD-B': {
          UAH: { buy: 40.85, sell: 41.0 },
          USDT: { buy: 1.1, sell: 1.4 },
        },
        EUR: {
          UAH: { buy: 45.1, sell: 45.5 },
          'USD-W': { buy: 1.101, sell: 1.119 },
        },
        GBP: {
          UAH: { buy: 52.0, sell: 53.5 },
          'USD-W': { buy: 1.26, sell: 1.305 },
        },
        USDT: {
          'USD-W': { buy: 1.4, sell: 1.8 },
          'USD-B': { buy: 1.1, sell: 1.4 },
          UAH: 'mirror', // mirror == такий самий як у долара
        },
      },
    },
    {
      min: 1000,
      max: 5000,
      rates: {
        UAH: {
          'USD-W': { buy: 1, sell: 1 },
          'USD-B': { buy: 1, sell: 1 },
          EUR: { buy: 1, sell: 1 },
          GBP: { buy: 1, sell: 1 },
          USDT: { buy: 1, sell: 1 },
        },
        'USD-W': {
          UAH: { buy: 40.85, sell: 41.0 },
          USDT: { buy: 1.4, sell: 1.8 },
        },
        'USD-B': {
          UAH: { buy: 40.85, sell: 41.0 },
          USDT: { buy: 1.1, sell: 1.4 },
        },
        EUR: {
          UAH: { buy: 45.1, sell: 45.5 },
          'USD-W': { buy: 1.101, sell: 1.119 },
        },
        GBP: {
          UAH: { buy: 52.0, sell: 53.5 },
          'USD-W': { buy: 1.26, sell: 1.305 },
        },
        USDT: {
          'USD-W': { buy: 1.4, sell: 1.8 },
          'USD-B': { buy: 1.1, sell: 1.4 },
          UAH: 'cross', // cross = через долар
        },
      },
    },
    {
      min: 5000,
      max: Infinity,
      rates: {
        UAH: {
          'USD-W': { buy: 1, sell: 1 },
          'USD-B': { buy: 1, sell: 1 },
          EUR: { buy: 1, sell: 1 },
          GBP: { buy: 1, sell: 1 },
          USDT: { buy: 1, sell: 1 },
        },
        'USD-W': {
          UAH: { buy: 40.9, sell: 40.97 },
          USDT: { buy: 1.4, sell: 1.8 },
        },
        'USD-B': {
          UAH: { buy: 40.9, sell: 40.97 },
          USDT: { buy: 1.1, sell: 1.4 },
        },
        EUR: {
          UAH: { buy: 45.15, sell: 45.45 },
          'USD-W': { buy: 1.101, sell: 1.119 },
        },
        GBP: {
          UAH: { buy: 52.1, sell: 53.4 },
          'USD-W': { buy: 1.26, sell: 1.305 },
        },
        USDT: {
          'USD-W': { buy: 1.4, sell: 1.8 },
          'USD-B': { buy: 1.1, sell: 1.4 },
          UAH: 'cross', // через долар
        },
      },
    },
  ],
};
