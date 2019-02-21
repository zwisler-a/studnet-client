import { Route } from '@zwisler/bridge';
import ssh2 = require('ssh2');
import fs = require('fs');

import { StudnetLog } from './studnet-log.service';
import { Service } from '@zwisler/bridge';

let Client = ssh2.Client;

@Service()
export class StudNetClient {
  _status = '';

  get status() {
    return this._status;
  }

  public connection: { client?: any; stream?: any } = {};

  constructor(private log: StudnetLog) {}

  public connect(): Promise<any> {
    // Load config
    const config = JSON.parse(fs.readFileSync('./config.json').toString());
    this.log.debug('Credentials: ' + config.username + ':' + config.host);
    if (!config) {
      throw new Error('Config could not be loaded!');
    }

    return new Promise((res, rej) => {
      this.log.debug('Request to establish connection!');
      const client = new Client() as any;

      // Start the shell if the connection is established
      client.on('ready', () => {
        this.log.debug('Client is ready!');
        this.startShell(client).then(() => {
          res(true);
        }, rej);
      });

      // Handle if something goes south
      client.on('error', err => {
        this._status = '';
        this.log.log(err.toString());
      });

      // connect
      client.connect({
        host: config.host,
        port: 22,
        username: config.username,
        password: config.password
      });
      this.log.debug('Connecting with ' + config.username);
    });
  }

  /** Start an 'interactive' shell */
  private startShell(client): Promise<any> {
    return new Promise((res, rej) => {
      client.shell((err, stream) => {
        if (err) rej(err);
        stream.on('close', () => {
          this._status = '';
          this.log.debug('Stream closed!');
        });
        stream.on('data', data => {
          this._status += data.toString();
          this.log.log(data.toString());
          this.connection = {
            client,
            stream
          };
          res();
        });
      });
    });
  }

  /** Close the connection */
  close() {
    this.log.log('Closing connection!');
    this.connection.stream.close();
    this.connection.client.end();
  }
}
