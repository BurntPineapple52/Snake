export const CONFIG = {
    // Game grid dimensions (cells)
    GRID_WIDTH: 20,
    GRID_HEIGHT: 20,
    
    // Cell size in pixels
    CELL_SIZE: 20,
    
    // Game speed (milliseconds per frame)
    GAME_SPEED: 150,
    
    // Colors
    COLORS: {
        SNAKE: '#4CAF50',
        SNAKE_HEAD: '#2E7D32',
        FOOD: '#F44336',
        BACKGROUND: '#111',
        GRID_LINES: '#333'
    },
    
    // Initial snake length
    INITIAL_SNAKE_LENGTH: 3,
    
    // Score multipliers
    SCORE_PER_FOOD: 10,
    SCORE_PER_LEVEL: 50
};

// Calculate derived values
CONFIG.CANVAS_WIDTH = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
CONFIG.CANVAS_HEIGHT = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

export default CONFIG;