document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const fullnameError = document.getElementById('fullnameError');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    fullnameError.textContent = "";
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let hasError = false;

    if (fullname.length < 3) {
        fullnameError.textContent = "Full name must be at least 3 characters.";
        hasError = true;
    }

    if (username.length < 3) {
        usernameError.textContent = "Username must be at least 3 characters.";
        hasError = true;
    } else if (username.includes(" ")) {
        usernameError.textContent = "Username should not contain spaces.";
        hasError = true;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        hasError = true;
    }

    if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        hasError = true;
    }

    if (confirmPassword !== password) {
        confirmPasswordError.textContent = "Passwords do not match.";
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
        users = [];
    }

    if (users.some(user => user.username === username)) {
        usernameError.textContent = "Username already exists.";
        return;
    }
    if (users.some(user => user.email === email)) {
        emailError.textContent = "Email is already registered.";
        return;
    }

    const newUser = { fullname, username, email, password };
    users.push(newUser);

    try {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        localStorage.setItem('currentUserFullName', fullname);

        console.log("User Added:", newUser);
        alert('Registration successful!');
        window.location.href = './exam.html';
    } catch (error) {
        console.error('Error saving user:', error);
    }
});
