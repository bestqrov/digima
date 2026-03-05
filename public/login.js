function togglePassword() {
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>';
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
    }
}

async function handleLogin(event) {
    event.preventDefault();

    var loginBtn = document.getElementById('login-btn');
    var loginText = document.getElementById('login-text');
    var loginSpinner = document.getElementById('login-spinner');
    var form = event.target;
    var formData = new FormData(form);

    loginText.textContent = 'Signing in...';
    loginSpinner.style.display = 'block';
    loginBtn.disabled = true;

    try {
        var response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });

        if (response.ok) {
            var data = await response.json();
            localStorage.setItem('token', data.accessToken);
            window.location.href = '/dashboard';
        } else {
            var error = await response.json();
            alert('Login failed: ' + (error.message || 'Invalid credentials'));
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed: Network error. Please try again.');
    } finally {
        loginText.textContent = 'Sign in';
        loginSpinner.style.display = 'none';
        loginBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Auto-fill demo credentials on click
    document.querySelectorAll('.demo-box p[data-email]').forEach(function (el) {
        el.addEventListener('click', function () {
            document.getElementById('email').value = el.dataset.email;
            document.getElementById('password').value = el.dataset.password;
        });
    });
});
