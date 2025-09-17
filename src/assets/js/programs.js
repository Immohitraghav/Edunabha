@@ .. @@
-/* commit: feat(modal-preview-compact): populate compact two-column preview modal */
 document.addEventListener('DOMContentLoaded', () => {
+    // Render all courses
+    renderCourses();
+    
+    // Setup modal and search functionality
+    setupModal();
+    setupSearch();
+});
+
+function renderCourses() {
+    const courses = CourseManager.getAllCourses();
+    const programCards = document.getElementById('programCards');
+    const isAuthenticated = AuthGuard.isAuthenticated();
+    
+    programCards.innerHTML = courses.map(course => `
+        <div class="col-md-4">
+            <div class="card program-card h-100" data-title="${course.title}"
+                data-keywords="${course.keywords}"
+                data-desc="${course.description}"
+                data-link="${course.link}"
+                data-img="${course.image}"
+                data-course-id="${course.id}">
+                <img src="${course.image}" class="card-img-top" alt="${course.title}" 
+                     width="800" height="450" loading="lazy" decoding="async" />
+                <div class="card-body">
+                    <div class="d-flex align-items-center mb-2">
+                        <i class="${course.icon} fs-5 me-2 text-primary"></i>
+                        <h5 class="mb-0">${course.title}</h5>
+                    </div>
+                    <p class="card-text small text-muted mb-3">${course.description.substring(0, 100)}...</p>
+                    <div class="d-flex justify-content-between align-items-center mb-3">
+                        <span class="badge bg-light text-dark">${course.category}</span>
+                        <span class="badge bg-light text-dark">${course.level}</span>
+                    </div>
+                    <div class="d-flex gap-2">
+                        ${isAuthenticated ? 
+                            (CourseManager.isEnrolled(course.id) ? 
+                                `<a href="${course.link}" class="btn btn-success btn-sm flex-fill">
+                                    <i class="bi bi-play-circle"></i> Continue
+                                </a>` :
+                                `<button class="btn btn-gradient btn-sm flex-fill enroll-btn" data-course-id="${course.id}">
+                                    <i class="bi bi-plus-circle"></i> Enroll
+                                </button>`
+                            ) :
+                            `<button class="btn btn-outline-secondary btn-sm flex-fill" onclick="showLoginMessage()">
+                                <i class="bi bi-lock"></i> Login to Enroll
+                            </button>`
+                        }
+                        <button class="btn btn-outline-primary btn-sm preview-btn" data-course-id="${course.id}">
+                            <i class="bi bi-eye"></i>
+                        </button>
+                    </div>
+                </div>
+            </div>
+        </div>
+    `).join('');
+    
+    // Add event listeners for enroll buttons
+    if (isAuthenticated) {
+        programCards.querySelectorAll('.enroll-btn').forEach(btn => {
+            btn.addEventListener('click', (e) => {
+                e.stopPropagation();
+                const courseId = btn.dataset.courseId;
+                enrollInCourse(courseId, btn);
+            });
+        });
+    }
+    
+    // Add event listeners for preview buttons
+    programCards.querySelectorAll('.preview-btn').forEach(btn => {
+        btn.addEventListener('click', (e) => {
+            e.stopPropagation();
+            const courseId = btn.dataset.courseId;
+            showCoursePreview(courseId);
+        });
+    });
+}
+
+function setupModal() {
     const modalEl = document.getElementById('programPreviewModal');
-    const cards = document.querySelectorAll('.program-card');
-
-    if (modalEl && cards.length) {
+    if (modalEl) {
         const modal = new bootstrap.Modal(modalEl); // Bootstrap modal API
         const imgEl = document.getElementById('programPreviewImg');
         const titleEl = document.getElementById('programPreviewTitle');
         const descEl = document.getElementById('programPreviewDesc');
         const pointsEl = document.getElementById('programPreviewPoints');
         const openBtn = document.getElementById('programPreviewOpenBtn');
-
-        cards.forEach(card => {
-            card.addEventListener('click', (e) => {
-                // If "Explore" anchor is clicked, follow the link normally
-                if (e.target.closest('.open-page-btn')) return;
-
-                // Read dataset attributes (data-*) from the card
-                const { title, desc, img, link, keywords } = card.dataset;
-
-                titleEl.textContent = title || '';
-                descEl.textContent = desc || '';
-                imgEl.src = img || '';
-                imgEl.alt = title || 'Program preview image';
-                openBtn.href = link || '#';
-
-                // Build up to four quick bullet points from keywords
-                pointsEl.innerHTML = '';
-                if (keywords) {
-                    keywords.split(/\s+/).slice(0, 4).forEach(k => {
-                        const li = document.createElement('li');
-                        li.textContent = k.charAt(0).toUpperCase() + k.slice(1);
-                        pointsEl.appendChild(li);
-                    });
-                }
-
-                modal.show();
-            });
-        });
+        
+        window.showCoursePreview = (courseId) => {
+            const course = CourseManager.getCourseById(courseId);
+            if (!course) return;
+            
+            titleEl.textContent = course.title;
+            descEl.textContent = course.description;
+            imgEl.src = course.image;
+            imgEl.alt = course.title;
+            
+            // Show course features
+            pointsEl.innerHTML = course.features.map(feature => 
+                `<li>${feature}</li>`
+            ).join('');
+            
+            // Update open button
+            const isAuthenticated = AuthGuard.isAuthenticated();
+            if (isAuthenticated) {
+                openBtn.href = course.link;
+                openBtn.textContent = 'Explore Course';
+                openBtn.className = 'btn btn-learn';
+            } else {
+                openBtn.href = '#';
+                openBtn.textContent = 'Login to Access';
+                openBtn.className = 'btn btn-outline-secondary';
+                openBtn.onclick = showLoginMessage;
+            }
+            
+            modal.show();
+        };
     }
+}
 
-    /* commit: feat(program-filter): client-side filter using navbar search */
+function setupSearch() {
     const form = document.getElementById('programSearchForm');
     const input = document.getElementById('programSearchInput');
     const noResults = document.getElementById('noResults');
     const grid = document.getElementById('programCards');
 
     if (form && input && grid) {
         const filter = () => {
             const q = input.value.trim().toLowerCase();
             let visible = 0;
             grid.querySelectorAll('.program-card').forEach(card => {
                 const text = [
                     card.dataset.title || '',
                     card.dataset.keywords || '',
-                    card.querySelector('h5')?.textContent || ''
+                    card.dataset.desc || ''
                 ].join(' ').toLowerCase();
                 const show = !q || text.includes(q);
                 card.closest('.col-md-4').classList.toggle('d-none', !show);
                 if (show) visible += 1;
             });
             if (noResults) noResults.classList.toggle('d-none', visible !== 0);
         };
 
         // Filter on submit and on typing
         form.addEventListener('submit', (e) => { e.preventDefault(); filter(); });
         input.addEventListener('input', filter);
     }
-});
+}
+
+function enrollInCourse(courseId, buttonElement) {
+    const success = CourseManager.enrollInCourse(courseId);
+    if (success) {
+        showToast('Successfully enrolled in course!', 'success');
+        
+        // Update button
+        const course = CourseManager.getCourseById(courseId);
+        buttonElement.outerHTML = `
+            <a href="${course.link}" class="btn btn-success btn-sm flex-fill">
+                <i class="bi bi-play-circle"></i> Continue
+            </a>
+        `;
+    } else {
+        showToast('You are already enrolled in this course.', 'info');
+    }
+}
 
+function showLoginMessage() {
+    showToast('Login to explore more features and enroll in courses!', 'warning', 4000);
+    setTimeout(() => {
+        window.location.href = 'login.html';
+    }, 2000);
+}