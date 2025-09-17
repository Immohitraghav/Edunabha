/* commit: feat(progress-filter): client-side search over title/keywords */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('progressSearchForm');
    const input = document.getElementById('progressSearchInput');
    const grid = document.getElementById('progressCards');
    const noResults = document.getElementById('noResults');

    const runFilter = () => {
        const q = (input.value || '').trim().toLowerCase();
        let visible = 0;
        grid.querySelectorAll('.progress-card').forEach(card => {
            const text = [
                card.dataset.title || '',
                card.dataset.keywords || '',
                card.querySelector('h5')?.textContent || ''
            ].join(' ').toLowerCase();
            const show = !q || text.includes(q);
            card.closest('.col-md-4').classList.toggle('d-none', !show);
            if (show) visible++;
        });
        noResults.classList.toggle('d-none', visible !== 0);
    };

    form?.addEventListener('submit', e => { e.preventDefault(); runFilter(); });
    input?.addEventListener('input', runFilter);
});
/* commit: feat(progress-animate): animate bars on first view and sync ARIA */
document.addEventListener('DOMContentLoaded', () => {
    const progressWrappers = document.querySelectorAll('#progress .progress');

    // Intersection observer triggers once per card
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const wrap = entry.target;
            const bar = wrap.querySelector('.progress-fill');
            const target = Number(bar?.dataset.target || 0);

            // Animate width and update ARIA values per guidance
            wrap.setAttribute('aria-valuenow', String(0));
            let current = 0;
            const step = () => {
                current = Math.min(target, current + Math.max(1, Math.round(target / 25)));
                bar.style.width = current + '%';
                wrap.setAttribute('aria-valuenow', String(current));
                if (current < target) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);

            io.unobserve(wrap);
        });
    }, { threshold: 0.35 });

    progressWrappers.forEach(w => io.observe(w));
});
