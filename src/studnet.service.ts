import { Endpoint, Route, Server } from "@zwisler/bridge";
import * as cors from "cors";

import { StudNetClient } from "./login";
import { StudnetLog } from "./studnet-log.service";

@Route({
  basePath: "/api",
  middleware: [cors()]
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
}

@Server({ port: 9991, debug: true })
export class StudnetServer {}
