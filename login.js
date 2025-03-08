document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    usernameError.textContent = "";
    passwordError.textContent = "";

    let hasError = false;

    if (username === "") {
        usernameError.textContent = "Username is required.";
        hasError = true;
    }

    if (password === "") {
        passwordError.textContent = "Password is required.";
        hasError = true;
    }

    if (hasError) {
        return; 
    }

    let users = [];
    try {
        const existingUsers = localStorage.getItem('users');
        if (existingUsers) {
            users = JSON.parse(existingUsers);
        }
    } catch (error) {
        console.error('Error parsing users:', error);
        passwordError.textContent = "Error accessing user data. Please try again.";
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', username);
        window.location.href = './exam.html';
    } else {
        passwordError.textContent = "Invalid username or password.";
    }
});
