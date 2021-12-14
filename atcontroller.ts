namespace xpnet {
    export enum ATStatus {
        None,
        Ok,
        Error
    }

    export interface ATResponse {
        status: ATStatus;
        errorCode?: number;
        lines: string[];
    }

    /**
     * Controller for AT command set https://github.com/espressif/esp-at/blob/master/docs/ESP_AT_Commands_Set.md
     */
    export class ATController extends net.Controller {
        private prefix = "AT";
        private newLine = "\r\n";

        constructor(
            private ser: serial.Serial,
            private _cs: DigitalInOutPin,
            private _reset: DigitalInOutPin = null,
            private _gpio0: DigitalInOutPin = null
        ) {
            super();
            this.ser.serialDevice.setRxBufferSize(128);
            this.ser.serialDevice.setBaudRate(BaudRate.BaudRate115200);
            this._cs.digitalWrite(true);
        }

        /**
         * Sends and receives an AT command
         * @param command command name
         */
        private sendAT(command: string, args?: any[]): ATResponse {
            // send command
            let txt = this.prefix;
            // add command
            if (command)
                txt += "+" + command;
            // filter out undinfed from the back
            while (args && args.length && args[args.length - 1] === undefined)
                args.pop();
            if (args && args.length > 0) {
                txt += "=" + args.map(arg => "" + arg).join(",");
            }
            txt += this.newLine;
            // send over
            this.ser.writeString(txt);
            // read output
            let status = ATStatus.None;
            let errorCode: number = 0;
            let line = "";
            const lines: string[] = [];
            do {
                line = this.ser.readLine();
                if (line == "OK")
                    status = ATStatus.Ok;
                else if (line == "ERROR")
                    status = ATStatus.Error;
                else if (line.substr(0, "ERR CODE:".length) == "ERR CODE:")
                    errorCode = parseInt(line.substr("ERR CODE:".length + 2), 16)
                else if (!line.length) continue; // keep reading
                else lines.push(line);
            } while (status == ATStatus.None);

            return { status: status, errorCode: errorCode, lines: lines };
        }

        private parseNumber(r: ATResponse): number {
            if (r.status != ATStatus.Ok || !r.lines.length)
                return undefined;

            const line = r.lines[0];
            if (line[0] != "+")
                return undefined;

            const time = parseInt(line.substr(1));
            return time;
        }

        get isIdle(): boolean {
            return this.sendAT("").status == ATStatus.Ok;
        }

        version() {
            const r = this.sendAT("GMR");
            return r.lines.join("\r\n");
        }

        get isConnected(): boolean {
            return false;
        }

        ping(dest: string, ttl: number = 250): number {
            // https://github.com/espressif/esp-at/blob/master/docs/ESP_AT_Commands_Set.md#425-atping-ping-packets
            const r = this.sendAT(`PING`, [dest, ttl]);
            return this.parseNumber(r);
        }

        public scanNetworksCore(): net.AccessPoint[] {
            return [];
        }

        public socket(): number {
            this.version();
            return -1;
        }

        public socketConnect(socket_num: number, dest: string | Buffer, port: number, conn_mode = net.TCP_MODE): boolean {
            return false;
        }

        public socketWrite(socket_num: number, buffer: Buffer): void {
        }

        public socketAvailable(socket_num: number): number {
            return -1;
        }

        public socketRead(socket_num: number, size: number): Buffer {
            return undefined;
        }

        public socketClose(socket_num: number): void {
        }

        public hostbyName(hostname: string): Buffer {
            return undefined;
        }
        get ssid(): string { return undefined; }
        get MACaddress(): Buffer { return undefined; }
    }
}