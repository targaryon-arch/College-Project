console.log("🚀 Water Sensor Simulation Started...");

// Farz karein Hardware (ESP32) ne yeh reading li hai
let flowRate = 15.5; // 15.5 Liters per minute pani flow ho raha hai
let timeRunning = 2; // Motor 2 minute ke liye chali

// System calculation
let totalWaterUsed = flowRate * timeRunning; // Total pani kitna laga
let tokensToDeduct = totalWaterUsed * 0.5;   // Farz karein 1 liter = 0.5 token charge hoga

console.log("-----------------------------------------");
console.log("💧 PUMP STATUS: STARTED");
console.log(`⏱️  Pump ran for: ${timeRunning} minutes`);
console.log(`🌊 Total Water Consumed: ${totalWaterUsed} Liters`);
console.log(`🪙  Tokens to Deduct: ${tokensToDeduct} from Farmer's Wallet`);
console.log("-----------------------------------------");

console.log("\n⏳ Preparing Blockchain Transaction Payload...");

// Yeh woh data hai jo hardware Sepolia par bhejega
let payload = {
    contractAddress: "0xabBF9eeC80E09AaDEAf4947Ce1cb44592f9898E4",
    action: "DEDUCT_WATER_TOKENS",
    waterLiters: totalWaterUsed,
    tokens: tokensToDeduct
};

console.log("📦 Data Payload Ready to send:", payload);
console.log("\n⚠️ NEXT STEP: Waiting for Smart Contract 'Function Name' to complete transaction!");