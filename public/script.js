document.addEventListener("DOMContentLoaded", function () {
    fetch("/m5paper-config/config")
        .then(response => response.json())
        .then(data => {
            document.getElementById("anchor").value = data.screens.updateInterval.ANCHOR;
            document.getElementById("electric").value = data.screens.updateInterval.ELECTRIC;
            document.getElementById("engine").value = data.screens.updateInterval.ENGINE;
            document.getElementById("sleepTime").value = data.device.sleepTime;
            document.getElementById("wakeMethod").value = data.device.wakeMethod;
        });

    document.getElementById("configForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const config = {
            screens: {
                updateInterval: {
                    ANCHOR: parseInt(document.getElementById("anchor").value),
                    ELECTRIC: parseInt(document.getElementById("electric").value),
                    ENGINE: parseInt(document.getElementById("engine").value)
                }
            },
            device: {
                sleepTime: parseInt(document.getElementById("sleepTime").value),
                wakeMethod: document.getElementById("wakeMethod").value
            }
        };

        fetch("/m5paper-config/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        }).then(response => response.json())
          .then(data => alert(data.status));
    });
});
