/* commit: feat(validation-bootstrap): enable custom Bootstrap validation */
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // cross-form custom checks (match confirm password)
            const pwd = form.querySelector('input[name="password"]');
            const confirm = form.querySelector('input[name="confirm_password"]');
            if (pwd && confirm) {
                confirm.setCustomValidity(pwd.value === confirm.value ? '' : 'Mismatch');
            }
            if (!form.checkValidity()) {
                e.preventDefault(); e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
})();
/* commit: feat(password-toggle): show/hide with eye/eye-slash icons */
document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.getAttribute('aria-controls'));
        if (!input) return;
        const icon = btn.querySelector('i');
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        btn.setAttribute('aria-pressed', String(isPwd));
        icon.classList.toggle('bi-eye');
        icon.classList.toggle('bi-eye-slash');
    });
});
/* commit: feat(capslock-detect): warn users when Caps Lock is active */
function attachCapsNotice(inputId, noticeId) {
    const input = document.getElementById(inputId);
    const notice = document.getElementById(noticeId);
    if (!input || !notice) return;

    const update = (ev) => {
        const on = ev.getModifierState && ev.getModifierState('CapsLock');
        notice.classList.toggle('d-none', !on);
    };
    input.addEventListener('keydown', update);
    input.addEventListener('keyup', update);
    input.addEventListener('focus', (e) => update(e));
    input.addEventListener('blur', () => notice.classList.add('d-none'));
}
attachCapsNotice('loginPassword', 'loginCaps');
/* commit: feat(strength-meter): simple password strength heuristic */
function strengthScore(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4); // 0..4
}
function bindStrength(inputId, barId) {
    const input = document.getElementById(inputId);
    const bar = document.getElementById(barId);
    if (!input || !bar) return;
    input.addEventListener('input', () => {
        const s = strengthScore(input.value);
        const pct = [0, 25, 50, 75, 100][s];
        bar.style.width = pct + '%';
        bar.className = 'progress-bar ' + (['', 'bg-weak', 'bg-fair', 'bg-good', 'bg-strong'][s] || '');
        // Trigger confirm match re-check if present
        const confirm = input.form?.querySelector('input[name="confirm_password"]');
        if (confirm) confirm.dispatchEvent(new Event('input'));
    });
}
bindStrength('studentPassword', 'studentStrengthBar');
bindStrength('adminPassword', 'adminStrengthBar');
bindStrength('signupPassword', 'signupStrengthBar');
/* commit: feat(confirm-match-live): live validity for confirm fields */
['student', 'admin'].forEach(prefix => {
    const pwd = document.getElementById(`${prefix}Password`);
    const confirm = document.getElementById(`${prefix}ConfirmPassword`);
    if (pwd && confirm) {
        const sync = () => confirm.setCustomValidity(pwd.value === confirm.value ? '' : 'Mismatch');
        pwd.addEventListener('input', sync);
        confirm.addEventListener('input', sync);
    }
});
// Add for new signup form
const signupPwd = document.getElementById('signupPassword');
const signupConfirm = document.getElementById('signupConfirmPassword');
if (signupPwd && signupConfirm) {
    const sync = () => signupConfirm.setCustomValidity(signupPwd.value === signupConfirm.value ? '' : 'Mismatch');
    signupPwd.addEventListener('input', sync);
    signupConfirm.addEventListener('input', sync);
}
/* commit: feat(remember-me): save & restore username/account type in localStorage */
(function rememberMe() {
    const user = document.getElementById('loginUsername');
    const type = document.getElementById('loginAccountType');
    const box = document.getElementById('rememberMe');

    // restore
    const saved = localStorage.getItem('edunabha_login');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (user && data.username) user.value = data.username;
            if (type && data.type) type.value = data.type;
            if (box) box.checked = true;
        } catch { }
    }

    // save on submit
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', () => {
            if (box && box.checked && user && type) {
                localStorage.setItem('edunabha_login', JSON.stringify({ username: user.value, type: type.value }));
            } else {
                localStorage.removeItem('edunabha_login');
            }
        });
    }
})();
/* commit: feat(reset-modal): basic email validation and feedback */
(() => {
    const sendBtn = document.getElementById('sendReset');
    const email = document.getElementById('resetEmail');
    const err = document.getElementById('resetEmailError');
    if (!sendBtn || !email || !err) return;

    sendBtn.addEventListener('click', () => {
        const valid = !!email.value && /\S+@\S+\.\S+/.test(email.value);
        err.classList.toggle('d-none', valid);
        if (valid) {
            sendBtn.textContent = 'Link sent!';
            sendBtn.classList.add('disabled');
            setTimeout(() => {
                sendBtn.textContent = 'Send link';
                sendBtn.classList.remove('disabled');
                const modal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
                modal?.hide();
            }, 1200);
        }
    });
})();

/* commit: feat(auth-flow): multi-step authentication flow */
(() => {
    let currentAction = ''; // 'login' or 'signup'
    let currentUserType = ''; // 'student' or 'admin'
    
    const initialChoice = document.getElementById('initialChoice');
    const userTypeChoice = document.getElementById('userTypeChoice');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const loginUserType = document.getElementById('loginUserType');
    const signupUserType = document.getElementById('signupUserType');
    const classField = document.getElementById('classField');
    const adminCodeField = document.getElementById('adminCodeField');
    
    // Step 1: Choose Login or Sign Up
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentAction = btn.dataset.choice;
            showUserTypeChoice();
        });
    });
    
    // Step 2: Choose User Type
    document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentUserType = btn.dataset.type;
            if (currentAction === 'login') {
                showLoginForm();
            } else {
                showSignupForm();
            }
        });
    });
    
    // Back buttons
    document.getElementById('backToChoice').addEventListener('click', showInitialChoice);
    document.getElementById('backToUserType').addEventListener('click', showUserTypeChoice);
    document.getElementById('backToUserTypeSignup').addEventListener('click', showUserTypeChoice);
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    function showInitialChoice() {
        hideAll();
        initialChoice.classList.remove('d-none');
    }
    
    function showUserTypeChoice() {
        hideAll();
        userTypeChoice.classList.remove('d-none');
    }
    
    function showLoginForm() {
        hideAll();
        loginFormContainer.classList.remove('d-none');
        loginUserType.textContent = `Logging in as ${currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}`;
    }
    
    function showSignupForm() {
        hideAll();
        signupFormContainer.classList.remove('d-none');
        signupUserType.textContent = `Signing up as ${currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}`;
        
        // Show/hide fields based on user type
        if (currentUserType === 'student') {
            classField.style.display = 'block';
            adminCodeField.style.display = 'none';
            document.getElementById('signupClass').required = true;
            document.getElementById('signupAdminCode').required = false;
        } else {
            classField.style.display = 'none';
            adminCodeField.style.display = 'block';
            document.getElementById('signupClass').required = false;
            document.getElementById('signupAdminCode').required = true;
        }
    }
    
    function hideAll() {
        initialChoice.classList.add('d-none');
        userTypeChoice.classList.add('d-none');
        loginFormContainer.classList.add('d-none');
        signupFormContainer.classList.add('d-none');
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        if (!e.target.checkValidity()) {
            e.target.classList.add('was-validated');
            return;
        }
        
        // Simulate login success
        const username = document.getElementById('loginUsername').value;
        
        // Store user data in localStorage for dashboard
        const userData = {
            username: username,
            userType: currentUserType,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('edunabha_user', JSON.stringify(userData));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
    
    function handleSignup(e) {
        e.preventDefault();
        
        if (!e.target.checkValidity()) {
            e.target.classList.add('was-validated');
            return;
        }
        
        // Simulate signup success
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        
        // Store user data in localStorage for dashboard
        const userData = {
            username: name,
            email: email,
            userType: currentUserType,
            loginTime: new Date().toISOString(),
            isNewUser: true
        };
        localStorage.setItem('edunabha_user', JSON.stringify(userData));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }
})();
