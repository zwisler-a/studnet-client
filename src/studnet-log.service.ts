export class StudnetLog {
  private _log = [];

  get logs() {
    return this._log;
  }

  log(...args) {
    this._log.push(...args);
  }

  debug(...args) {
    this._log.push(...args);
  }
}
