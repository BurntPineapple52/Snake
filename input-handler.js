export class InputHandler {
    constructor() {
        this.directionQueue = [];
        this.lastDirection = null;
        this.keyState = {};
        this.validKeys = {
            'ArrowUp': 'UP',
            'ArrowDown': 'DOWN',
            'ArrowLeft': 'LEFT',
            'ArrowRight': 'RIGHT'
        };

        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.validKeys[e.key] && !this.keyState[e.key]) {
                this.keyState[e.key] = true;
                const newDirection = this.validKeys[e.key];
                
                // Prevent 180-degree turns
                if (!this.lastDirection || 
                    (newDirection === 'UP' && this.lastDirection !== 'DOWN') ||
                    (newDirection === 'DOWN' && this.lastDirection !== 'UP') ||
                    (newDirection === 'LEFT' && this.lastDirection !== 'RIGHT') ||
                    (newDirection === 'RIGHT' && this.lastDirection !== 'LEFT')) {
                    this.directionQueue.push(newDirection);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.validKeys[e.key]) {
                this.keyState[e.key] = false;
            }
        });
    }

    getDirection() {
        if (this.directionQueue.length > 0) {
            this.lastDirection = this.directionQueue.shift();
        }
        return this.lastDirection;
    }

    reset() {
        this.directionQueue = [];
        this.lastDirection = null;
    }
}

export default InputHandler;