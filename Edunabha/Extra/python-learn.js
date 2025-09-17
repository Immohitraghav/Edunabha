// Playlist constants
const PLAYLIST_ID = 'PLu0W_9lII9agwh1XjRt242xIpHhPT2llg';

// Curated list (expand anytime)
const curatedVideos = [
    { id: '7wnove7K-ZQ', title: 'Day 1 — Introduction to Programming & Python', sub: 'Course tour and setup' },
    { id: 'Tto8TS-fJQU', title: 'Day 2 — The Power of Python', sub: 'Small, amazing Python programs' },
    { id: 'xwKO_y2gHxQ', title: 'Day 3 — Modules and Pip', sub: 'Packages and environments' },
    { id: '7IWOYhfAcVg', title: 'Day 4 — Our First Python Program', sub: 'Writing and running scripts' },
    { id: 'qxPMmW93eDs', title: 'Day 5 — Comments & Print', sub: 'Formatting and escapes' },
    { id: 'FLVqcxnJP_E', title: 'Day 7 — Exercise: Calculator', sub: 'Project structure and logic' },
    { id: 'eF6nK5bSlmg', title: 'Day 22 — Lists Intro', sub: 'Sequences and methods' },
    { id: 'UrsmFxEIp5k', title: 'Day 40 — Secret Code Language', sub: 'Fun string logic' },
    { id: 'uUbvJ7ZEhPE', title: 'Day 76 — Exercise: Merge PDF', sub: 'File processing project' },
    { id: 'xwKO_y2gHxQ', title: 'Modules & Pip (Recap)', sub: 'Extra practice' }
];

// Build a video embed; add autoplay=1 only on user-triggered play
function videoSrc(videoId, playlistId, index = 0, autoplay = false) {
    const base = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
    const params = new URLSearchParams({
        list: playlistId,
        index: String(index),
        rel: '0',
        modestbranding: '1',
        controls: '1'
    });
    if (autoplay) params.set('autoplay', '1');
    return `${base}?${params.toString()}`;
}

// Build full playlist UI in the iframe (no autoplay by default)
function playlistSrc(playlistId) {
    const base = 'https://www.youtube.com/embed/videoseries';
    const params = new URLSearchParams({
        list: playlistId,
        rel: '0',
        modestbranding: '1',
        controls: '1'
    });
    return `${base}?${params.toString()}`;
}

function renderVideoList() {
    const list = document.getElementById('videoList');
    list.innerHTML = '';
    curatedVideos.forEach((v, i) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.tabIndex = 0;
        li.dataset.videoId = v.id;
        li.dataset.index = String(i);

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

function setActive(index) {
    document.querySelectorAll('#videoList .list-group-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

function playVideoAt(index) {
    const frame = document.getElementById('playerFrame');
    const placeholder = document.getElementById('playerPlaceholder');
    const item = curatedVideos[index];
    if (!item) return;

    // Autoplay only because this was a click/keypress (user gesture)
    frame.src = videoSrc(item.id, PLAYLIST_ID, index, /*autoplay*/ true);
    placeholder?.classList.add('d-none');
    setActive(index);
}

function wireShowAll() {
    const btn = document.getElementById('showAllBtn');
    const frame = document.getElementById('playerFrame');
    const placeholder = document.getElementById('playerPlaceholder');

    btn.addEventListener('click', () => {
        // No autoplay on showing the full playlist UI
        frame.src = playlistSrc(PLAYLIST_ID);
        placeholder?.classList.add('d-none');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderVideoList();
    wireShowAll();
    // Note: No default playback here; user must click to start
});
