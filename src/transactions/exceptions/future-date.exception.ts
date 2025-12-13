export class FutureDateException extends Error {
  constructor() {
    super('A transação não pode ser registrada em uma data futura!');
    this.name = 'FutureDateException';
  }
}
