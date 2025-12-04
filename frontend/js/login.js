document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login berhasil!");
            window.location.href = "./home.html";
        } else {
            alert(data.message || "Login gagal!");
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi error di server.");
    }
});
