// Challenge Array
const challenges = [
    {
        instruction: "Create a heading that says 'Welcome to Web World!' using an <h1> tag.",
        solution: /<h1>\s*Welcome to Web World!\s*<\/h1>/i,
    },
    {
        instruction: "Style the heading with a blue color using inline CSS.",
        solution: /<h1 style=".*color:\s*blue;.*">.*<\/h1>/i,
    },
    {
        instruction: "Add a button that shows an alert saying 'Hello, World!' when clicked.",
        solution: /<button onclick="alert'Hello, World!'">\s*Click Me\s*<\/button>/i,
    },
    {
        instruction: "Add a button that increases a counter by 1 every time you click it.",
        solution: /<button onclick="incrementCounter.*>.*<\/button>/i,
        jsFunction: function () {
            let counter = 0;

            document.getElementById("output").innerHTML = `<p id="counter">Counter: ${counter}</p>
            <button onclick="incrementCounter()">Click Me</button>`;
        },
    },
];

let currentChallenge = 0;
let score = parseInt(localStorage.getItem("score")) || 0;

// Sound Effects
const successSound = new Audio("sounds/success.mp3");
const errorSound = new Audio("sounds/error.mp3");

// Update Story Text
function updateStory() {
    const challenge = 
    challenges[currentChallenge];
    document.getElementById("story-text").textContent = challenge.instruction;

    const selector =
    document.getElementById("challenge-selector");
    selector.innerHTML = challenge
    .map(
        (c,i) =>
         `<option value="${i}" ${
            i === currentChallenge ? "selected": 
            ""
        }>Challenge ${i + 1}</option>`
    )
    .join("");
}

// Save Progress
function saveProgress() {
    localStorage.setitem("currentChallenge", 
    currentChallenge);
    localStorage.setitem("userCode", 
    document.getElementById("code-input").value);
    localStorage.setitem("score", score);
}

// Validate Code
function validateCode() {
    const userCode = document.getElementById("code-input").value;
    const challenge = challenges[currentChallenge];

    if(challenge.solution.test(userCode)) {
        successSound.play();
        score += 10;
        alert(`Correct! Your score is now: ${score}.`);
        currentChallenge++;

        if(currentChallenge < challenges.length) {
            updateStory();
        } else {
            alert("Congradulations! You completed all challenges!");

            saveToLeaderboard(localStorage.getItem("username"), score);
            displayLeaderboard();
        }
    } else {
        errorSound.play();
        score -= 5;
        alert(`Incorrect! Your score is now: ${score}.`);
    }

    document.getElementById("output").innerHTML = userCode;
    saveProgress();
}

// Leaderboard Functions
function saveToLeaderboard(username, score) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ username, score });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function displayLeadership() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const sorted = leaderboard.sort((a,b) => b.sort - a.score);
    let leaderboardHTML = "<h3>Leaderboard</h3><ul>";

    sorted.forEach((entry) => {
        leaderboardHTML += `<li>${entry.username}: ${entry.score} points</li>`;
    });

    leaderboardHTML += "</ul>";

    document.getElementById("output").innerHTML = leaderboardHTML;
}

// Load Progress
function loadProgress() {
    currentChallenge = parseInt(localStorage.getItem("currentChallenge")) || 0;
    const savedCode = localStorage.getItem("userCode");
    if (savedCode)
        document.getElementById("code-input").value = savedCode;
    updateStory();
}

// User Login
document.getElementById("start-game").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    if (username) {
        localStorage.setItem("username", username);
        alert(`Welcome, ${username}!`);
        document.getElementById("user-profile").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        loadProgress();
    } else {
        alert("Please enter a name to start!");
    }
});

// Initialize
document.getElementById("run-code").addEventListener("click", validateCode);
document.getElementById("challenge-selector").addEventListener("change", function() {
    currentChallenge = parseInt(this.value);
    updateStory();
});