const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const EsewaProvider = require('./providers/EsewaProvider');
const KhaltiProvider = require('./providers/KhaltiProvider');
const MockProvider = require('./providers/MockProvider');

class PaymentService {
  constructor() {
    this.providers = {
      esewa: new EsewaProvider(),
      khalti: new KhaltiProvider(),
      mock: new MockProvider()
    };
  }

  getProvider(method) {
    const providerKey = (method || env.defaultPaymentProvider || 'mock').toLowerCase();
    const provider = this.providers[providerKey];
    if (!provider) {
      throw new ApiError(400, `Unsupported payment method: ${method}`);
    }
    return provider;
  }

  async processPayment(method, payload) {
    const provider = this.getProvider(method);
    return provider.processPayment(payload);
  }
}

module.exports = new PaymentService();
