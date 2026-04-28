// --- 1. Audio Logic ---
// --- 1. Audio Logic ---
const playlist = [
    { 
        title: "Takashi Kokubo - The Day I Saw The Rainbow", 
        audio: "./assets/Takashi Kokubo - The Day I Saw The Rainbow shortened.mp3", 
        cover: "./assets/tk_tdsr.jpg" 
    },
    { 
        title: "Sérénité by Paul Sauvanet", 
        audio: "./assets/Sérénité by Paul Sauvanet (1989) WEB.mp3", 
        cover: "./assets/ps_s.jpg" 
    },
    { 
        title: "Macroblank - Plastic Fables", 
        audio: "./assets/Macroblank - Plastic Fables.mp3", 
        cover: "./assets/mb_pf.jpg" 
    },
    { 
        title: "Los Angeles: Critical Mass", 
        audio: "./assets/Los Angeles： Critical Mass [Full Album] (1998) Mindspore Records.mp3", 
        cover: "./assets/la_cm.jpg" 
    }
];

let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();

// DOM Elements
const playBtn = document.getElementById('btn-play');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const progressBar = document.getElementById('progress-bar');
const trackTitle = document.getElementById('track-title');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const coverArt = document.getElementById('cover-art');

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.audio;
    trackTitle.textContent = song.title;
    coverArt.src = song.cover;
    audio.load();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
    } else {
        audio.play();
        playBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
}

function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

function playPrev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Event Listeners for Audio
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

audio.addEventListener('ended', playNext);

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

loadSong(currentIndex);

const player = document.getElementById('mp3-player');
