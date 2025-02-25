document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
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
        alert('Username already exists');
        return;
    }

    const newUser = { fullname, username, password };
    users.push(newUser);
    
    try {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        localStorage.setItem('currentUserFullName', fullname);  

        console.log(" User Added:", newUser);
        console.log(" Stored Value - currentUserFullName:", localStorage.getItem('currentUserFullName'));

        alert('Registration successful!');
        window.location.href = './exam.html'; 
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error during registration. Please try again.');
    }
});
