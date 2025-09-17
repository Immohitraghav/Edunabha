// Constants: provided playlist (ID parsed from the provided example URL)
const PLAYLIST_ID = 'PLu0W_9lII9agwh1XjRt242xIpHhPT2llg'; // YouTube playlist stays embedded in-page

// Render a curated list (first 10+) from the playlist; leave space for the rest
// Titles map to well-known items in the series; IDs are used for in-page playback
const curatedVideos = [
    { id: '7wnove7K-ZQ', title: 'Day 1 — Introduction to Programming & Python', sub: 'Getting started, mindset, and course tour' },
    { id: 'Tto8TS-fJQU', title: 'Day 2 — The Power of Python', sub: 'Small, amazing Python programs' },
    { id: 'xwKO_y2gHxQ', title: 'Day 3 — Modules and Pip', sub: 'Packages, installs, and environment basics' },
    { id: '7IWOYhfAcVg', title: 'Day 4 — Our First Python Program', sub: 'Writing and running scripts' },
    { id: 'qxPMmW93eDs', title: 'Day 5 — Comments & Print', sub: 'Escapes and formatting' },
    { id: 'FLVqcxnJP_E', title: 'Day 7 — Exercise 1: Calculator', sub: 'Project brief and structure' },
    { id: 'eF6nK5bSlmg', title: 'Day 22 — Introduction to Lists', sub: 'Lists, indexing, and basics' },
    { id: 'UrsmFxEIp5k', title: 'Day 40 — Secret Code Language', sub: 'Fun string logic and patterns' },
    { id: 'uUbvJ7ZEhPE', title: 'Day 76 — Exercise 8: Merge the PDF', sub: 'Project setup and goals' },
    { id: 'xwKO_y2gHxQ', title: 'Modules & Pip (Recap)', sub: 'Extra practice on installs and modules' }
];

// Utility to build a YouTube embed for a single video while keeping playlist context
function videoSrc(videoId, playlistId, index = 0) {
    const base = 'https://www.youtube.com/embed/';
    // Keep playlist context so the player remains in-page and related videos are constrained
    return `${base}${encodeURIComponent(videoId)}?list=${encodeURIComponent(playlistId)}&index=${index}&rel=0&modestbranding=1&autoplay=1&controls=1`;
}

// Utility to build a playlist embed (shows the playlist UI inside the iframe)
function playlistSrc(playlistId) {
    return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&rel=0&modestbranding=1&controls=1`;
}

// Populate the left list with curated items
function renderVideoList() {
    const list = document.getElementById('videoList');
    list.innerHTML = '';
    curatedVideos.forEach((v, i) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.setAttribute('tabindex', '0');
        li.dataset.videoId = v.id;
        li.dataset.index = String(i);

        // YouTube thumbnail pattern
        const thumbUrl = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;

        li.innerHTML = `
      <img class="thumb" src="${thumbUrl}" alt="Thumbnail: ${v.title}">
      <div class="meta">
        <span class="title">${v.title}</span>
        <span class="sub">${v.sub}</span>
      </div>
    `;

        li.addEventListener('click', () => playVideoAt(i));
        li.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playVideoAt(i);
            }
        });

        list.appendChild(li);
    });
}

// Set active item in list
function setActive(index) {
    const items = document.querySelectorAll('#videoList .list-group-item');
    items.forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

// Play a specific curated video on the right iframe
function playVideoAt(index) {
    const frame = document.getElementById('playerFrame');
    const item = curatedVideos[index];
    if (!item) return;
    frame.src = videoSrc(item.id, PLAYLIST_ID, index);
    setActive(index);
}

// “Show more” button: load the native playlist UI in the iframe
function wireShowAll() {
    const btn = document.getElementById('showAllBtn');
    const frame = document.getElementById('playerFrame');
    btn.addEventListener('click', () => {
        frame.src = playlistSrc(PLAYLIST_ID);
    });
}

// Smooth scroll helper respecting reduced motion
function smoothScrollTo(el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

// Course Preview modal wiring
function wireCoursePreviews() {
    const modalEl = document.getElementById('courseModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    const imgEl = document.getElementById('courseImg');
    const titleEl = document.getElementById('courseTitle');
    const descEl = document.getElementById('courseDesc');
    const watchBtn = document.getElementById('watchFromModal');

    let pendingVideoId = '';

    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.title || 'Course';
            const img = btn.dataset.img || '';
            const desc = btn.dataset.desc || '';
            const vid = btn.dataset.videoid || '';

            titleEl.textContent = title;
            descEl.textContent = desc;
            imgEl.src = img;
            imgEl.alt = title;
            pendingVideoId = vid;

            modal.show();
        });
    });

    // When "Watch Playlist" is clicked, focus the viewer and (optionally) load the mapped video
    watchBtn.addEventListener('click', () => {
        const playlistSection = document.getElementById('playlist');
        const frame = document.getElementById('playerFrame');

        if (pendingVideoId) {
            // If a video is mapped, play it in context
            frame.src = videoSrc(pendingVideoId, PLAYLIST_ID, 0);
            // Highlight the corresponding item if present
            const index = curatedVideos.findIndex(v => v.id === pendingVideoId);
            if (index >= 0) setActive(index);
        } else {
            // Otherwise show the whole playlist
            frame.src = playlistSrc(PLAYLIST_ID);
        }

        modal.hide();
        // Scroll to the viewer
        smoothScrollTo(playlistSection);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderVideoList();
    wireShowAll();
    wireCoursePreviews();

    // Default selection: first item
    playVideoAt(0);
});
