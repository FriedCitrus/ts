export class CursorGifTracker {
    position = { x: 0, y: 0 };
    isPlaying = false;
    gifElement;
    posXElement;
    posYElement;
    statusElement;
    statusContainer;
    playTimeout = null;
    gifUrl = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnVxYzRmOHB3bWZxdGJ3Y3h2ZDN4Z3BsMHJoNzJxaWN4MWZkY2RkZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7aD2saalBwwftBIY/giphy.gif';
    gifDuration = 2000; // milliseconds
    constructor() {
        this.gifElement = document.getElementById('cursor-gif');
        this.posXElement = document.getElementById('pos-x');
        this.posYElement = document.getElementById('pos-y');
        this.statusElement = document.getElementById('status-text');
        this.statusContainer = this.statusElement.parentElement;
        this.init();
    }
    init() {
        this.setupEventListeners();
    }
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mousedown', (e) => this.handleClick(e));
    }
    handleMouseMove(e) {
        this.position = { x: e.clientX, y: e.clientY };
        this.updatePosition();
        this.updatePositionDisplay();
    }
    handleClick(e) {
        // Only trigger on left click (button 0)
        if (e.button === 0 && !this.isPlaying) {
            this.playGif();
        }
    }
    playGif() {
        this.isPlaying = true;
        // Force GIF to restart by changing src
        this.gifElement.src = `${this.gifUrl}?t=${Date.now()}`;
        this.gifElement.style.display = 'block';
        this.updateStatus();
        this.updatePosition();
        // Clear any existing timeout
        if (this.playTimeout !== null) {
            clearTimeout(this.playTimeout);
        }
        // Hide GIF after duration
        this.playTimeout = window.setTimeout(() => {
            this.stopGif();
        }, this.gifDuration);
    }
    stopGif() {
        this.isPlaying = false;
        this.gifElement.style.display = 'none';
        this.updateStatus();
    }
    updatePosition() {
        this.gifElement.style.left = `${this.position.x}px`;
        this.gifElement.style.top = `${this.position.y}px`;
        this.gifElement.style.transform = 'translate(-50%, -50%)';
    }
    updatePositionDisplay() {
        this.posXElement.textContent = this.position.x.toString();
        this.posYElement.textContent = this.position.y.toString();
    }
    updateStatus() {
        if (this.isPlaying) {
            this.statusElement.textContent = '▶ Playing';
            this.statusContainer.classList.remove('sleeping');
            this.statusContainer.classList.add('playing');
        }
        else {
            this.statusElement.textContent = '⏸ Sleeping';
            this.statusContainer.classList.remove('playing');
            this.statusContainer.classList.add('sleeping');
        }
    }
}
//# sourceMappingURL=gifplayer.js.map