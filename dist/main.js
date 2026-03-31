const app = document.getElementById("app");
if (!app)
    throw new Error("App Container Not Found");
// Particle background
const particlesBg = document.createElement("div");
particlesBg.id = "particles-bg";
document.body.appendChild(particlesBg);
let particlesInstance;
tsParticles.load("particles-bg", {
    fullScreen: { enable: false },
    fpsLimit: 60,
    background: { color: "transparent" },
    particles: {
        number: {
            value: 70,
            density: { enable: true, area: 800 }
        },
        color: { value: "#ffffff" }, // gold
        shape: { type: "circle" },
        opacity: {
            value: 0.75,
            random: true
        },
        size: {
            value: 1.5,
            random: true
        },
        links: {
            enable: true,
            distance: 250,
            color: "#ffffff",
            opacity: 0.75,
            width: 0.3
        },
        move: {
            enable: true,
            speed: 3,
            outModes: "out"
        }
    },
    detectRetina: true
});
// Main container of website
const container = document.createElement("div");
container.className = "container";
// Title
const title = document.createElement("h1");
title.className = "title";
title.innerText = "Machine Translation (LANGUAGE)";
// Input Box
const inputBox = document.createElement("input");
inputBox.className = "input-box";
inputBox.placeholder = "Enter Here...";
// Button
const translateButton = document.createElement("button");
translateButton.className = "translate-button";
translateButton.textContent = "Translate";
// Output Box
const outputBox = document.createElement("div");
outputBox.className = "output-box";
outputBox.textContent = "Empty";
// Console Title
const consoleTitle = document.createElement("h2");
consoleTitle.className = "console-title";
consoleTitle.innerText = "Console";
// Console Area
const consoleBox = document.createElement("div");
consoleBox.className = "console-box";
// Console Clear Button
const clearButton = document.createElement("button");
clearButton.className = "clear-button";
clearButton.textContent = "Clear Console";
// Clearing Console
clearButton.addEventListener("click", () => {
    consoleBox.innerHTML = "";
});
// Console Log Function
function logToConsole(message, duration = 7500) {
    const log = document.createElement("div");
    log.textContent = message;
    consoleBox.appendChild(log);
    // Update Log numbers
    updateLogNumbers();
    // Scroll console
    consoleBox.scrollTop = consoleBox.scrollHeight;
}
// Update Log numbers Function
function updateLogNumbers() {
    var _a;
    const logs = consoleBox.children;
    for (let i = 0; i < logs.length; i++) {
        const logElement = logs[i];
        // Remove previous numbering if present
        const message = ((_a = logElement.textContent) === null || _a === void 0 ? void 0 : _a.replace(/^\d+\s*\|\s*/, "")) || "";
        logElement.textContent = `${i + 1} | ${message}`;
    }
}
// Button Press
translateButton.addEventListener("click", () => {
    const value = inputBox.value.trim();
    // Prevent empty input
    if (!value) {
        logToConsole("Please enter text in the input box THIS IS A TEST TO MAKE SURE OVERSPILL WORKS");
        outputBox.textContent = "Empty";
        return;
    }
    // Update Output Box
    outputBox.textContent = value;
    logToConsole(`Translated Message: ${value}`);
});
// Assembling layout
container.appendChild(title);
container.appendChild(inputBox);
container.appendChild(translateButton);
container.appendChild(outputBox);
container.appendChild(consoleTitle);
container.appendChild(consoleBox);
container.appendChild(clearButton);
app.appendChild(container);
export {};
//# sourceMappingURL=main.js.map