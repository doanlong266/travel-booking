const assert = require('assert');

// Mock browser localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

console.log('--- Testing 24/7 Support Hub & Fast Refund Calculation Engine ---');

const CARRIER_POLICY_RULES = [
  {
    id: 'policy-flight-vna',
    transportType: 'flight',
    carrierName: 'Vietnam Airlines',
    carrierCode: 'VN',
    timeframeRules: [
      { minHoursBeforeDeparture: 24, feePercentage: 10, fixedFee: 0, allowExchange: true, exchangeFee: 150000, description: '> 24h: 10% fee' },
      { minHoursBeforeDeparture: 12, maxHoursBeforeDeparture: 24, feePercentage: 30, fixedFee: 0, allowExchange: true, exchangeFee: 250000, description: '12-24h: 30% fee' },
      { minHoursBeforeDeparture: 4, maxHoursBeforeDeparture: 12, feePercentage: 50, fixedFee: 0, allowExchange: true, exchangeFee: 400000, description: '4-12h: 50% fee' },
      { minHoursBeforeDeparture: 0, maxHoursBeforeDeparture: 4, feePercentage: 100, fixedFee: 0, allowExchange: false, exchangeFee: 0, description: '< 4h: Ineligible' }
    ]
  },
  {
    id: 'policy-train-dsvn',
    transportType: 'train',
    carrierName: 'Đường sắt Việt Nam',
    carrierCode: 'DSVN',
    timeframeRules: [
      { minHoursBeforeDeparture: 24, feePercentage: 10, fixedFee: 0, allowExchange: true, exchangeFee: 20000, description: '> 24h: 10% fee' },
      { minHoursBeforeDeparture: 4, maxHoursBeforeDeparture: 24, feePercentage: 20, fixedFee: 0, allowExchange: true, exchangeFee: 50000, description: '4-24h: 20% fee' },
      { minHoursBeforeDeparture: 0, maxHoursBeforeDeparture: 4, feePercentage: 100, fixedFee: 0, allowExchange: false, exchangeFee: 0, description: '< 4h: Ineligible' }
    ]
  }
];

function calculateRefund(order, customHours) {
  const hoursRemaining = customHours;
  const ticketPrice = order.totalAmount || 0;

  const policy = CARRIER_POLICY_RULES.find(p => p.transportType === order.transportType) || CARRIER_POLICY_RULES[0];

  const matchedRule = policy.timeframeRules.find(r => {
    if (r.maxHoursBeforeDeparture !== undefined) {
      return hoursRemaining >= r.minHoursBeforeDeparture && hoursRemaining < r.maxHoursBeforeDeparture;
    }
    return hoursRemaining >= r.minHoursBeforeDeparture;
  }) || policy.timeframeRules[policy.timeframeRules.length - 1];

  const feePercentage = matchedRule.feePercentage;
  const fixedFee = matchedRule.fixedFee || 0;
  const isEligible = feePercentage < 100;

  let totalFeeAmount = 0;
  let netRefundAmount = 0;

  if (isEligible) {
    totalFeeAmount = Math.round((ticketPrice * feePercentage) / 100) + fixedFee;
    totalFeeAmount = Math.min(ticketPrice, totalFeeAmount);
    netRefundAmount = Math.max(0, ticketPrice - totalFeeAmount);
  } else {
    totalFeeAmount = ticketPrice;
    netRefundAmount = 0;
  }

  const bonusPointsAmount = Math.round((netRefundAmount / 1000) * 1.10);

  return {
    isEligible,
    ticketPrice,
    feePercentage,
    fixedFee,
    totalFeeAmount,
    netRefundAmount,
    bonusPointsAmount,
    hoursRemaining,
    canExchange: matchedRule.allowExchange
  };
}

// 1. Flight calculation > 24 hours (10% fee)
const flightOrder = { transportType: 'flight', totalAmount: 2000000 };
const resFlight1 = calculateRefund(flightOrder, 36);
assert.strictEqual(resFlight1.isEligible, true);
assert.strictEqual(resFlight1.feePercentage, 10);
assert.strictEqual(resFlight1.totalFeeAmount, 200000);
assert.strictEqual(resFlight1.netRefundAmount, 1800000);
assert.strictEqual(resFlight1.bonusPointsAmount, 1980); // (1800000 / 1000) * 1.10 = 1980 pts
console.log('✓ Test 1 Passed: Flight refund > 24 hours (10% fee, +10% bonus points)');

// 2. Flight calculation 12 - 24 hours (30% fee)
const resFlight2 = calculateRefund(flightOrder, 18);
assert.strictEqual(resFlight2.isEligible, true);
assert.strictEqual(resFlight2.feePercentage, 30);
assert.strictEqual(resFlight2.netRefundAmount, 1400000);
console.log('✓ Test 2 Passed: Flight refund 12 - 24 hours (30% fee)');

// 3. Flight calculation < 4 hours (Ineligible for auto-refund)
const resFlight3 = calculateRefund(flightOrder, 2);
assert.strictEqual(resFlight3.isEligible, false);
assert.strictEqual(resFlight3.netRefundAmount, 0);
console.log('✓ Test 3 Passed: Flight refund < 4 hours is ineligible for auto refund');

// 4. Train calculation 4 - 24 hours (20% fee)
const trainOrder = { transportType: 'train', totalAmount: 1000000 };
const resTrain = calculateRefund(trainOrder, 10);
assert.strictEqual(resTrain.isEligible, true);
assert.strictEqual(resTrain.feePercentage, 20);
assert.strictEqual(resTrain.netRefundAmount, 800000);
console.log('✓ Test 4 Passed: Train refund 4 - 24 hours (20% fee)');

console.log('🎉 ALL REFUND ENGINE & BUSINESS RULE TESTS PASSED SUCCESSFULLY!');
