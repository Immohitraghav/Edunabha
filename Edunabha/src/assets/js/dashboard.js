/* Dashboard functionality */
(() => {
    'use strict';

    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('edunabha_user') || '{}');
    
    if (!userData.username) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // DOM elements
    const welcomeText = document.getElementById('welcomeText');
    const dashboardTitle = document.getElementById('dashboardTitle');
    const dashboardSubtitle = document.getElementById('dashboardSubtitle');
    const currentDate = document.getElementById('currentDate');
    const profileName = document.getElementById('profileName');
    const profileType = document.getElementById('profileType');
    const profileEmail = document.getElementById('profileEmail');
    const totalCourses = document.getElementById('totalCourses');
    const completedCourses = document.getElementById('completedCourses');
    const totalHours = document.getElementById('totalHours');
    const enrolledCourses = document.getElementById('enrolledCourses');
    const logoutBtn = document.getElementById('logoutBtn');
    const overallProgress = document.getElementById('overallProgress');

    // Sample course data
    const sampleCourses = [
        {
            id: 1,
            title: 'Math Foundations',
            progress: 75,
            totalLessons: 20,
            completedLessons: 15,
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
            link: 'sub-pages/math.html'
        },
        {
            id: 2,
            title: 'Python Programming',
            progress: 45,
            totalLessons: 25,
            completedLessons: 11,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
            link: 'content-pages/python.html'
        },
        {
            id: 3,
            title: 'Digital Skills',
            progress: 90,
            totalLessons: 15,
            completedLessons: 14,
            image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80',
            link: 'digital.html'
        },
        {
            id: 4,
            title: 'Science Explorer',
            progress: 30,
            totalLessons: 18,
            completedLessons: 5,
            image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=400&q=80',
            link: 'science.html'
        }
    ];

    // Initialize dashboard
    function initDashboard() {
        updateUserInfo();
        updateDate();
        updateStats();
        renderCourses();
        animateProgress();
        setupEventListeners();
    }

    // Update user information
    function updateUserInfo() {
        const name = userData.username || 'User';
        const type = userData.userType || 'student';
        const email = userData.email || '';

        welcomeText.textContent = `Welcome, ${name}!`;
        dashboardTitle.textContent = `${name}'s Dashboard`;
        dashboardSubtitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Learning Portal`;
        profileName.textContent = name;
        profileType.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
        profileEmail.textContent = email;

        // Show new user welcome message
        if (userData.isNewUser) {
            showWelcomeMessage();
            // Remove the flag after showing
            delete userData.isNewUser;
            localStorage.setItem('edunabha_user', JSON.stringify(userData));
        }
    }

    // Update current date
    function updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // Update statistics
    function updateStats() {
        const total = sampleCourses.length;
        const completed = sampleCourses.filter(course => course.progress === 100).length;
        const hours = Math.floor(Math.random() * 50) + 20; // Simulated hours

        totalCourses.textContent = total;
        completedCourses.textContent = completed;
        totalHours.textContent = hours;
    }

    // Render enrolled courses
    function renderCourses() {
        enrolledCourses.innerHTML = '';
        
        sampleCourses.forEach(course => {
            const courseCard = createCourseCard(course);
            enrolledCourses.appendChild(courseCard);
        });
    }

    // Create course card element
    function createCourseCard(course) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        
        col.innerHTML = `
            <a href="${course.link}" class="course-card">
                <div class="d-flex align-items-center mb-3">
                    <img src="${course.image}" alt="${course.title}" 
                         class="rounded me-3" width="50" height="50" 
                         style="object-fit: cover;">
                    <div>
                        <h6 class="mb-1 fw-semibold">${course.title}</h6>
                        <small class="text-muted">${course.completedLessons}/${course.totalLessons} lessons</small>
                    </div>
                </div>
                <div class="course-progress">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small fw-semibold">Progress</span>
                        <span class="small text-muted">${course.progress}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${course.progress}%" 
                             aria-valuenow="${course.progress}" 
                             aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </a>
        `;
        
        return col;
    }

    // Animate progress bars
    function animateProgress() {
        const progressBars = document.querySelectorAll('.progress-fill[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const target = parseInt(bar.dataset.target);
                    
                    setTimeout(() => {
                        bar.style.width = target + '%';
                        bar.setAttribute('aria-valuenow', target);
                    }, 300);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }

    // Setup event listeners
    function setupEventListeners() {
        // Logout functionality
        logoutBtn.addEventListener('click', handleLogout);
        
        // Profile edit functionality
        const saveProfile = document.getElementById('saveProfile');
        const editName = document.getElementById('editName');
        const editEmail = document.getElementById('editEmail');
        const editClass = document.getElementById('editClass');
        const editClassField = document.getElementById('editClassField');
        
        // Populate edit form
        editName.value = userData.username || '';
        editEmail.value = userData.email || '';
        
        // Show/hide class field based on user type
        if (userData.userType === 'admin') {
            editClassField.style.display = 'none';
        }
        
        saveProfile.addEventListener('click', () => {
            // Update user data
            userData.username = editName.value;
            userData.email = editEmail.value;
            if (userData.userType === 'student') {
                userData.class = editClass.value;
            }
            
            localStorage.setItem('edunabha_user', JSON.stringify(userData));
            
            // Update UI
            updateUserInfo();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
            modal.hide();
            
            // Show success message
            showToast('Profile updated successfully!', 'success');
        });
    }

    // Handle logout
    function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('edunabha_user');
            window.location.href = 'login.html';
        }
    }

    // Show welcome message for new users
    function showWelcomeMessage() {
        setTimeout(() => {
            showToast(`Welcome to EduNabha, ${userData.username}! Start exploring courses to begin your learning journey.`, 'info', 5000);
        }, 1000);
    }

    // Show toast notification
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
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Get or create toast container
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

    // Initialize dashboard when DOM is loaded
    document.addEventListener('DOMContentLoaded', initDashboard);
})();