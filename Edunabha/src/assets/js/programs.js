/* commit: feat(modal-preview-compact): populate compact two-column preview modal */
document.addEventListener('DOMContentLoaded', () => {
    const modalEl = document.getElementById('programPreviewModal');
    const cards = document.querySelectorAll('.program-card');

    if (modalEl && cards.length) {
        const modal = new bootstrap.Modal(modalEl); // Bootstrap modal API
        const imgEl = document.getElementById('programPreviewImg');
        const titleEl = document.getElementById('programPreviewTitle');
        const descEl = document.getElementById('programPreviewDesc');
        const pointsEl = document.getElementById('programPreviewPoints');
        const openBtn = document.getElementById('programPreviewOpenBtn');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // If "Explore" anchor is clicked, follow the link normally
                if (e.target.closest('.open-page-btn')) return;

                // Read dataset attributes (data-*) from the card
                const { title, desc, img, link, keywords } = card.dataset;

                titleEl.textContent = title || '';
                descEl.textContent = desc || '';
                imgEl.src = img || '';
                imgEl.alt = title || 'Program preview image';
                openBtn.href = link || '#';

                // Build up to four quick bullet points from keywords
                pointsEl.innerHTML = '';
                if (keywords) {
                    keywords.split(/\s+/).slice(0, 4).forEach(k => {
                        const li = document.createElement('li');
                        li.textContent = k.charAt(0).toUpperCase() + k.slice(1);
                        pointsEl.appendChild(li);
                    });
                }

                modal.show();
            });
        });
    }

    /* commit: feat(program-filter): client-side filter using navbar search */
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
                    card.querySelector('h5')?.textContent || ''
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
});
