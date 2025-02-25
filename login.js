document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    let users = [];
    try {
        const existingUsers = localStorage.getItem('users');
        if (existingUsers) {
            users = JSON.parse(existingUsers);
        }
    } catch (error) {
        console.error('Error parsing users:', error);
        alert('Error accessing user data. Please try again.');
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        window.location.href = './exam.html';
    } else {
        alert('Invalid username or password');
    }
});