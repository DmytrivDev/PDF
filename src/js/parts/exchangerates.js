export const exchangeRates = {
  regular: {
    // From 0$ to 1000$
    below_1k: {
      'USD-W_UAH': { buy: 40.85, sell: 41.0 }, // USD White
      'USD-B_UAH': { buy: 40.85, sell: 41.0 }, // USD Blue
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
      'USD-B': { buy: 1.011, sell: 1.014 }, // 1.1% / 1.4% (Blue)
      'USD-W': { buy: 1.014, sell: 1.018 }, // 1.4% / 1.8% (White)
      UAH: 'same_usd', // Identical to USD-W rates
    },
    // 1000$ - 10000$
    between_1k_10k: {
      'USD-B': { buy: 1.012, sell: 1.015 },
      'USD-W': { buy: 1.015, sell: 1.019 },
      UAH: 'cross', // Cross rate: USDT -> USD-W -> UAH
    },
    // 10000$ - 50000$
    between_10k_50k: {
      'USD-B': { buy: 1.013, sell: 1.016 },
      'USD-W': { buy: 1.016, sell: 1.02 },
      UAH: 'cross',
    },
    // Above 50000$
    above_50k: {
      'USD-B': { buy: 1.014, sell: 1.017 },
      'USD-W': { buy: 1.017, sell: 1.021 },
      UAH: 'cross',
    },
  },
};

// function getRateTier(amount, fromCurrency) {
//   let usdAmount = amount;

//   if (fromCurrency !== 'USD-W') {
//     console.log(fromCurrency);
//     if (fromCurrency === 'USDT') {
//       console.log('object');
//       const usdtTier =
//         amount <= 1000
//           ? 'below_1k'
//           : amount <= 10000
//           ? 'between_1k_10k'
//           : amount <= 50000
//           ? 'between_10k_50k'
//           : 'above_50k';

//       console.log(amount);

//       const rate = exchangeRates.usdt[usdtTier]['USD-W']?.sell;
//       if (rate) usdAmount = amount / rate;
//     } else {
//       const directPair = `${fromCurrency}_USD-W`;
//       const reversePair = `USD-W_${fromCurrency}`;
//       const tier = exchangeRates.regular.below_1k;

//       if (tier[directPair]) {
//         usdAmount = amount * tier[directPair].buy;
//       } else if (tier[reversePair]) {
//         usdAmount = amount / tier[reversePair].sell;
//       }
//     }
//   }

//   let tierObj;
//   if (fromCurrency === 'USDT') {
//     if (usdAmount <= 1000) tierObj = exchangeRates.usdt.below_1k;
//     else if (usdAmount <= 10000) tierObj = exchangeRates.usdt.between_1k_10k;
//     else if (usdAmount <= 50000) tierObj = exchangeRates.usdt.between_10k_50k;
//     else tierObj = exchangeRates.usdt.above_50k;
//   } else {
//     if (usdAmount <= 1000) tierObj = exchangeRates.regular.below_1k;
//     else if (usdAmount <= 5000) tierObj = exchangeRates.regular.between_1k_5k;
//     else tierObj = exchangeRates.regular.above_5k;
//   }

//   return { tier: tierObj, usdAmount }; // повертаємо також usdAmount
// }

// const { tier, usdAmount } = getRateTier(giveAmount, from);
// const { tier, usdAmount } = getRateTier(receiveAmount, to);
