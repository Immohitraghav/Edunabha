// Authentication guard utility
class AuthGuard {
    static isAuthenticated() {
        const userData = localStorage.getItem('edunabha_user');
        return userData && JSON.parse(userData).username;
    }

    static requireAuth(redirectMessage = 'You need to login first.') {
        if (!this.isAuthenticated()) {
            localStorage.setItem('auth_redirect_message', redirectMessage);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    static getUserData() {
        const userData = localStorage.getItem('edunabha_user');
        return userData ? JSON.parse(userData) : null;
    }

    static logout() {
        localStorage.removeItem('edunabha_user');
        localStorage.removeItem('enrolled_courses');
        localStorage.removeItem('course_progress');
        window.location.href = 'index.html';
    }
}

// Show auth redirect message if present
document.addEventListener('DOMContentLoaded', () => {
    const message = localStorage.getItem('auth_redirect_message');
    if (message) {
        localStorage.removeItem('auth_redirect_message');
        showToast(message, 'warning', 4000);
    }
});

// Toast notification utility
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                    data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, { delay: duration });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function getOrCreateToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }
    return container;
}