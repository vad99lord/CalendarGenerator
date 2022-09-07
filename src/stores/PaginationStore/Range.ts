export default class Range {
  private readonly _start: number;
  private readonly _end: number;
  public static readonly EMPTY = new Range(0, 0);
  constructor(start: number, end: number) {
    if (start < 0) throw new RangeError("start should be > 0");
    if (end < start) throw new RangeError("end should be >= start");
    this._start = start;
    this._end = end;
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  contains(num: number) {
    return num >= this._start && num <= this._end;
  }

  equals(that: Range) {
    return this.start === that.start && this.end === that.end;
  }

  toString() {
    return `[${this.start};${this.end}]`;
  }
}
