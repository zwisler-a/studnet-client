export class StudnetLog {
  private _log = [];

  get logs() {
    return this._log;
  }

  log(txt) {
    this._log.push("[Log " + this.timestamp() + "] " + txt);
  }

  debug(txt: string) {
    this._log.push("[DEBUG " + this.timestamp() + "] " + txt);
  }

  private timestamp() {
    const d = new Date();
    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;
  }
}
