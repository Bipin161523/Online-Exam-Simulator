let questions = [];
let index = 0;
let score = 0;
let time = localStorage.getItem("time") || 60;
let selectedSubject = localStorage.getItem("subject");

document.getElementById("welcome").innerText =
"Subject: " + selectedSubject;

// Timer
setInterval(() => {
    time--;
    document.getElementById("timer").innerText = "Time: " + time;

    if(time <= 0) finishExam();
}, 1000);

// Load XML
fetch("questions.xml")
.then(res => res.text())
.then(data => {
    let qLimit = localStorage.getItem("qCount");

fetch("questions.xml")
.then(res => res.text())
.then(data => {
    let parser = new DOMParser();
    let xml = parser.parseFromString(data, "text/xml");

    let q = xml.getElementsByTagName("question");

    let filtered = [];

    for(let i=0; i<q.length; i++){
        let subject = q[i].getAttribute("subject");

        if(subject === selectedSubject) {
            filtered.push({
                text: q[i].children[0].textContent,
                options: [
                    q[i].children[1].textContent,
                    q[i].children[2].textContent,
                    q[i].children[3].textContent,
                    q[i].children[4].textContent
                ],
                answer: q[i].children[5].textContent
            });
        }
    }

    // Shuffle questions
    filtered.sort(() => 0.5 - Math.random());

    // Take only 5 or 10
    questions = filtered.slice(0, qLimit);

    loadQuestion();
});
});

function loadQuestion() {
    let q = questions[index];

    let html = `<h3>${q.text}</h3>`;

    q.options.forEach(opt => {
        html += `<div class="option" onclick="selectOption(this, '${opt}')">${opt}</div>`;
    });

    document.getElementById("questionBox").innerHTML = html;
}

// select option
let selectedAnswer = "";

function selectOption(el, value) {
    document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    selectedAnswer = value;
}

// next
function nextQuestion() {
    if(selectedAnswer === questions[index].answer){
        score++;
    }

    selectedAnswer = "";
    index++;

    if(index < questions.length){
        loadQuestion();
    } else {
        finishExam();
    }
}

function nextQuestion() {
    let selected = document.querySelector('input[name="opt"]:checked');

    if(selected && selected.value == questions[index].answer){
        score++;
    }

    index++;

    if(index < questions.length){
        loadQuestion();
    } else {
        finishExam();
    }
}

function finishExam() {
    localStorage.setItem("score", score);
    window.location.href = "result.html";
}