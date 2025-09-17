(() => {
    // Smooth scroll to feedback CTA, respecting reduced motion
    const cta = document.getElementById('feedbackCta');
    const feedback = document.getElementById('feedback');
    if (cta && feedback) {
        cta.addEventListener('click', (e) => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reduce) {
                e.preventDefault();
                feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState({}, '', '#feedback');
            }
        });
    }

    // Bootstrap validation pattern
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
})();
