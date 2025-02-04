const path = require('path');
const fs = require('fs');

module.exports = function (app) {
  const plugin = {};

  plugin.id = "signalk-m5paper-config";
  plugin.name = "Signalk-m5paper-config";
  plugin.description = "Proporciona una interfaz web para gestionar configuraciones del M5Paper en SignalK";

  // Obtener la ruta de configuración de SignalK
  const configPath = path.join(app.config.configPath, 'plugin-config-data', `${plugin.id}.json`);

  let configuration = {
    anchorUpdateInterval: 30,
    electricUpdateInterval: 30,
    engineUpdateInterval: 60,
    watermakerUpdateInterval: 10,
    weatherUpdateInterval: 120,
    deepSleepStart: "23:00",
    deepSleepEnd: "06:30",
    sleepTime: 900
  };

  // Cargar configuraciones desde el archivo si existe
  if (fs.existsSync(configPath)) {
    try {
      const data = fs.readFileSync(configPath, 'utf8');
      configuration = JSON.parse(data);
      console.log("Configuración cargada:", configuration); // Debug log
    } catch (err) {
      app.error("Error leyendo config.json:", err);
    }
  }

  // Guardar configuración en SignalK
  function saveConfig() {
    try {
      fs.writeFileSync(configPath, JSON.stringify(configuration, null, 2), 'utf8');
      console.log("Configuración guardada:", configuration); // Debug log
    } catch (err) {
      app.error("Error guardando config.json:", err);
    }
  }

  plugin.start = function () {
   if (fs.existsSync(configPath)) {
        configuration = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
    app.debug("Plugin Signalk M5Paper Config iniciado con configuración actualizada:");
    app.debug(configuration);
  };

  plugin.stop = function () {
    app.debug("Deteniendo Signalk M5Paper Config");
  };

  // Registrar rutas en SignalK
  plugin.registerWithRouter = function (router) {
    router.get("/getConfig", (req, res) => {
      try {
        if (fs.existsSync(configPath)) {
          configuration = JSON.parse(fs.readFileSync(configPath, "utf8"));
        }
        console.log("Enviando configuración actual:", configuration); // 🚀 Debug
        res.json(configuration);
      } catch (err) {
        app.error("Error leyendo configuración:", err);
        res.status(500).json({ status: "error", message: "No se pudo leer la configuración" });
      }
    });

    router.post("/setConfig", (req, res) => {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const newConfig = JSON.parse(body);
          console.log("Recibido nuevo config:", newConfig); // 🚀 Debug

          // Asignamos toda la configuración en lugar de modificar propiedad por propiedad
          configuration = { ...newConfig };

          // Guardamos la nueva configuración en el archivo JSON
          saveConfig();

          // Recargamos desde el archivo para forzar la actualización
          configuration = JSON.parse(fs.readFileSync(configPath, "utf8"));

          console.log("Configuración después de guardar y recargar:", configuration); // 🚀 Debug

          res.json({ status: "success", settings: configuration });
        } catch (err) {
          app.error(err);
          res.status(500).json({ status: "error", message: "No se pudo actualizar la configuración" });
        }
      });
    });

    // Servir archivos estáticos desde /plugins/signalk-m5paper-config/
    router.get("/", (req, res) => {
      res.sendFile(__dirname + "/ui/index.html");
    });

    router.get("/script.js", (req, res) => {
      res.sendFile(__dirname + "/ui/script.js");
    });

    router.get("/styles.css", (req, res) => {
      res.sendFile(__dirname + "/ui/styles.css");
    });
  };

  plugin.schema = {
    type: "object",
    properties: {
      anchorUpdateInterval: { type: "number", title: "Intervalo de actualización del fondeo (segundos)", default: 60 },
      electricUpdateInterval: { type: "number", title: "Intervalo de actualización eléctrica (segundos)", default: 300 },
      engineUpdateInterval: { type: "number", title: "Intervalo de actualización del motor (segundos)", default: 300 },
      watermakerUpdateInterval: { type: "number", title: "Intervalo de actualización del generador de agua (segundos)", default: 600 },
      weatherUpdateInterval: { type: "number", title: "Intervalo de actualización del clima (segundos)", default: 120 },
      deepSleepStart: { type: "string", title: "Hora de inicio del modo de sueño profundo (HH:MM)", default: "22:00" },
      deepSleepEnd: { type: "string", title: "Hora de finalización del modo de sueño profundo (HH:MM)", default: "06:00" },
      sleepTime: { type: "number", title: "Tiempo de Sueño Total (segundos)", default: 900 }
    },
  };

  return plugin;
};
