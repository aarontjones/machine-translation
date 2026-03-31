const app = document.getElementById("app");
if (!app)
    throw new Error("App Container Not Found");
// Main container of website
const container = document.createElement("div");
container.className = "container";
// top row of box
const topRow = document.createElement("div");
topRow.className = "top-row";
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
outputBox.textContent = "Output";
// Console Area
const consoleBox = document.createElement("div");
consoleBox.className = "console-box";
consoleBox.textContent = "Console here...";
// Assemble Layout
topRow.appendChild(inputBox);
topRow.appendChild(translateButton);
topRow.appendChild(outputBox);
container.appendChild(topRow);
container.appendChild(consoleBox);
app.appendChild(container);
export {};
//# sourceMappingURL=main.js.map