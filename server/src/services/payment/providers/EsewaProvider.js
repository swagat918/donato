const PaymentProvider = require('./PaymentProvider');

class EsewaProvider extends PaymentProvider {
  constructor() {
    super('esewa');
  }

  async processPayment({ donationId, amount }) {
    return {
      success: true,
      provider: this.name,
      providerTransactionId: `esewa_${donationId}_${Date.now()}`,
      raw: {
        status: 'COMPLETE',
        amount
      }
    };
  }
}

module.exports = EsewaProvider;
