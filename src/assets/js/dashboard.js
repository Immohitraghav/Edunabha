@@ .. @@
 /* Dashboard functionality */
 (() => {
     'use strict';
 
-    // Check if user is logged in
-    const userData = JSON.parse(localStorage.getItem('edunabha_user') || '{}');
-    
-    if (!userData.username) {
-        // Redirect to login if not authenticated
-        window.location.href = 'login.html';
+    // Require authentication
+    if (!AuthGuard.requireAuth()) {
         return;
     }
 
+    const userData = AuthGuard.getUserData();
+
     // DOM elements
     const welcomeText = document.getElementById('welcomeText');
     const dashboardTitle = document.getElementById('dashboardTitle');
@@ .. @@
     const totalHours = document.getElementById('totalHours');
     const enrolledCourses = document.getElementById('enrolledCourses');
     const logoutBtn = document.getElementById('logoutBtn');
     const overallProgress = document.getElementById('overallProgress');
+    const enrolledCount = document.getElementById('enrolledCount');
+    const noCourses = document.getElementById('noCourses');
+    const recommendedCourses = document.getElementById('recommendedCourses');
+    const continueLearning = document.getElementById('continuelearning');
 
-    // Sample course data
-    const sampleCourses = [
-        {
-            id: 1,
-            title: 'Math Foundations',
-            progress: 75,
-            totalLessons: 20,
-            completedLessons: 15,
-            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80',
-            link: 'sub-pages/math.html'
-        },
-        {
-            id: 2,
-            title: 'Python Programming',
-            progress: 45,
-            totalLessons: 25,
-            completedLessons: 11,
-            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
-            link: 'content-pages/python.html'
-        },
-        {
-            id: 3,
-            title: 'Digital Skills',
-            progress: 90,
-            totalLessons: 15,
-            completedLessons: 14,
-            image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=400&q=80',
-            link: 'digital.html'
-        },
-        {
-            id: 4,
-            title: 'Science Explorer',
-            progress: 30,
-            totalLessons: 18,
-            completedLessons: 5,
-            image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=400&q=80',
-            link: 'science.html'
-        }
-    ];
-
     // Initialize dashboard
     function initDashboard() {
         updateUserInfo();
         updateDate();
         updateStats();
         renderCourses();
+        renderRecommendedCourses();
+        renderContinueLearning();
         animateProgress();
         setupEventListeners();
     }
@@ .. @@
     function updateUserInfo() {
         const name = userData.username || 'User';
         const type = userData.userType || 'student';
         const email = userData.email || '';
 
         welcomeText.textContent = `Welcome, ${name}!`;
-        dashboardTitle.textContent = `${name}'s Dashboard`;
-        dashboardSubtitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Learning Portal`;
+        dashboardTitle.textContent = `Welcome back, ${name}!`;
+        dashboardSubtitle.textContent = `Ready to continue your learning journey?`;
         profileName.textContent = name;
         profileType.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
         profileEmail.textContent = email;
@@ .. @@
 
     // Update statistics
     function updateStats() {
-        const total = sampleCourses.length;
-        const completed = sampleCourses.filter(course => course.progress === 100).length;
+        const enrolledCourseIds = CourseManager.getEnrolledCourses();
+        const progress = CourseManager.getCourseProgress();
+        
+        const total = enrolledCourseIds.length;
+        const completed = enrolledCourseIds.filter(id => progress[id]?.progress === 100).length;
         const hours = Math.floor(Math.random() * 50) + 20; // Simulated hours
 
         totalCourses.textContent = total;
         completedCourses.textContent = completed;
         totalHours.textContent = hours;
+        enrolledCount.textContent = total;
     }
 
     // Render enrolled courses
     function renderCourses() {
+        const enrolledCourseIds = CourseManager.getEnrolledCourses();
+        const progress = CourseManager.getCourseProgress();
+        
         enrolledCourses.innerHTML = '';
         
-        sampleCourses.forEach(course => {
-            const courseCard = createCourseCard(course);
-            enrolledCourses.appendChild(courseCard);
-        });
+        if (enrolledCourseIds.length === 0) {
+            noCourses.classList.remove('d-none');
+            return;
+        }
+        
+        noCourses.classList.add('d-none');
+        
+        enrolledCourseIds.forEach(courseId => {
+            const course = CourseManager.getCourseById(courseId);
+            const courseProgress = progress[courseId] || { progress: 0, completedLessons: 0 };
+            
+            if (course) {
+                const courseCard = createCourseCard(course, courseProgress);
+                enrolledCourses.appendChild(courseCard);
+            }
+        });
     }
 
     // Create course card element
-    function createCourseCard(course) {
+    function createCourseCard(course, progress = { progress: 0, completedLessons: 0 }) {
         const col = document.createElement('div');
-        col.className = 'col-md-6 col-lg-3';
+        col.className = 'col-md-6 col-lg-4';
         
         col.innerHTML = `
-            <a href="${course.link}" class="course-card">
-                <div class="d-flex align-items-center mb-3">
-                    <img src="${course.image}" alt="${course.title}" 
-                         class="rounded me-3" width="50" height="50" 
-                         style="object-fit: cover;">
-                    <div>
-                        <h6 class="mb-1 fw-semibold">${course.title}</h6>
-                        <small class="text-muted">${course.completedLessons}/${course.totalLessons} lessons</small>
+            <a href="${course.link}" class="course-card-modern">
+                <img src="${course.image}" alt="${course.title}" class="course-image w-100">
+                <div class="p-3">
+                    <div class="d-flex align-items-center mb-2">
+                        <i class="${course.icon} fs-5 me-2" style="background: var(--gradient-primary); -webkit-background-clip: text; background-clip: text; color: transparent;"></i>
+                        <h6 class="mb-0 fw-semibold">${course.title}</h6>
                     </div>
-                </div>
-                <div class="course-progress">
-                    <div class="d-flex justify-content-between align-items-center mb-2">
-                        <span class="small fw-semibold">Progress</span>
-                        <span class="small text-muted">${course.progress}%</span>
+                    <p class="small text-muted mb-2">${progress.completedLessons}/${course.lessons} lessons</p>
+                    <div class="course-progress-modern mb-2">
+                        <div class="progress-bar" style="width: ${progress.progress}%"></div>
                     </div>
-                    <div class="progress">
-                        <div class="progress-bar" role="progressbar" 
-                             style="width: ${course.progress}%" 
-                             aria-valuenow="${course.progress}" 
-                             aria-valuemin="0" aria-valuemax="100">
-                        </div>
+                    <div class="d-flex justify-content-between align-items-center">
+                        <span class="small fw-semibold">${progress.progress}% Complete</span>
+                        <span class="badge bg-light text-dark">${course.level}</span>
                     </div>
                 </div>
             </a>
@@ .. @@
         return col;
     }
 
+    // Render recommended courses
+    function renderRecommendedCourses() {
+        const recommended = CourseManager.getRecommendedCourses(3);
+        
+        recommendedCourses.innerHTML = recommended.map(course => `
+            <div class="col-md-4">
+                <div class="course-card-modern">
+                    <img src="${course.image}" alt="${course.title}" class="course-image w-100">
+                    <div class="p-3">
+                        <div class="d-flex align-items-center mb-2">
+                            <i class="${course.icon} fs-5 me-2" style="background: var(--gradient-primary); -webkit-background-clip: text; background-clip: text; color: transparent;"></i>
+                            <h6 class="mb-0 fw-semibold">${course.title}</h6>
+                        </div>
+                        <p class="small text-muted mb-2">${course.description.substring(0, 80)}...</p>
+                        <div class="d-flex justify-content-between align-items-center">
+                            <span class="badge bg-light text-dark">${course.category}</span>
+                            <button class="btn btn-sm btn-gradient enroll-btn" data-course-id="${course.id}">
+                                Enroll
+                            </button>
+                        </div>
+                    </div>
+                </div>
+            </div>
+        `).join('');
+        
+        // Add enroll handlers
+        recommendedCourses.querySelectorAll('.enroll-btn').forEach(btn => {
+            btn.addEventListener('click', (e) => {
+                e.preventDefault();
+                const courseId = btn.dataset.courseId;
+                enrollInCourse(courseId);
+            });
+        });
+    }
+
+    // Render continue learning section
+    function renderContinueLearning() {
+        const enrolledCourseIds = CourseManager.getEnrolledCourses();
+        const progress = CourseManager.getCourseProgress();
+        
+        // Get courses with progress < 100%
+        const inProgress = enrolledCourseIds
+            .filter(id => progress[id]?.progress < 100)
+            .slice(0, 3);
+        
+        if (inProgress.length === 0) {
+            continueLearning.innerHTML = `
+                <div class="col-12 text-center py-4">
+                    <i class="bi bi-check-circle fs-1 text-success mb-3"></i>
+                    <h6>All caught up!</h6>
+                    <p class="text-muted">You've completed all your enrolled courses.</p>
+                </div>
+            `;
+            return;
+        }
+        
+        continueLearning.innerHTML = inProgress.map(courseId => {
+            const course = CourseManager.getCourseById(courseId);
+            const courseProgress = progress[courseId];
+            
+            return `
+                <div class="col-md-4">
+                    <a href="${course.link}" class="course-card-modern">
+                        <img src="${course.image}" alt="${course.title}" class="course-image w-100">
+                        <div class="p-3">
+                            <div class="d-flex align-items-center mb-2">
+                                <i class="${course.icon} fs-5 me-2" style="background: var(--gradient-primary); -webkit-background-clip: text; background-clip: text; color: transparent;"></i>
+                                <h6 class="mb-0 fw-semibold">${course.title}</h6>
+                            </div>
+                            <p class="small text-muted mb-2">${courseProgress.completedLessons}/${course.lessons} lessons</p>
+                            <div class="course-progress-modern mb-2">
+                                <div class="progress-bar" style="width: ${courseProgress.progress}%"></div>
+                            </div>
+                            <div class="d-flex justify-content-between align-items-center">
+                                <span class="small fw-semibold">${courseProgress.progress}% Complete</span>
+                                <span class="badge bg-primary">Continue</span>
+                            </div>
+                        </div>
+                    </a>
+                </div>
+            `;
+        }).join('');
+    }
+
+    // Enroll in course
+    function enrollInCourse(courseId) {
+        const success = CourseManager.enrollInCourse(courseId);
+        if (success) {
+            showToast('Successfully enrolled in course!', 'success');
+            updateStats();
+            renderCourses();
+            renderRecommendedCourses();
+            renderContinueLearning();
+        } else {
+            showToast('You are already enrolled in this course.', 'info');
+        }
+    }
+
     // Animate progress bars
     function animateProgress() {
-        const progressBars = document.querySelectorAll('.progress-fill[data-target]');
+        const progressBars = document.querySelectorAll('.modern-progress .progress-bar[data-target]');
         
         const observer = new IntersectionObserver((entries) => {
             entries.forEach(entry => {
@@ .. @@
 
     // Handle logout
     function handleLogout() {
         if (confirm('Are you sure you want to logout?')) {
-            localStorage.removeItem('edunabha_user');
-            window.location.href = 'login.html';
+            AuthGuard.logout();
         }
     }
 
@@ .. @@
         }, 1000);
     }
 
-    // Show toast notification
-    function showToast(message, type = 'info', duration = 3000) {
-        const toastContainer = getOrCreateToastContainer();
-        
-        const toast = document.createElement('div');
-        toast.className = `toast align-items-center text-bg-${type} border-0`;
-        toast.setAttribute('role', 'alert');
-        toast.setAttribute('aria-live', 'assertive');
-        toast.setAttribute('aria-atomic', 'true');
-        
-        toast.innerHTML = `
-            <div class="d-flex">
-                <div class="toast-body">
-                    ${message}
-                </div>
-                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
-                        data-bs-dismiss="toast" aria-label="Close"></button>
-            </div>
-        `;
-        
-        toastContainer.appendChild(toast);
-        
-        const bsToast = new bootstrap.Toast(toast, { delay: duration });
-        bsToast.show();
-        
-        // Remove toast element after it's hidden
-        toast.addEventListener('hidden.bs.toast', () => {
-            toast.remove();
-        });
-    }
-
-    // Get or create toast container
-    function getOrCreateToastContainer() {
-        let container = document.getElementById('toastContainer');
-        if (!container) {
-            container = document.createElement('div');
-            container.id = 'toastContainer';
-            container.className = 'toast-container position-fixed top-0 end-0 p-3';
-            container.style.zIndex = '1055';
-            document.body.appendChild(container);
-        }
-        return container;
-    }
-
     // Initialize dashboard when DOM is loaded
     document.addEventListener('DOMContentLoaded', initDashboard);
 })();