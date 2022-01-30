const PoweredUP = require("node-poweredup");

const poweredUP = new PoweredUP.PoweredUP();
poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
    console.log(`Discovered: ${hub.name}!`);
    await hub.connect();
    console.log(`Connected to: ${hub.name}!`);  
    
    hub.on("disconnect", () => {
        console.log("Hub disconnected");
    })
});


setInterval(() => {
    const hubs = poweredUP.getHubs(); // Get an array of all connected hubs

    hubs.forEach(async (hub) => {

        console.log("======================================")
        console.log(`><><><><><> Device number <><><><><><><`)
        console.log(`Connected: ${hub.connected}`)
        console.log(`Hub name: ${hub.name}`)
        console.log(`Ports: ${hub.ports}`)
        console.log(`Type: ${hub.type}`)
        console.log(`FW ver: ${hub.firmwareVersion}`)
        console.log(`HW ver: ${hub.hardwareVersion}`)
        console.log(`MAC: ${hub.primaryMACAddress}`)
        console.log(`UUID: ${hub.uuid}`)
        console.log(`Bat level: ${hub.batteryLevel}`)
    })

}, 2000);

