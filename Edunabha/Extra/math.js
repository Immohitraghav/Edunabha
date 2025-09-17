// Helpers to convert a playlist URL or ID to an embeddable URL that plays inside the page
function toEmbedPlaylistSrc(input) {
    if (!input) return '';
    try {
        // If full URL, extract list param; else treat as ID
        let listId = '';
        if (/^https?:\/\//i.test(input)) {
            const url = new URL(input);
            listId = url.searchParams.get('list') || '';
        } else {
            listId = input;
        }
        if (!listId) return '';
        // Use YouTube embedded playlist format
        // Add parameters: autoplay=1, rel=0, modestbranding=1, controls=1
        // Note: rel=0 limits related videos to same channel; modestbranding has limited effect.
        return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(listId)}&autoplay=1&rel=0&modestbranding=1&controls=1`;
    } catch {
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const topicModalEl = document.getElementById('topicModal');
    const topicModal = topicModalEl ? bootstrap.Modal.getOrCreateInstance(topicModalEl) : null;

    const titleEl = document.getElementById('topicTitle');
    const descEl = document.getElementById('topicDesc');
    const imgEl = document.getElementById('topicImg');
    const watchBtn = document.getElementById('watchPlaylistBtn');
    const playerWrap = document.getElementById('playerContainer');
    const iframe = document.getElementById('playlistPlayer');

    let currentPlaylist = '';

    // Open topic preview on click of card or inner button
    document.querySelectorAll('.topic-trigger').forEach(card => {
        card.addEventListener('click', (e) => {
            // Allow inner button to trigger same behavior; no need to detect separately
            const title = card.querySelector('.card-title')?.textContent?.trim() || 'Topic';
            const desc = card.getAttribute('data-desc') || card.querySelector('.card-text')?.textContent?.trim() || '';
            const img = card.querySelector('img')?.src || '';
            const playlist = card.getAttribute('data-playlist') || '';

            titleEl.textContent = title;
            descEl.textContent = desc;
            imgEl.src = img;
            imgEl.alt = title;

            currentPlaylist = playlist;

            // Reset player on open
            iframe.src = '';
            playerWrap.classList.add('d-none');

            topicModal?.show();
        });
    });

    // Load and show the in-page playlist when requested
    watchBtn.addEventListener('click', () => {
        const embed = toEmbedPlaylistSrc(currentPlaylist);
        if (!embed) return;
        iframe.src = embed;
        playerWrap.classList.remove('d-none');
        // Optionally scroll the player into view inside the modal
        playerWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Stop playback and clear src on close
    topicModalEl?.addEventListener('hidden.bs.modal', () => {
        iframe.src = '';
        playerWrap.classList.add('d-none');
    });
});
