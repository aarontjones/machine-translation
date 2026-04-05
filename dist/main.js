var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Socket Stuff
const socket = io("https://machine-translation-9ygl.onrender.com");
// Receive logs realtime
socket.on("log", (message) => {
    logToConsole(message);
});
// Receive Final Result
let lastTranslatedText = null;
socket.on("done", (data) => {
    if (data.translated) {
        lastTranslatedText = data.translated;
        // Showing download icon because a translation is ready
        fileDownloadIcon.style.display = "inline-block";
        // Only show in output if normal input is used
        if (!fileInputText) {
            outputBox.textContent = data.translated;
            outputBox.classList.remove("hidden");
        }
        logToConsole(`Translated message: ${data.translated}`);
    }
    else {
        lastTranslatedText = null;
        fileDownloadIcon.style.display = "none"; // Hide icon if nothing is downloadable
        outputBox.textContent = "";
        outputBox.classList.add("hidden");
    }
});
// Creating app
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
title.innerText = "Machine Translation (Spanish)";
// Input Wrapper
const inputWrapper = document.createElement("div");
inputWrapper.className = "input-wrapper";
// Input Box
const inputBox = document.createElement("input");
inputBox.className = "input-box";
inputBox.placeholder = "Enter Here...";
// Clear Input Button
const clearInput = document.createElement("button");
clearInput.className = "clear-input";
clearInput.textContent = "X";
// Left File Icon (Input)
const fileInputIcon = document.createElement("img");
fileInputIcon.src = "assets/images/file.png";
fileInputIcon.className = "file-icon left-icon";
fileInputIcon.title = "Select Input File";
// Hidden File Input
const hiddenFileInput = document.createElement("input");
hiddenFileInput.type = "file";
hiddenFileInput.accept = ".txt"; // only allow txt file
hiddenFileInput.style.display = "none";
// Right File Icon (Download Translation)
const fileDownloadIcon = document.createElement("img");
fileDownloadIcon.src = "assets/images/file.png";
fileDownloadIcon.className = "file-icon right-icon";
fileDownloadIcon.title = "Download Translation";
fileDownloadIcon.style.display = "none"; // Hidden by default
// Wrapper for button and 2 files
const translateWrapper = document.createElement("div");
translateWrapper.className = "translate-wrapper";
// Translate Button
const translateButton = document.createElement("button");
translateButton.className = "translate-button";
translateButton.textContent = "Translate";
// Output Box
const outputBox = document.createElement("div");
outputBox.className = "output-box";
outputBox.textContent = "";
// Auto hide output box, when its empty
outputBox.classList.add("hidden");
// Console Title
const consoleTitle = document.createElement("h2");
consoleTitle.className = "console-title";
consoleTitle.innerText = "Console";
// Console Area
const consoleBox = document.createElement("div");
consoleBox.className = "console-box";
// Console Separator
const separator = document.createElement("hr");
separator.className = "separator";
// About Title
const aboutTitle = document.createElement("h1");
aboutTitle.className = "about-title";
aboutTitle.innerText = "About This Project";
// about container
const aboutContainer = document.createElement("div");
aboutContainer.className = "about-container";
// About
const about = document.createElement("p");
about.className = "about-section";
about.innerText = `

Welcome to my Machine Translation Demo website.

This project is meant to express API usage, error management and logging via a built in console and production deployment.

The project only translates into Spanish, with no intention of other languages.

Warning: Sometimes when the app hasnt been run for a while, it can take long to translate a message.
The reason why is that I am using Render's Free option, which can take up to 50 seconds to warm up.

---Workflow:

1) The frontend website, which you're seeing, is connected to a Python script, hosted on Render.

2) When you translate, it sends a request via HTTPS to the script.

3) The Python script sends an API request to a Hugging Face Transformer, which translates the message into Spanish.

4) The translated messages returns to the webpage, in either the output field or the downloadable file.
`;
// Console Clear Button
const clearButton = document.createElement("button");
clearButton.className = "clear-button";
clearButton.textContent = "Clear Console";
// Clearing Console
clearButton.addEventListener("click", () => {
    consoleBox.innerHTML = "";
});
// File Selection Logic
let fileInputText = null;
// When left icon is clicked, trigger file input
fileInputIcon.addEventListener("click", () => {
    hiddenFileInput.click();
});
// Read File Content
hiddenFileInput.addEventListener("change", (event) => __awaiter(void 0, void 0, void 0, function* () {
    const file = event.target.files[0];
    if (!file)
        return;
    const text = yield file.text();
    fileInputText = text;
    logToConsole(`File Loaded: ${file.name}`);
}));
// Download translation
fileDownloadIcon.addEventListener("click", () => {
    if (!lastTranslatedText) {
        logToConsole("No translated text available to download");
        return;
    }
    const blob = new Blob([lastTranslatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translation.txt";
    a.click();
    URL.revokeObjectURL(url);
    logToConsole("Translation downloaded as translation.txt");
    // Clearing input file after download - otherwise it overrides input text field
    fileInputText = null;
    hiddenFileInput.value = "";
    fileDownloadIcon.style.display = "none";
    logToConsole("Resetting input file after download");
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
// Clear Button Press
clearInput.addEventListener("click", () => {
    inputBox.value = "";
    outputBox.textContent = "";
    outputBox.classList.add("hidden");
});
// Translate Button Press - Main loop
translateButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const value = fileInputText !== null && fileInputText !== void 0 ? fileInputText : inputBox.value.trim(); // Use File input if it exists first.
    // Prevent empty input
    if (!value) {
        logToConsole("Please enter text in the input box.");
        outputBox.textContent = "";
        outputBox.classList.add("hidden");
        return;
    }
    // Update Output Box
    try {
        // Clear previous output
        outputBox.textContent = "";
        outputBox.classList.add("hidden");
        logToConsole("Running Translation Script");
        socket.emit("translate", { text: value });
    }
    catch (error) {
        outputBox.classList.add("hidden"); // Another fallback on error
        logToConsole("Error Connecting to Python Backend");
        console.error(error);
    }
}));
// Assembling input layer
inputWrapper.appendChild(inputBox);
inputWrapper.appendChild(clearInput);
// Assembling Translate layer
translateWrapper.appendChild(fileInputIcon);
translateWrapper.appendChild(translateButton);
translateWrapper.appendChild(fileDownloadIcon);
// Assembling layout of main loop
container.appendChild(title);
container.appendChild(inputWrapper);
container.appendChild(translateWrapper);
container.appendChild(hiddenFileInput);
container.appendChild(outputBox);
container.appendChild(consoleTitle);
container.appendChild(consoleBox);
container.appendChild(clearButton);
// Separator
container.appendChild(separator);
// Information screen
container.appendChild(aboutTitle);
aboutContainer.appendChild(about);
container.appendChild(aboutContainer);
app.appendChild(container);
export {};
//# sourceMappingURL=main.js.map