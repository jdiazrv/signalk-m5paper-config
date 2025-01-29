const path = require('path');
const fs = require('fs');

module.exports = function (app) {
  const plugin = {};

  plugin.id = "signalk-m5paper-config";
  plugin.name = "Signalk M5Paper Config";
  plugin.description = "Proporciona una interfaz web para gestionar configuraciones del M5Paper en SignalK";

  const configPath = path.join(__dirname, 'config.json');

  let configuration = {
    anchorUpdateInterval: 60,
    electricUpdateInterval: 300,
    engineUpdateInterval: 300,
    watermakerUpdateInterval: 600,
    weatherUpdateInterval: 120,
    deepSleepStart: "22:00",
    deepSleepEnd: "06:00"
  };

  // Cargar configuraciones desde el archivo, si existe
  if (fs.existsSync(configPath)) {
    try {
      const data = fs.readFileSync(configPath, 'utf8');
      configuration = JSON.parse(data);
    } catch (err) {
      app.error("Error leyendo config.json:", err);
    }
  }

  // Guardar configuraciones
  function saveConfig() {
    fs.writeFile(configPath, JSON.stringify(configuration, null, 2), (err) => {
      if (err) {
        app.error("Error guardando config.json:", err);
      }
    });
  }

  plugin.start = function () {
    app.debug("Plugin Signalk M5Paper Config iniciado con configuración:");
    app.debug(configuration);
  };

  plugin.stop = function () {
    app.debug("Deteniendo Signalk M5Paper Config");
  };

  // Registrar la interfaz web en SignalK
  plugin.registerWithRouter = function (router) {
    router.get("/getConfig", (req, res) => {
      res.json(configuration);
    });

    router.post("/setConfig", (req, res) => {
      try {
        const newConfig = req.body;
        Object.keys(newConfig).forEach((key) => {
          if (configuration.hasOwnProperty(key)) {
            configuration[key] = newConfig[key];
          }
        });

        saveConfig();
        res.json({ status: "success", settings: configuration });
      } catch (err) {
        app.error(err);
        res.status(500).json({ status: "error", message: "No se pudo actualizar la configuración" });
      }
    });

    // Servir la UI desde `/ui/`
    router.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "ui/index.html"));
    });

    router.get("/script.js", (req, res) => {
      res.sendFile(path.join(__dirname, "ui/script.js"));
    });

    router.get("/styles.css", (req, res) => {
      res.sendFile(path.join(__dirname, "ui/styles.css"));
    });
  };

  plugin.schema = {
    type: "object",
    properties: {
      anchorUpdateInterval: {
        type: "number",
        title: "Intervalo de actualización del fondeo (segundos)",
        default: 60,
      },
      electricUpdateInterval: {
        type: "number",
        title: "Intervalo de actualización eléctrica (segundos)",
        default: 300,
      },
      engineUpdateInterval: {
        type: "number",
        title: "Intervalo de actualización del motor (segundos)",
        default: 300,
      },
      watermakerUpdateInterval: {
        type: "number",
        title: "Intervalo de actualización del generador de agua (segundos)",
        default: 600,
      },
      weatherUpdateInterval: {
        type: "number",
        title: "Intervalo de actualización del clima (segundos)",
        default: 120,
      },
      deepSleepStart: {
        type: "string",
        title: "Hora de inicio del modo de sueño profundo (HH:MM)",
        default: "22:00",
      },
      deepSleepEnd: {
        type: "string",
        title: "Hora de finalización del modo de sueño profundo (HH:MM)",
        default: "06:00",
      },
    },
  };

  return plugin;
};
