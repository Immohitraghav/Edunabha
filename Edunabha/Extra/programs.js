// Smoothly scroll to #programs from the hero CTA, respecting reduced motion
(() => {
    const cta = document.querySelector('.hero .cta-btn');
    const target = document.getElementById('programs');
    if (cta && target) {
        cta.addEventListener('click', (e) => {
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!reduce) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState({}, '', '#programs');
            }
        });
    }
})();

// Program Preview modal wiring
document.addEventListener('DOMContentLoaded', () => {
    const previewModalEl = document.getElementById('programPreviewModal');
    const previewModal = previewModalEl ? bootstrap.Modal.getOrCreateInstance(previewModalEl) : null;

    const titleEl = document.getElementById('programPreviewTitle');
    const descEl = document.getElementById('programPreviewDesc');
    const imgEl = document.getElementById('programPreviewImg');
    const openBtn = document.getElementById('programPreviewOpenBtn');

    // Clicking the card opens preview
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // If inner Explore button is clicked, don't open preview
            const isOpenPageBtn = e.target.closest('.open-page-btn');
            if (isOpenPageBtn) return;

            const title = card.getAttribute('data-title') || card.querySelector('h5')?.textContent?.trim() || 'Program';
            const desc = card.getAttribute('data-desc') || '';
            const link = card.getAttribute('data-link') || '#';
            const img = card.getAttribute('data-img') || card.querySelector('img')?.src || '';

            titleEl.textContent = title;
            descEl.textContent = desc;
            imgEl.src = img;
            imgEl.alt = title;
            openBtn.href = link;

            previewModal?.show();
        });
    });
});
