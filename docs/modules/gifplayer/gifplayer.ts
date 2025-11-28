interface Position {
    x: number;
    y: number;
}

export class CursorGifTracker {
    private position: Position = { x: 0, y: 0 };
    private isPlaying: boolean = false;
    private gifElement: HTMLImageElement;
    private posXElement: HTMLElement;
    private posYElement: HTMLElement;
    private statusElement: HTMLElement;
    private statusContainer: HTMLElement;
    private playTimeout: number | null = null;
    private readonly gifUrl: string = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnVxYzRmOHB3bWZxdGJ3Y3h2ZDN4Z3BsMHJoNzJxaWN4MWZkY2RkZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7aD2saalBwwftBIY/giphy.gif';
    private readonly gifDuration: number = 2000; // milliseconds

    constructor() {
        this.gifElement = document.getElementById('cursor-gif') as HTMLImageElement;
        this.posXElement = document.getElementById('pos-x') as HTMLElement;
        this.posYElement = document.getElementById('pos-y') as HTMLElement;
        this.statusElement = document.getElementById('status-text') as HTMLElement;
        this.statusContainer = this.statusElement.parentElement as HTMLElement;

        this.init();
    }

    private init(): void {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        window.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e));
        window.addEventListener('mousedown', (e: MouseEvent) => this.handleClick(e));
    }

    private handleMouseMove(e: MouseEvent): void {
        this.position = { x: e.clientX, y: e.clientY };
        this.updatePosition();
        this.updatePositionDisplay();
    }

    private handleClick(e: MouseEvent): void {
        // Only trigger on left click (button 0)
        if (e.button === 0 && !this.isPlaying) {
            this.playGif();
        }
    }

    private playGif(): void {
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

    private stopGif(): void {
        this.isPlaying = false;
        this.gifElement.style.display = 'none';
        this.updateStatus();
    }

    private updatePosition(): void {
        this.gifElement.style.left = `${this.position.x}px`;
        this.gifElement.style.top = `${this.position.y}px`;
        this.gifElement.style.transform = 'translate(-50%, -50%)';
    }

    private updatePositionDisplay(): void {
        this.posXElement.textContent = this.position.x.toString();
        this.posYElement.textContent = this.position.y.toString();
    }

    private updateStatus(): void {
        if (this.isPlaying) {
            this.statusElement.textContent = '▶ Playing';
            this.statusContainer.classList.remove('sleeping');
            this.statusContainer.classList.add('playing');
        } else {
            this.statusElement.textContent = '⏸ Sleeping';
            this.statusContainer.classList.remove('playing');
            this.statusContainer.classList.add('sleeping');
        }
    }
}
