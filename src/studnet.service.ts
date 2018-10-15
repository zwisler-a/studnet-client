import { Endpoint, Route, Server } from "@zwisler/bridge";
import * as cors from "cors";

import { StudNetClient } from "./login";
import { StudnetLog } from "./studnet-log.service";
import fs = require("fs");

@Route({
  basePath: "/api"
})
export class StudnetService {
  constructor(private login: StudNetClient, private logger: StudnetLog) {}

  @Endpoint({ method: "POST" })
  public connect() {
    return this.login.connect();
  }

  @Endpoint({ method: "POST" })
  public disconnect() {
    this.login.close();
  }

  @Endpoint()
  public status() {
    return this.login.status;
  }

  @Endpoint()
  public log() {
    return this.logger.logs;
  }

  @Endpoint({ method: "POST" })
  public config(username: string, host: string, password: string) {
    const config = { username, host, password };
    fs.writeFileSync("./config.json", JSON.stringify(config));
    return true;
  }
}

@Server({
  port: 9991,
  middleware: [cors()]
})
export class StudnetServer {}
