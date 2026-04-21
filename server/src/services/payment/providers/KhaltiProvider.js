const PaymentProvider = require('./PaymentProvider');

class KhaltiProvider extends PaymentProvider {
  constructor() {
    super('khalti');
  }

  async processPayment({ donationId, amount }) {
    return {
      success: true,
      provider: this.name,
      providerTransactionId: `khalti_${donationId}_${Date.now()}`,
      raw: {
        state: 'Completed',
        amount
      }
    };
  }
}

module.exports = KhaltiProvider;
