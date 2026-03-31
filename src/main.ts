declare const tsParticles: any;

const app = document.getElementById("app")
if (!app) throw new Error("App Container Not Found")

// Particle background
const particlesBg = document.createElement("div")
particlesBg.id = "particles-bg"
document.body.appendChild(particlesBg)

let particlesInstance: any

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
})

// Main container of website
const container = document.createElement("div")
container.className = "container"

// Title
const title = document.createElement("h1")
title.className = "title"
title.innerText = "Machine Translation (LANGUAGE)"

// Input Box
const inputBox = document.createElement("input")
inputBox.className = "input-box"
inputBox.placeholder = "Enter Here..."

// Button
const translateButton = document.createElement("button")
translateButton.className = "translate-button"
translateButton.textContent = "Translate"

// Output Box
const outputBox = document.createElement("div")
outputBox.className = "output-box"
outputBox.textContent = "Empty"

// Console Title
const consoleTitle = document.createElement("h2")
consoleTitle.className = "console-title"
consoleTitle.innerText = "Console"

// Console Area
const consoleBox = document.createElement("div")
consoleBox.className = "console-box"

// Console Separator
const separator = document.createElement("hr")
separator.className = "separator"

// About Title
const aboutTitle = document.createElement("h1")
aboutTitle.className = "about-title"
aboutTitle.innerText = "About This Project"

// about container
const aboutContainer = document.createElement("div")
aboutContainer.className = "about-container"

// About
const about = document.createElement("p")
about.className = "about-section"
about.innerText = `
This project is meant to express API usage, as well as proper documentation and error management.

You can either manually type a message, or upload a .txt file.

Depending on your choice, It will either be shown in the output box, or a downloadable txt file, with the translated message

This project only translates into X, with no intentions of multiple languages.

EXPLAIN HOW IT WORKS

`

// Console Clear Button
const clearButton = document.createElement("button")
clearButton.className = "clear-button"
clearButton.textContent = "Clear Console"

// Clearing Console
clearButton.addEventListener("click", () => {
    consoleBox.innerHTML = ""
})

// Console Log Function
function logToConsole(message: string, duration = 7500) {
    const log = document.createElement("div")
    log.textContent = message
    consoleBox.appendChild(log)

    // Update Log numbers
    updateLogNumbers()

    // Scroll console
    consoleBox.scrollTop = consoleBox.scrollHeight
}

// Update Log numbers Function
function updateLogNumbers() {
    const logs = consoleBox.children
    for (let i = 0; i < logs.length; i++) {
        const logElement = logs[i] as HTMLElement
        // Remove previous numbering if present
        const message = logElement.textContent?.replace(/^\d+\s*\|\s*/, "") || ""
        logElement.textContent = `${i+1} | ${message}`
    }
}

// Button Press
translateButton.addEventListener("click", () => {
    const value = inputBox.value.trim()

    // Prevent empty input
    if (!value) {
        logToConsole("Please enter text in the input box THIS IS A TEST TO MAKE SURE OVERSPILL WORKS")
        outputBox.textContent = "Empty"
        return
    }

    // Update Output Box
    outputBox.textContent = value

    logToConsole(`Translated Message: ${value}`)
})

// Assembling layout of main loop
container.appendChild(title)
container.appendChild(inputBox)
container.appendChild(translateButton)
container.appendChild(outputBox)
container.appendChild(consoleTitle)
container.appendChild(consoleBox)
container.appendChild(clearButton)

// Separator
container.appendChild(separator)

// Information screen
container.appendChild(aboutTitle)
aboutContainer.appendChild(about)
container.appendChild(aboutContainer)

app.appendChild(container)
