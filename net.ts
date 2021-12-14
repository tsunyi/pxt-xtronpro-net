namespace xpnet {
    let _defaultController: net.Controller;
    /*
    function defaultController(): net.Controller {
        // cached
        if (_defaultController) return _defaultController;

        
        // look for ESP32 over serial pins
        const rx = pins.pinByCfg(DAL.CFG_PIN_WIFI_AT_RX);
        const tx = pins.pinByCfg(DAL.CFG_PIN_WIFI_AT_TX);
        const cs = pins.pinByCfg(DAL.CFG_PIN_WIFI_CS)
        // const reset = pins.pinByCfg(DAL.CFG_PIN_WIFI_RESET); // optional
        // const gpio0 = pins.pinByCfg(DAL.CFG_PIN_WIFI_GPIO0); // optional
        if (rx && tx) {
            const dev = serial.createSerial(rx, tx);
            return _defaultController = new ATController(dev, cs);
        }
        

        // no option
        net.log("esp32 configuration error");
        control.panic(control.PXT_PANIC.CODAL_HARDWARE_CONFIGURATION_ERROR);
        return undefined;
    }

    // initialize net
    new net.Net(defaultController);
    */
}
