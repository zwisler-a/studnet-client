import 'reflect-metadata';

import { Endpoint, Route, Server, Brige } from '@zwisler/bridge';
import * as cors from 'cors';
import fs = require('fs');

import { StudNetClient } from './login';
import { StudnetLog } from './studnet-log.service';

@Route({
  basePath: '/api'
})
export class StudnetService {
  constructor(private login: StudNetClient, private logger: StudnetLog) {}

  @Endpoint({ method: 'POST' })
  public connect() {
    return this.login.connect();
  }

  @Endpoint({ method: 'POST' })
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

  @Endpoint({ method: 'POST', route: 'config' })
  public setConfig(username: string, host: string, password: string) {
    const config = { username, host, password };
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return true;
  }

  @Endpoint({ method: 'GET', route: 'config' })
  public getConfig() {
    const config = JSON.parse(fs.readFileSync('./config.json').toString());
    delete config.password;
    return config;
  }
}

@Server({
  port: 9991,
  middleware: [cors()],
  routes: [StudnetService],
  staticPath: './src/client',
  providers: [StudnetLog, StudNetClient]
})
export class StudnetServer {}

Brige.bootstrap(StudnetServer);
