import { Route } from "bridge";
import ssh2 = require("ssh2");

import { StudnetLog } from "./studnet-log.service";

let Client = ssh2.Client;

@Route()
export class StudNetClient {
  private host = "139.18.143.253";
  private username = "162177";
  private password = "5C844TJS";
  _status = "";

  get status() {
    return this._status;
  }

  public connection: { client?: any; stream?: any } = {};

  constructor(private log: StudnetLog) {}

  public connect(): Promise<any> {
    return new Promise((res, rej) => {
      this.log.debug("Request to establish connection!");
      const client = new Client() as any;
      client.on("ready", () => {
        this.log.debug("Client is ready!");
        this.startShell(client).then(() => {
          res(true);
        }, rej);
      });
      client.on("error", err => {
        this._status = "";
        this.log.log("Error", err.toString());
      });
      client.connect({
        host: this.host,
        port: 22,
        username: this.username,
        password: this.password
      });
      this.log.debug("Connecting with", this.username);
    });
  }

  private startShell(client): Promise<any> {
    return new Promise((res, rej) => {
      client.shell((err, stream) => {
        if (err) rej(err);
        stream.on("close", () => {
          this._status = "";
          this.log.log("Stream closed!");
        });
        stream.on("data", data => {
          this._status += data.toString();
          this.log.debug(data.toString());
          this.connection = {
            client,
            stream
          };
          res();
        });
      });
    });
  }

  close() {
    this.log.log("Closing connection!");
    this.connection.stream.close();
    this.connection.client.end();
  }
}
