(() => {
    // Smooth scroll for CTA respecting reduced motion
    const cta = document.querySelector('.hero .cta-btn');
    const target = document.getElementById('progress');
    if (cta && target) {
        cta.addEventListener('click', (e) => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reduce) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState({}, '', '#progress');
            }
        });
    }

    // In-page course filter with deep-linking ?q=
    const qs = (sel, el = document) => el.querySelector(sel);
    const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));
    const form = qs('#progressSearchForm');
    const input = qs('#progressSearchInput');
    const cards = qsa('#progressCards .progress-card');
    const noResults = qs('#noResults');

    const debounce = (fn, delay = 180) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
    };

    const filter = (query) => {
        const q = query.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
            const title = (card.dataset.title || '').toLowerCase();
            const keywords = (card.dataset.keywords || '').toLowerCase();
            const match = !q || title.includes(q) || keywords.includes(q);
            card.classList.toggle('d-none', !match);
            if (match) visible += 1;
        });
        noResults.classList.toggle('d-none', visible !== 0);
    };

    const setQuery = (q) => {
        const url = new URL(location.href);
        if (q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');
        history.replaceState({}, '', url.toString());
    };

    const initFromURL = () => {
        const q = new URL(location.href).searchParams.get('q') || '';
        if (input) input.value = q;
        filter(q);
    };

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = input?.value || '';
        setQuery(q);
        filter(q);
    });

    input?.addEventListener('input', debounce((e) => {
        const q = e.target.value || '';
        setQuery(q);
        filter(q);
    }, 150));

    initFromURL();
})();
