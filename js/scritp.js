/**
 * Responsive Music Player JavaScript
 * Handles all functionality including play/pause, playlist management, 
 * volume control, and file uploads
 */

class MusicPlayer {
    constructor() {
        this.initializeDOMElements();
        this.initializePlayerState();
        this.createDefaultPlaylist();
        this.initializeEventListeners();
        this.audioPlayer.volume = 0.5;
    }

    initializeDOMElements() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.songAlbum = document.getElementById('songAlbum');
        this.albumArt = document.getElementById('albumArt');
        this.playlistContainer = document.getElementById('playlistContainer');
        this.fileInput = document.getElementById('fileInput');
        this.themeToggle = document.getElementById('themeToggle');
    }

    initializePlayerState() {
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.playlist = [];
        this.isDarkTheme = true;
    }

    /**
     * ✅ Create your custom default playlist here
     */
    createDefaultPlaylist() {
        this.playlist = [
             {
                title: "Phir kabhi",
                artist: "Arman Malik & Arijit Singh",
                album: "unknown Album",
                src: "assets/kabhi.mp3"
            },
            {
                title: "Marham",
                artist: "Aditya Rakhari",
                album: "unknown Album",
                src: "assets/marham.mp3"
            },
            {
                title: "Sahiba",
                artist: "Aditya Rakhari",
                album: "unknown Album",
                src: "assets/Sahiba.mp3"
            },
            {
                title: "Pal Pal",
                artist: "Aditya Rakhari",
                album: "unknown Album",
                src: "assets/Pal Pal.mp3"
            },
        ];

        this.renderPlaylist();
        this.loadSong(0);
    }

    initializeEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateTotalTime());
    }

    togglePlayPause() {
        if (!this.audioPlayer.src) {
            alert('Please upload audio files first!');
            return;
        }

        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.albumArt.classList.remove('playing');
        } else {
            this.audioPlayer.play();
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.albumArt.classList.add('playing');
        }

        this.isPlaying = !this.isPlaying;
    }

 loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.currentSongIndex = index;
            const song = this.playlist[index];
            this.songTitle.textContent = song.title;
            this.songArtist.textContent = song.artist;
            this.songAlbum.textContent = song.album;
            if (song.src) {
                this.audioPlayer.src = song.src;
            }

            this.updatePlaylistActiveState();

            // 🔁 Auto-play if player was already playing
            if (this.isPlaying) {
                this.audioPlayer.play();
                this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.albumArt.classList.add('playing');
            } else {
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.albumArt.classList.remove('playing');
            }
        }
    }
    
    previousSong() {
        const prevIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(prevIndex);
    }

    nextSong() {
        const nextIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(nextIndex);
    }

    seek(e) {
        if (!this.audioPlayer.src) return;
        const progressBarWidth = this.progressBar.offsetWidth;
        const clickX = e.offsetX;
        const duration = this.audioPlayer.duration;
        this.audioPlayer.currentTime = (clickX / progressBarWidth) * duration;
    }

    setVolume(value) {
        this.audioPlayer.volume = value / 100;
        const volumeIcons = document.querySelectorAll('.volume-icon');
        if (value == 0) {
            volumeIcons[0].className = 'fas fa-volume-mute volume-icon';
        } else if (value < 50) {
            volumeIcons[0].className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcons[0].className = 'fas fa-volume-up volume-icon';
        }
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            this.progressFill.style.width = progress + '%';
            this.currentTime.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }

    updateTotalTime() {
        if (this.audioPlayer.duration) {
            this.totalTime.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    handleFileUpload(e) {

        if (this.playlist.length === 1) {
            this.loadSong(0);
        } else {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.type.startsWith('audio/')) {
                    const url = URL.createObjectURL(file);
                    const song = {
                        title: file.name.replace(/\.[^/.]+$/, ""),
                        artist: "Unknown Artist",
                        album: "Unknown Album",
                        src: url
                    };
                    this.playlist.push(song);
                }
            });
            this.renderPlaylist();
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;

        if (this.isDarkTheme) {
            document.body.classList.remove('light-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        } else {
            document.body.classList.add('light-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        }
    }

    deleteSong(index, e) {
        e.stopPropagation();

        if (confirm('Are you sure you want to delete this song?')) {
            if (index === this.currentSongIndex) {
                this.audioPlayer.pause();
                this.isPlaying = false;
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.albumArt.classList.remove('playing');
            }

            this.playlist.splice(index, 1);

            if (index < this.currentSongIndex) {
                this.currentSongIndex--;
            } else if (index === this.currentSongIndex && this.playlist.length > 0) {
                if (this.currentSongIndex >= this.playlist.length) {
                    this.currentSongIndex = 0;
                }
                this.loadSong(this.currentSongIndex);
            } else if (this.playlist.length === 0) {
                this.currentSongIndex = 0;
                this.songTitle.textContent = 'Select a Song';
                this.songArtist.textContent = 'Unknown Artist';
                this.songAlbum.textContent = 'Unknown Album';
                this.audioPlayer.src = '';
            }

            this.renderPlaylist();
        }
    }

    renderPlaylist() {
        this.playlistContainer.innerHTML = '';

        this.playlist.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
                <div class="playlist-item-actions">
                    <button class="delete-btn" title="Delete Song">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            const playlistItemInfo = playlistItem.querySelector('.playlist-item-info');
            playlistItemInfo.addEventListener('click', () => this.loadSong(index));

            const deleteBtn = playlistItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => this.deleteSong(index, e));

            this.playlistContainer.appendChild(playlistItem);
        });

        this.updatePlaylistActiveState();
    }

    updatePlaylistActiveState() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
