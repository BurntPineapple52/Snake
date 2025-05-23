import CONFIG from './config.js';
import InputHandler from './input-handler.js';
import ScoreManager from './score-manager.js';

class BloodParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * CONFIG.GORE.BLOOD_PARTICLE_SIZE + 2;
        this.lifetime = CONFIG.GORE.BLOOD_PARTICLE_LIFETIME;
        this.age = 0;
        this.velocity = {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3
        };
    }

    update(deltaTime) {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.age += deltaTime;
        return this.age < this.lifetime;
    }

    render(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.fillStyle = `rgba(138, 3, 3, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.inputHandler = new InputHandler();
        this.scoreManager = new ScoreManager();
        this.gameState = {
            snake: [],
            direction: 'RIGHT',
            food: null,
            gameOver: false,
            paused: false,
            bloodParticles: [],
            shake: {
                active: false,
                time: 0,
                intensity: 0
            }
        };
        this.lastUpdateTime = 0;
        this.animationFrameId = null;

        this.initCanvas();
        this.resetGame();
        this.startGameLoop();
    }

    initCanvas() {
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
    }

    resetGame() {
        this.gameState = {
            snake: this.createInitialSnake(),
            direction: 'RIGHT',
            food: this.generateFood(),
            gameOver: false,
            paused: false,
            bloodParticles: [],
            shake: {
                active: false,
                time: 0,
                intensity: 0
            }
        };
        this.scoreManager.reset();
        this.inputHandler.reset();
    }

    createInitialSnake() {
        const snake = [];
        const startX = Math.floor(CONFIG.GRID_WIDTH / 3);
        const startY = Math.floor(CONFIG.GRID_HEIGHT / 2);

        for (let i = 0; i < CONFIG.INITIAL_SNAKE_LENGTH; i++) {
            snake.push({ x: startX - i, y: startY });
        }

        return snake;
    }

    generateFood() {
        const food = {
            x: Math.floor(Math.random() * CONFIG.GRID_WIDTH),
            y: Math.floor(Math.random() * CONFIG.GRID_HEIGHT)
        };

        // Ensure food doesn't spawn on snake
        const isOnSnake = this.gameState.snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );

        return isOnSnake ? this.generateFood() : food;
    }

    startGameLoop() {
        const gameLoop = (timestamp) => {
            if (this.gameState.gameOver || this.gameState.paused) {
                return;
            }

            if (timestamp - this.lastUpdateTime > CONFIG.GAME_SPEED) {
                this.update();
                this.render();
                this.lastUpdateTime = timestamp;
            }

            this.animationFrameId = requestAnimationFrame(gameLoop);
        };

        this.animationFrameId = requestAnimationFrame(gameLoop);
    }

    update() {
        const newDirection = this.inputHandler.getDirection();
        if (newDirection) {
            this.gameState.direction = newDirection;
        }

        const head = {...this.gameState.snake[0]};

        // Move head based on direction
        switch (this.gameState.direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        // Check collisions
        if (this.checkCollision(head)) {
            // Spawn blood particles on collision
            const headPos = this.getPixelPosition(head);
            for (let i = 0; i < CONFIG.GORE.BLOOD_PARTICLE_COUNT; i++) {
                this.gameState.bloodParticles.push(
                    new BloodParticle(headPos.x, headPos.y)
                );
            }
            this.gameState.gameOver = true;
            this.scoreManager.saveHighScore();
            return;
        }

        // Add new head
        this.gameState.snake.unshift(head);

        // Check food collision
        if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
            this.scoreManager.addPoints(CONFIG.SCORE_PER_FOOD);
            this.gameState.food = this.generateFood();
            // Trigger screen shake
            this.gameState.shake = {
                active: true,
                time: 0,
                intensity: CONFIG.GORE.SCREEN_SHAKE_INTENSITY
            };
        } else {
            // Remove tail if no food eaten
            this.gameState.snake.pop();
        }
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH || 
            head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
            return true;
        }

        // Self collision
        return this.gameState.snake.some((segment, index) => 
            index > 0 && segment.x === head.x && segment.y === head.y
        );
    }

    getPixelPosition(gridPos) {
        return {
            x: (gridPos.x + 0.5) * CONFIG.CELL_SIZE,
            y: (gridPos.y + 0.5) * CONFIG.CELL_SIZE
        };
    }

    render() {
        // Handle screen shake
        let offsetX = 0;
        let offsetY = 0;
        if (this.gameState.shake.active) {
            const progress = this.gameState.shake.time / CONFIG.GORE.SCREEN_SHAKE_DURATION;
            const intensity = this.gameState.shake.intensity * (1 - progress);
            offsetX = (Math.random() - 0.5) * intensity;
            offsetY = (Math.random() - 0.5) * intensity;
            this.gameState.shake.time += CONFIG.GAME_SPEED;
            if (progress >= 1) {
                this.gameState.shake.active = false;
            }
        }

        // Clear canvas
        this.ctx.save();
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINES;
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * CONFIG.CELL_SIZE, 0);
            this.ctx.lineTo(x * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);
            this.ctx.stroke();
        }
        for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * CONFIG.CELL_SIZE);
            this.ctx.lineTo(CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, y * CONFIG.CELL_SIZE);
            this.ctx.stroke();
        }

        // Draw snake
        this.gameState.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? CONFIG.COLORS.SNAKE_HEAD : CONFIG.COLORS.SNAKE;
            this.ctx.fillRect(
                segment.x * CONFIG.CELL_SIZE,
                segment.y * CONFIG.CELL_SIZE,
                CONFIG.CELL_SIZE,
                CONFIG.CELL_SIZE
            );
        });

        // Draw food
        this.ctx.fillStyle = CONFIG.COLORS.FOOD;
        this.ctx.beginPath();
        this.ctx.arc(
            (this.gameState.food.x + 0.5) * CONFIG.CELL_SIZE,
            (this.gameState.food.y + 0.5) * CONFIG.CELL_SIZE,
            CONFIG.CELL_SIZE / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Update and render blood particles
        this.gameState.bloodParticles = this.gameState.bloodParticles.filter(particle => {
            particle.update(CONFIG.GAME_SPEED);
            particle.render(this.ctx);
            return particle.age < particle.lifetime;
        });

        // Game over overlay handled by HTML/CSS now
        if (this.gameState.gameOver) {
            const overlay = document.getElementById('game-over-overlay');
            overlay.classList.remove('hidden');
            document.getElementById('final-score').textContent = this.scoreManager.currentScore;
            document.getElementById('final-high-score').textContent = this.scoreManager.highScore;
        }

        this.ctx.restore();
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    
    // Handle retry button click
    document.getElementById('retry-button').addEventListener('click', () => {
        document.getElementById('game-over-overlay').classList.add('hidden');
        // Cancel existing game loop
        if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
        }
        // Reset game state
        game.resetGame();
        // Restart game loop
        game.startGameLoop();
    });
});