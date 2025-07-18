document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:8081/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert('Registration failed: ' + (errorData.message || 'Unknown error.'));
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
});
