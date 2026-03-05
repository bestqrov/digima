function togglePassword() {
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>';
        eyeIcon.style.stroke = '#a78bfa';
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
        eyeIcon.style.stroke = '';
    }
}

function fillDemo(type) {
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');

    emailInput.style.transform = 'scale(0.98)';
    passwordInput.style.transform = 'scale(0.98)';

    setTimeout(function () {
        if (type === 'admin') {
            emailInput.value = 'admin@arwapark.com';
            passwordInput.value = 'admin123';
        } else if (type === 'agency') {
            emailInput.value = 'agency@example.com';
            passwordInput.value = 'agency123';
        }

        emailInput.style.transform = 'scale(1)';
        passwordInput.style.transform = 'scale(1)';

        var glow = '0 0 0 2px rgba(34,197,94,.5), 0 0 20px rgba(34,197,94,.3)';
        emailInput.style.boxShadow = glow;
        passwordInput.style.boxShadow = glow;

        setTimeout(function () {
            emailInput.style.boxShadow = '';
            passwordInput.style.boxShadow = '';
        }, 1000);
    }, 150);
}

async function handleLogin(event) {
    event.preventDefault();

    var loginBtn = document.getElementById('login-btn');
    var loginText = document.getElementById('login-text');
    var loginSpinner = document.getElementById('login-spinner');
    var arrowIcon = document.getElementById('arrow-icon');
    var form = event.target;
    var formData = new FormData(form);

    loginText.textContent = 'Authenticating...';
    loginSpinner.style.display = 'block';
    if (arrowIcon) arrowIcon.style.display = 'none';
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
            loginText.textContent = 'Success!';
            loginSpinner.style.display = 'none';
            localStorage.setItem('token', data.accessToken);
            setTimeout(function () { window.location.href = '/dashboard'; }, 800);
        } else {
            var error = await response.json();
            throw new Error(error.message || 'Invalid credentials');
        }
    } catch (err) {
        console.error('Login error:', err);
        loginText.textContent = 'Login Failed';
        setTimeout(function () { alert('Login failed: ' + err.message); }, 300);
    } finally {
        setTimeout(function () {
            loginText.textContent = 'Sign In';
            loginSpinner.style.display = 'none';
            if (arrowIcon) arrowIcon.style.display = '';
            loginBtn.disabled = false;
        }, 2000);
    }
}
