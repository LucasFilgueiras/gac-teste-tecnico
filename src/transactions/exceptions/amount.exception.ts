export class AmountException extends Error {
  constructor() {
    super('O campo "amount" não pode ser negativo!');
    this.name = 'AmountException';
  }
}
