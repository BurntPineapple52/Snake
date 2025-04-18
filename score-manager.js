export class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.encryptionKey = 'snake-game-secret';
        this.highScore = this.loadHighScore();
    }

    loadHighScore() {
        try {
            const encrypted = localStorage.getItem('highScore');
            console.log('Loading high score, encrypted:', encrypted);
            if (!encrypted) return 0;
            
            // Ensure encryption key exists
            if (!this.encryptionKey) {
                console.error('Encryption key not initialized');
                return 0;
            }
            const key = this.encryptionKey;
            
            // Simple XOR "encryption" for basic obfuscation
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                decrypted += String.fromCharCode(
                    encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            
            const score = parseInt(decrypted, 10);
            const result = isNaN(score) ? 0 : Math.min(score, 1000000); // Cap at 1 million
            console.log('Decrypted high score:', result);
            return result;
        } catch (e) {
            console.error('Error loading high score:', e);
            // If corrupted, clear the bad data
            localStorage.removeItem('highScore');
            return 0;
        }
    }

    saveHighScore() {
        if (this.currentScore <= this.highScore) {
            console.log('Score not higher than current high score, not saving');
            return;
        }
        
        this.highScore = this.currentScore;
        let encrypted = '';
        for (let i = 0; i < String(this.highScore).length; i++) {
            encrypted += String.fromCharCode(
                String(this.highScore).charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
            );
        }
        
        console.log('Saving high score:', this.highScore, 'Encrypted:', encrypted);
        localStorage.setItem('highScore', encrypted);
        console.log('High score saved to localStorage');
    }

    addPoints(points) {
        this.currentScore += points;
        this.updateDisplay();
    }

    reset() {
        this.currentScore = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        const scoreElement = document.getElementById('score');
        const highScoreElement = document.getElementById('high-score');
        
        if (scoreElement) scoreElement.textContent = this.currentScore;
        if (highScoreElement) highScoreElement.textContent = this.highScore;
    }
}

export default ScoreManager;