export class TransactionsEmptyException extends Error {
  constructor() {
    super('Não há transações disponíveis!');
    this.name = 'TransactionsEmptyException';
  }
}
