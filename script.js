// script.js

const cutscenes = [
    { artFile: 'ascii/cutscene1.txt', text: 'The world turned to stone...' },
    { artFile: 'ascii/cutscene2.txt', text: 'Thousands of years passed...' },
    { artFile: 'ascii/cutscene3.txt', text: 'You wake up alone...' }
];

const textEl = document.getElementById("cutscene-text");
const artEl = document.getElementById("ascii-art");
const continueBtn = document.getElementById("continue-btn");
const cutsceneContainer = document.getElementById("cutscene-container");
const terminalContainer = document.getElementById("terminal-container");
const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");

let currentCutscene = 0;
let gameStarted = false;

// Load ASCII art file content
async function loadAsciiArt(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) throw new Error("Failed to load ASCII art");
        return await response.text();
    } catch (err) {
        console.error(err);
        return "[Error loading art]";
    }
}

// Show cutscene by index
async function showCutscene(index) {
    if (index >= cutscenes.length) {
        cutsceneContainer.style.display = "none";
        terminalContainer.style.display = "flex";
        gameStarted = true;
        printToTerminal("Welcome to the terminal. Type 'help' for commands.");
        terminalInput.focus();
        return;
    }

    const scene = cutscenes[index];
    textEl.textContent = scene.text;
    artEl.textContent = "Loading...";
    continueBtn.disabled = true;
    continueBtn.classList.remove("enabled");

    const artText = await loadAsciiArt(scene.artFile);
    artEl.textContent = artText;

    setTimeout(() => {
        continueBtn.disabled = false;
        continueBtn.classList.add("enabled");
    }, 5000);
}

continueBtn.addEventListener("click", () => {
    currentCutscene++;
    showCutscene(currentCutscene);
});

// Print text to terminal output
function printToTerminal(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Clear the terminal output
function clearTerminal() {
    terminalOutput.innerHTML = "";
}

// Handle user input command with basic terminal commands only
function handleCommand(cmd) {
    printToTerminal(`> ${cmd}`);

    if (!cmd.trim()) return;

    const args = cmd.trim().split(/\s+/);
    const baseCmd = args[0].toLowerCase();

    switch (baseCmd) {
        case "help":
            printToTerminal("Supported commands: help, clear, echo [text], date, exit");
            break;

        case "clear":
            clearTerminal();
            break;

        case "echo":
            printToTerminal(args.slice(1).join(" "));
            break;

        case "date":
            printToTerminal(new Date().toString());
            break;

        case "exit":
            printToTerminal("Exiting terminal session...");
            terminalInput.disabled = true;
            break;

        default:
            printToTerminal(`Command not found: ${baseCmd}`);
    }
}

// Listen for Enter key on terminal input
terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = terminalInput.value;
        terminalInput.value = "";
        handleCommand(command);
    }
});

// Start first cutscene on load
showCutscene(currentCutscene);
