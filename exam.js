class Question {
    constructor(title, image, category, options, correctAnswer) {
        this.title = title;
        this.image = image;
        this.category = category;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}

class Exam {
    constructor(questionsData) {
        this.questions = [];
        for (let i = 0; i < questionsData.length; i++) {
            const q = questionsData[i];
            this.questions.push(new Question(q.title, q.image, q.category, q.options, q.correctAnswer));
        }
        
        this.shuffledQuestions = this.shuffleArray([...this.questions]);
        this.currentQuestionIndex = 0;
        this.selectedAnswers = new Array(this.questions.length).fill(null);
        this.score = 0;
        this.timeLeft = 200; 
        this.timer = null;
        
        this.setupEventListeners();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    setupEventListeners() {
        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
                this.currentQuestionIndex++;
                this.displayQuestion();
            } else {
                this.showResults();
            }
        });
        
        const retryBtn = document.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => location.reload());
        }
    }
    

    startTimer() {
        const timerProgress = document.getElementById('timer-progress');
        const totalTime = 200; 
        
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            timerProgress.style.width = `${(this.timeLeft / totalTime) * 100}%`;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.showResults();
            }
        }, 1000);
    }
    
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.querySelector('.timer-text').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateProgressCircle() {
        let answeredCount = 0;
        for (let i = 0; i < this.selectedAnswers.length; i++) {
            if (this.selectedAnswers[i] !== null) {
                answeredCount++;
            }
        }
        
        document.querySelector('.progress-text').textContent = 
            `${answeredCount}/${this.questions.length}`;
        
        const percentage = (answeredCount / this.questions.length) * 100;
        const progressPath = document.getElementById('progress-path');
        const pathLength = progressPath.getTotalLength();
        
        progressPath.style.strokeDasharray = pathLength;
        progressPath.style.strokeDashoffset = pathLength - (pathLength * percentage / 100);
    }
    
    displayQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        
        document.querySelector('.question-number').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.shuffledQuestions.length}`;
        document.querySelector('.question-category').textContent = question.category;
        
        document.getElementById('question-title').textContent = question.title;
        document.getElementById('question-image').src = question.image;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        const shuffledOptions = this.shuffleArray([...question.options]);
        for (let i = 0; i < shuffledOptions.length; i++) {
            const option = shuffledOptions[i];
            
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            
            if (this.selectedAnswers[this.currentQuestionIndex] === option) {
                button.classList.add('selected');
            }
            
            const exam = this; 
            button.addEventListener('click', function() {
                document.querySelectorAll('.option').forEach(opt => 
                    opt.classList.remove('selected'));
                
                this.classList.add('selected');
                exam.selectedAnswers[exam.currentQuestionIndex] = option;
                
                document.getElementById('next-btn').disabled = false;
                exam.updateProgressCircle();
            });
            
            optionsContainer.appendChild(button);
        }
        
        document.getElementById('next-btn').textContent = 
            this.currentQuestionIndex === this.shuffledQuestions.length - 1 ? 'Finish' : 'Next';
        
        document.getElementById('next-btn').disabled = 
            this.selectedAnswers[this.currentQuestionIndex] === null;
    }
    
    showResults() {
        clearInterval(this.timer);
        
        this.score = 0;
        for (let i = 0; i < this.shuffledQuestions.length; i++) {
            if (this.selectedAnswers[i] === this.shuffledQuestions[i].correctAnswer) {
                this.score++;
            }
        }
        
        document.getElementById('question-container').style.display = 'none';
        document.getElementById('result-container').classList.remove('hidden');
        
        const percentage = (this.score / this.shuffledQuestions.length) * 100;
        document.getElementById('percentage').textContent = `${Math.round(percentage)}%`;
        
        document.getElementById('score-text').textContent = 
            `You answered ${this.score} out of ${this.shuffledQuestions.length} questions correctly`;
        
        const resultPath = document.getElementById('result-path');
        const pathLength = resultPath.getTotalLength();
        
        resultPath.style.strokeDasharray = pathLength;
        resultPath.style.strokeDashoffset = pathLength;
        
        setTimeout(() => {
            resultPath.style.strokeDashoffset = pathLength - (pathLength * percentage / 100);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }

    const studentName = localStorage.getItem('currentUserFullName');
    if (studentName) {
        document.querySelector('.username').textContent = studentName;
    } else {
        console.error("❌User not Exist!");
        document.querySelector('.username').textContent = "Student";
    }
    console.log("📌 Loaded Full Name:", studentName);

    const questionsData = [
        {
            title: "What is the output of the following Python code? print(3 * 'abc')",
            image: "https://picsum.photos/400/200?random=1",
            category: "Python Basics",
            options: ["abcabcabc", "3abc", "Error", "404"],
            correctAnswer: "abcabcabc"
        },
        {
            title: "Which data structure follows the Last In First Out (LIFO) principle?",
            image: "https://picsum.photos/400/200?random=2",
            category: "Data Structures",
            options: ["Queue", "Stack", "Heap", "Ram"],
            correctAnswer: "Stack"
        },
        {
            title: "What is the time complexity of a binary search algorithm?",
            image: "https://picsum.photos/400/200?random=3",
            category: "Algorithms",
            options: ["O(n)", "O(log n)", "O(n^2)", "O(n log n)"],
            correctAnswer: "O(log n)"
        },
        {
            title: "Which SQL clause is used to filter records?",
            image: "https://picsum.photos/400/200?random=4",
            category: "Databases",
            options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
            correctAnswer: "WHERE"
        },
        {
            title: "What does the 'this' keyword refer to in JavaScript?",
            image: "https://picsum.photos/400/200?random=5",
            category: "JavaScript",
            options: ["The current object", "The previous function", "A global variable", "None of the above"],
            correctAnswer: "The current object"
        },
        {
            title: "Which sorting algorithm has the best average-case time complexity?",
            image: "https://picsum.photos/400/200?random=6",
            category: "Algorithms",
            options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
            correctAnswer: "Merge Sort"
        },
        {
            title: "Which HTTP method is used to update an existing resource?",
            image: "https://picsum.photos/400/200?random=7",
            category: "Web Development",
            options: ["GET", "POST", "PUT", "DELETE"],
            correctAnswer: "PUT"
        },
        {
            title: "Which data type is immutable in Python?",
            image: "https://picsum.photos/400/200?random=8",
            category: "Python Basics",
            options: ["List", "Dictionary", "String", "Set"],
            correctAnswer: "String"
        },
        {
            title: "Which protocol is used for secure communication over the web?",
            image: "https://picsum.photos/400/200?random=9",
            category: "Networking",
            options: ["HTTP", "FTP", "SMTP", "HTTPS"],
            correctAnswer: "HTTPS"
        },
        {
            title: "Which database is an example of NoSQL?",
            image: "https://picsum.photos/400/200?random=10",
            category: "Databases",
            options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
            correctAnswer: "MongoDB"
        }
    ];

    const exam = new Exam(questionsData);
    exam.displayQuestion();
    exam.startTimer();
    exam.updateProgressCircle();
});