document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            alert('Login failed. Check your credentials.');
            return;
        }

        const data = await response.text();
        localStorage.setItem('token', data);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error during login:', error);
    }
});
