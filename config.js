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
        GRID_LINES: '#333',
        BLOOD: '#8A0303',
        GORE: '#5E0000',
        SPLATTER: '#3A0000'
    },
    
    // Initial snake length
    INITIAL_SNAKE_LENGTH: 3,
    
    // Score multipliers
    SCORE_PER_FOOD: 10,
    SCORE_PER_LEVEL: 50,
    
    // Gore effects
    GORE: {
        // Blood particles
        BLOOD_PARTICLE_COUNT: 15,
        BLOOD_PARTICLE_SIZE: 3,
        BLOOD_PARTICLE_LIFETIME: 1000,
        
        // Splatter patterns
        SPLATTER_MAX_SIZE: 30,
        SPLATTER_MIN_SIZE: 10,
        SPLATTER_COUNT: 3,
        
        // Screen shake
        SCREEN_SHAKE_DURATION: 300,
        SCREEN_SHAKE_INTENSITY: 5
    }
};

// Calculate derived values
CONFIG.CANVAS_WIDTH = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
CONFIG.CANVAS_HEIGHT = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE;

export default CONFIG;