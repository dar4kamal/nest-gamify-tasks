export class Reward {
  constructor(
    public id: string,
    public name: string,
    public points: number,
    public winAt: Date,
    public achevied: boolean,
  ) {}
}
