const PaymentProvider = require('./PaymentProvider');

class MockProvider extends PaymentProvider {
  constructor() {
    super('mock');
  }

  async processPayment({ donationId, amount }) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const shouldFail = false;

    if (shouldFail) {
      return {
        success: false,
        provider: this.name,
        providerTransactionId: `mock_fail_${donationId}_${Date.now()}`,
        raw: {
          reason: 'Simulated payment failure'
        }
      };
    }

    return {
      success: true,
      provider: this.name,
      providerTransactionId: `mock_${donationId}_${Date.now()}`,
      raw: {
        status: 'SUCCESS',
        amount
      }
    };
  }
}

module.exports = MockProvider;
