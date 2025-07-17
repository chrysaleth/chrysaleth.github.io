// script.js

const VERSION = "0.01";
const SYSTEM_NAME = "Natura Survival Console";

const cutscenes = [
    {
        artFile: 'ascii/cutscene1.txt',
        text: 'The world turned to stone...'
    },
    {
        artFile: 'ascii/cutscene2.txt',
        text: 'Thousands of years passed...'
    },
    {
        artFile: 'ascii/cutscene3.txt',
        text: 'You wake up alone...'
    }
];

const textEl = document.getElementById("cutscene-text");
const artEl = document.getElementById("ascii-art");
const cutsceneContainer = document.getElementById("cutscene");
const continueBtn = document.getElementById("continue-btn");
const terminalContainer = document.getElementById("terminal");
const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");

let currentCutscene = 0;
let gameStarted = false;

const fakeFilesystem = {
    "C:\\": {
        type: "dir",
        contents: {
            "Users": {
                type: "dir",
                contents: {
                    "Player": {
                        type: "dir",
                        contents: {
                            "Documents": { type: "dir", contents: {} },
                            "Desktop": { type: "dir", contents: {} },
                            "readme.txt": {
                                type: "file",
                                content: "Welcome to Natura Survival Console.\nUse 'help' to see commands."
                            }
                        }
                    }
                }
            },
            "System": { type: "dir", contents: {} },
            "autoexec.ntr": {
                type: "file",
                content: "Boot sequence config for Natura Terminal."
            }
        }
    }
};

let currentPath = ["C:\\"];

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
        // Hide cutscene area and continue button
        cutsceneContainer.style.display = "none";
        continueBtn.style.display = "none";
        // Start boot animation
        await playBootAnimation();
        // Show terminal
        terminalContainer.style.display = "flex";
        gameStarted = true;
        printToTerminal(`${SYSTEM_NAME} [Version ${VERSION}]`);
        printToTerminal(`(c) Natura Foundation. All rights reserved.\n`);
        printToTerminal(getPrompt());
        terminalInput.focus();
        return;
    }

    continueBtn.disabled = true;
    continueBtn.classList.remove("enabled");

    const scene = cutscenes[index];
    textEl.textContent = "";
    artEl.textContent = "Loading...";

    const artText = await loadAsciiArt(scene.artFile);
    artEl.textContent = artText;
    textEl.textContent = scene.text;

    // After 5 seconds enable continue button with fade effect
    setTimeout(() => {
        continueBtn.disabled = false;
        continueBtn.classList.add("enabled");
    }, 5000);
}

continueBtn.addEventListener("click", () => {
    if (continueBtn.disabled) return;
    currentCutscene++;
    showCutscene(currentCutscene);
});

// Simple boot animation function
async function playBootAnimation() {
    const bootLines = [
        "Booting Natura Survival Console...",
        "Loading system files...",
        "Initializing hardware...",
        "Starting services...",
        "System ready."
    ];

    clearTerminal();

    for (const line of bootLines) {
        printToTerminal(line);
        await delay(800);
    }
}

// Utility delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

// Get current prompt string like "C:\Users\Player>"
function getPrompt() {
    return currentPath.join('') + ">";
}

// Resolve path string to node in fakeFilesystem, returns node or null
function resolvePath(pathStr) {
    if (!pathStr) return null;

    let parts, node;
    if (pathStr.startsWith("C:\\")) {
        parts = pathStr.slice(3).split(/\\+/).filter(Boolean);
        node = fakeFilesystem["C:\\"];
    } else if (pathStr.startsWith("\\")) {
        parts = pathStr.slice(1).split(/\\+/).filter(Boolean);
        node = fakeFilesystem["C:\\"];
    } else {
        parts = pathStr.split(/\\+/).filter(Boolean);
        node = getCurrentNode();
    }

    for (const part of parts) {
        if (!node || node.type !== "dir" || !node.contents[part]) return null;
        node = node.contents[part];
    }
    return node;
}

// Get current directory node
function getCurrentNode() {
    let node = fakeFilesystem["C:\\"];
    for (let i = 1; i < currentPath.length; i++) {
        const part = currentPath[i];
        if (node && node.type === "dir") {
            node = node.contents[part];
        } else {
            return null;
        }
    }
    return node;
}

// Change current directory path
function changeDirectory(pathStr) {
    if (!pathStr) return false;

    const target = resolvePath(pathStr);
    if (!target || target.type !== "dir") return false;

    let newPath;
    if (pathStr.startsWith("C:\\")) {
        newPath = ["C:\\"].concat(pathStr.slice(3).split(/\\+/).filter(Boolean));
    } else if (pathStr.startsWith("\\")) {
        newPath = ["C:\\"].concat(pathStr.slice(1).split(/\\+/).filter(Boolean));
    } else {
        const relative = pathStr.split(/\\+/).filter(Boolean);
        newPath = [...currentPath];
        for (const part of relative) {
            if (part === "..") {
                if (newPath.length > 1) newPath.pop();
            } else if (part !== ".") {
                newPath.push(part);
            }
        }
    }
    currentPath = newPath;
    return true;
}

// List directory contents
function listDirectory(pathStr) {
    const node = pathStr ? resolvePath(pathStr) : getCurrentNode();
    if (!node || node.type !== "dir") return null;
    return Object.entries(node.contents).map(([name, info]) => ({ name, type: info.type }));
}

// Handle terminal commands with features (can expand later)
function handleCommand(cmd) {
    printToTerminal(getPrompt() + " " + cmd);

    if (!cmd.trim()) {
        printToTerminal(getPrompt());
        return;
    }

    const args = cmd.trim().split(/\s+/);
    const baseCmd = args[0].toLowerCase();

    switch (baseCmd) {
        case "help":
            printToTerminal(`Supported commands:
  help           - Show this help
  cls            - Clear the screen
  dir [path]     - List directory contents
  cd [path]      - Change directory
  echo [text]    - Display text
  date           - Show current date
  time           - Show current time
  ver            - Show Natura version
  exit           - Disable input
  hostname       - Show system name
  systeminfo     - Show basic system info
  tasklist       - Simulated task list
  visit [url]    - Open URL in new tab
  ping [host]    - Ping a hostname or IP
  calc [expr]    - Simple calculator (e.g. calc 2+2)
  clear          - Clear the screen (alias of cls)
  uptime         - Show time since page load
  ascii [name]   - Show built-in ascii art (e.g. ascii tree)
  about          - Show info about this terminal`);
            break;

        case "cls":
        case "clear":
            clearTerminal();
            break;

        case "dir": {
            const path = args[1] || "";
            const files = listDirectory(path);
            if (!files) {
                printToTerminal("The system cannot find the path specified.");
            } else {
                printToTerminal(` Directory of ${path || getPrompt()}`);
                files.forEach(f => {
                    printToTerminal(`${f.type === "dir" ? "<DIR>" : "     "}    ${f.name}`);
                });
                printToTerminal("");
            }
            break;
        }

        case "cd": {
            if (!args[1]) {
                printToTerminal(getPrompt());
                break;
            }
            if (!changeDirectory(args[1])) {
                printToTerminal("The system cannot find the path specified.");
            } else {
                printToTerminal(getPrompt());
            }
            break;
        }

        case "echo":
            printToTerminal(args.slice(1).join(" "));
            break;

        case "date":
            printToTerminal(new Date().toLocaleDateString());
            break;

        case "time":
            printToTerminal(new Date().toLocaleTimeString());
            break;

        case "ver":
            printToTerminal(`${SYSTEM_NAME} [Version ${VERSION}]`);
            break;

        case "exit":
            printToTerminal("Session ended.");
            terminalInput.disabled = true;
            break;

        case "hostname":
            printToTerminal("NATURA-CONSOLE");
            break;

        case "systeminfo":
            printToTerminal("Host Name: NATURA-CONSOLE");
            printToTerminal("OS Name: Natura Survival OS");
            printToTerminal("OS Version: 0.01 Alpha");
            printToTerminal("Manufacturer: OpenNatura Labs");
            printToTerminal("Model: FossilShell-v1");
            break;

        case "tasklist":
            printToTerminal("Image Name                   PID Session Name        Mem Usage");
            printToTerminal("========================= ====== ================ ===========");
            printToTerminal("explorer.exe                1024 Console                    1    42,000 K");
            printToTerminal("natura.exe                  4520 Console                    1   150,000 K");
            break;

        case "visit": {
            if (!args[1]) {
                printToTerminal("Usage: visit [url]");
                break;
            }
            let url = args[1];
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }
            printToTerminal(`Opening ${url}...`);
            window.open(url, "_blank");
            break;
        }

        case "ping": {
            if (!args[1]) {
                printToTerminal("Usage: ping [host]");
                break;
            }
            const host = args[1];
            printToTerminal(`Pinging ${host} with 32 bytes of data:`);
            for (let i = 0; i < 4; i++) {
                const time = Math.floor(Math.random() * 100) + 1;
                printToTerminal(`Reply from ${host}: bytes=32 time=${time}ms TTL=128`);
            }
            printToTerminal(`Ping statistics for ${host}:`);
            printToTerminal(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`);
            break;
        }

        case "calc": {
            if (args.length < 2) {
                printToTerminal("Usage: calc [expression]");
                break;
            }
            const expr = args.slice(1).join(" ");
            try {
                if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error("Invalid characters");
                const result = Function(`"use strict"; return (${expr})`)();
                printToTerminal(`${expr} = ${result}`);
            } catch {
                printToTerminal("Invalid expression.");
            }
            break;
        }

        case "uptime": {
            const uptimeMs = performance.now();
            const sec = Math.floor((uptimeMs / 1000) % 60);
            const min = Math.floor((uptimeMs / (1000 * 60)) % 60);
            const hrs = Math.floor(uptimeMs / (1000 * 60 * 60));
            printToTerminal(`Uptime: ${hrs}h ${min}m ${sec}s`);
            break;
        }

        case "ascii": {
            if (args.length < 2) {
                printToTerminal("Usage: ascii [name]");
                break;
            }
            const arts = {
                tree: `
   &&& &&  & &&
  && &\\/&\\|& ()|/ @, &&
  &\\/(/&/&||/& /_/)_&/_&
&&() &\\/&|()|/&\\/ '%" & &&
&_\\_&&_\\ |& |&&/&__%_/_& &&
&&   && & &| &| /& & % ()& /&&
 ()&_---()&\\&\\|&&-&&--%---()~
     &&     \\|||
             |||
             |||
             |||
       , -=-~  .-^- _

        `,
                smiley: `
   _____
  /     \\
 | () () |
  \\  ^  /
   |||||
   |||||
        `
            };
            const artName = args[1].toLowerCase();
            if (arts[artName]) {
                printToTerminal(arts[artName]);
            } else {
                printToTerminal("No ascii art found with that name.");
            }
            break;
        }

        case "about":
            printToTerminal(`${SYSTEM_NAME} Terminal\nVersion ${VERSION}\nDeveloped by OpenNatura Labs`);
            break;

        default:
            printToTerminal(`'${baseCmd}' is not recognized as an internal or external command,`);
            printToTerminal("operable program or batch file.");
    }

    if (gameStarted && baseCmd !== "exit") {
        printToTerminal(getPrompt());
    }
}

// Listen for Enter key on terminal input
terminalInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const command = terminalInput.value;
        terminalInput.value = "";
        handleCommand(command);
    }
});

// Start first cutscene on load
showCutscene(currentCutscene);

