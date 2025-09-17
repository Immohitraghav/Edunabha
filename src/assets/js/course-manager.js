// Course management utility
class CourseManager {
    static courses = [
        {
            id: 'math-foundations',
            title: 'Math Foundations',
            description: 'Master essential mathematical concepts including algebra, geometry, and problem-solving techniques.',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-calculator',
            category: 'Mathematics',
            level: 'Beginner',
            duration: '8 weeks',
            lessons: 24,
            keywords: 'math arithmetic algebra geometry trigonometry',
            features: ['Interactive exercises', 'Step-by-step solutions', 'Practice tests'],
            link: 'sub-pages/math.html'
        },
        {
            id: 'science-explorer',
            title: 'Science Explorer',
            description: 'Discover the wonders of physics, chemistry, and biology through engaging experiments and real-world applications.',
            image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-flask',
            category: 'Science',
            level: 'Intermediate',
            duration: '10 weeks',
            lessons: 30,
            keywords: 'science physics chemistry biology experiments',
            features: ['Virtual labs', 'Interactive simulations', 'Real-world projects'],
            link: 'science.html'
        },
        {
            id: 'coding-basics',
            title: 'Coding Basics',
            description: 'Learn programming fundamentals with Python, JavaScript, and web development technologies.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-code-slash',
            category: 'Technology',
            level: 'Beginner',
            duration: '12 weeks',
            lessons: 36,
            keywords: 'coding python javascript html css programming',
            features: ['Hands-on projects', 'Code playground', 'Portfolio building'],
            link: 'sub-pages/coding.html'
        },
        {
            id: 'digital-skills',
            title: 'Digital Skills',
            description: 'Develop essential digital literacy skills including web basics, cyber safety, and AI fundamentals.',
            image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-laptop',
            category: 'Technology',
            level: 'Beginner',
            duration: '6 weeks',
            lessons: 18,
            keywords: 'digital literacy computer internet safety ai',
            features: ['Practical skills', 'Safety guidelines', 'Future-ready content'],
            link: 'digital.html'
        },
        {
            id: 'english-essentials',
            title: 'English Essentials',
            description: 'Improve your English language skills with grammar, vocabulary, writing, and speaking practice.',
            image: 'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-book',
            category: 'Language',
            level: 'Intermediate',
            duration: '8 weeks',
            lessons: 24,
            keywords: 'english grammar vocabulary writing speaking',
            features: ['Speaking practice', 'Writing workshops', 'Grammar games'],
            link: 'english.html'
        },
        {
            id: 'life-skills',
            title: 'Life Skills',
            description: 'Build essential life skills including time management, financial literacy, and communication.',
            image: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80',
            icon: 'bi-person-check',
            category: 'Personal Development',
            level: 'All Levels',
            duration: '6 weeks',
            lessons: 18,
            keywords: 'life skills time management finance communication',
            features: ['Practical exercises', 'Real-world scenarios', 'Personal growth'],
            link: 'life-skills.html'
        }
    ];

    static getAllCourses() {
        return this.courses;
    }

    static getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    static searchCourses(query) {
        if (!query) return this.courses;
        
        const searchTerm = query.toLowerCase();
        return this.courses.filter(course => 
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.keywords.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm)
        );
    }

    static getEnrolledCourses() {
        const enrolled = localStorage.getItem('enrolled_courses');
        return enrolled ? JSON.parse(enrolled) : [];
    }

    static enrollInCourse(courseId) {
        const enrolled = this.getEnrolledCourses();
        if (!enrolled.includes(courseId)) {
            enrolled.push(courseId);
            localStorage.setItem('enrolled_courses', JSON.stringify(enrolled));
            
            // Initialize progress
            const progress = this.getCourseProgress();
            if (!progress[courseId]) {
                progress[courseId] = {
                    completedLessons: 0,
                    totalLessons: this.getCourseById(courseId)?.lessons || 0,
                    progress: 0,
                    enrolledDate: new Date().toISOString()
                };
                localStorage.setItem('course_progress', JSON.stringify(progress));
            }
            
            return true;
        }
        return false;
    }

    static isEnrolled(courseId) {
        return this.getEnrolledCourses().includes(courseId);
    }

    static getCourseProgress() {
        const progress = localStorage.getItem('course_progress');
        return progress ? JSON.parse(progress) : {};
    }

    static updateCourseProgress(courseId, completedLessons) {
        const progress = this.getCourseProgress();
        const course = this.getCourseById(courseId);
        
        if (course && progress[courseId]) {
            progress[courseId].completedLessons = completedLessons;
            progress[courseId].progress = Math.round((completedLessons / course.lessons) * 100);
            localStorage.setItem('course_progress', JSON.stringify(progress));
        }
    }

    static getRecommendedCourses(limit = 3) {
        const enrolled = this.getEnrolledCourses();
        const available = this.courses.filter(course => !enrolled.includes(course.id));
        
        // Simple recommendation: return random available courses
        const shuffled = available.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    }
}