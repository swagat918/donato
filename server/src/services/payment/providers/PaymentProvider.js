class PaymentProvider {
  constructor(name) {
    this.name = name;
  }

  async processPayment() {
    throw new Error('processPayment must be implemented by provider');
  }
}

module.exports = PaymentProvider;
