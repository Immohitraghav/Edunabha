// Advanced search functionality
class SearchManager {
    constructor(containerId, inputId, resultsId) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.results = document.getElementById(resultsId);
        this.isVisible = false;
        
        this.init();
    }

    init() {
        if (!this.input || !this.results) return;

        // Create search results container
        this.results.className = 'search-results position-absolute w-100 bg-white border rounded-3 shadow-lg d-none';
        this.results.style.top = '100%';
        this.results.style.zIndex = '1050';
        this.results.style.maxHeight = '400px';
        this.results.style.overflowY = 'auto';

        // Add search input styling
        this.input.parentElement.classList.add('position-relative');

        // Event listeners
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.container?.contains(e.target)) {
                this.hideResults();
            }
        });
    }

    handleInput(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        this.showResults(query);
    }

    handleFocus(e) {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            this.showResults(query);
        }
    }

    handleBlur(e) {
        // Delay hiding to allow clicks on results
        setTimeout(() => {
            if (!this.results.matches(':hover')) {
                this.hideResults();
            }
        }, 150);
    }

    showResults(query) {
        const courses = CourseManager.searchCourses(query);
        
        if (courses.length === 0) {
            this.results.innerHTML = `
                <div class="p-3 text-center text-muted">
                    <i class="bi bi-search fs-4 d-block mb-2"></i>
                    No courses found for "${query}"
                </div>
            `;
        } else {
            this.results.innerHTML = courses.map(course => `
                <div class="search-result-item p-3 border-bottom cursor-pointer" data-course-id="${course.id}">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <img src="${course.image}" alt="${course.title}" 
                                 class="rounded" width="50" height="50" style="object-fit: cover;">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-semibold">${course.title}</h6>
                            <p class="mb-1 small text-muted">${course.description.substring(0, 80)}...</p>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge bg-light text-dark">${course.category}</span>
                                <span class="badge bg-light text-dark">${course.level}</span>
                            </div>
                        </div>
                        <div class="ms-2">
                            <i class="bi bi-arrow-right text-muted"></i>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            this.results.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const courseId = item.dataset.courseId;
                    this.handleResultClick(courseId);
                });
            });
        }

        this.results.classList.remove('d-none');
        this.isVisible = true;
    }

    hideResults() {
        this.results.classList.add('d-none');
        this.isVisible = false;
    }

    handleResultClick(courseId) {
        const course = CourseManager.getCourseById(courseId);
        if (course) {
            // Clear search
            this.input.value = '';
            this.hideResults();
            
            // Navigate to course
            window.location.href = course.link;
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize search on programs page
    if (document.getElementById('programSearchForm')) {
        new SearchManager('programSearchForm', 'programSearchInput', 'searchResults');
    }
});