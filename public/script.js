document.addEventListener("DOMContentLoaded", function () {
  fetch("/signalk/v1/api/plugins/signalk-m5paper-config/getConfig")
    .then((response) => response.json())
    .then((config) => {
      document.getElementById("anchorUpdateInterval").value =
        config.anchorUpdateInterval || "";
      document.getElementById("electricUpdateInterval").value =
        config.electricUpdateInterval || "";
      document.getElementById("engineUpdateInterval").value =
        config.engineUpdateInterval || "";
      document.getElementById("deepSleepStart").value =
        config.deepSleepStart || "";
      document.getElementById("deepSleepEnd").value =
        config.deepSleepEnd || "";
      document.getElementById("wakeMethod").value =
        config.wakeMethod || "timer";
      document.getElementById("watermakerUpdateInterval").value =
        config.watermakerUpdateInterval || "";
      document.getElementById("weatherUpdateInterval").value =
        config.weatherUpdateInterval || "";

      // Set single sleep time
      document.getElementById("sleepTime").value =
        config.sleepTime || "";
    })
    .catch((error) =>
      console.error("Error obteniendo la configuración:", error)
    );
});

document
  .getElementById("configForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const config = {
      anchorUpdateInterval:
        parseInt(document.getElementById("anchorUpdateInterval").value, 10) ||
        0,
      electricUpdateInterval:
        parseInt(document.getElementById("electricUpdateInterval").value, 10) ||
        0,
      engineUpdateInterval:
        parseInt(document.getElementById("engineUpdateInterval").value, 10) ||
        0,
      deepSleepStart: document.getElementById("deepSleepStart").value || "",
      deepSleepEnd: document.getElementById("deepSleepEnd").value || "",
      wakeMethod: document.getElementById("wakeMethod").value,
      watermakerUpdateInterval:
        parseInt(document.getElementById("watermakerUpdateInterval").value, 10) || 0,
      weatherUpdateInterval:
        parseInt(document.getElementById("weatherUpdateInterval").value, 10) || 0,

      // Add single sleep time configuration
      sleepTime:
        parseInt(document.getElementById("sleepTime").value, 10) || 0,
    };

    fetch("/signalk/v1/api/plugins/signalk-m5paper-config/setConfig", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Configuración recibida:", data); // Debug log
        alert("Configuración guardada exitosamente!");
        // Fetch updated config to refresh the form
        return fetch("/signalk/v1/api/plugins/signalk-m5paper-config/getConfig");
      })
      .then((response) => response.json())
      .then((config) => {
        // Update form fields with new config
        document.getElementById("anchorUpdateInterval").value = config.anchorUpdateInterval || "";
        document.getElementById("electricUpdateInterval").value = config.electricUpdateInterval || "";
        document.getElementById("engineUpdateInterval").value = config.engineUpdateInterval || "";
        document.getElementById("deepSleepStart").value = config.deepSleepStart || "";
        document.getElementById("deepSleepEnd").value = config.deepSleepEnd || "";
        document.getElementById("wakeMethod").value = config.wakeMethod || "timer";
        document.getElementById("watermakerUpdateInterval").value = config.watermakerUpdateInterval || "";
        document.getElementById("weatherUpdateInterval").value = config.weatherUpdateInterval || "";
        document.getElementById("sleepTime").value = config.sleepTime || "";
      })
      .catch((error) =>
        console.error("Error guardando la configuración:", error)
      );
  });
