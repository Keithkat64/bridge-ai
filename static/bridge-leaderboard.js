// bridge-leaderboard.js
class Leaderboard {
    constructor() {
        this.apiUrl = 'https://your-railway-app.railway.app/api';
        this.leaderboardBody = document.getElementById('leaderboardBody');
        this.loadLeaderboard();
    }

    async loadLeaderboard() {
        try {
            const response = await fetch(`${this.apiUrl}/leaderboard`);
            const leaderboard = await response.json();
            this.displayLeaderboard(leaderboard);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            this.handleError('Failed to load leaderboard');
        }
    }

    async addScore(scoreData) {
        try {
            const response = await fetch(`${this.apiUrl}/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData)
            });

            if (!response.ok) {
                throw new Error('Failed to save score');
            }

            await this.loadLeaderboard();
        } catch (error) {
            console.error('Failed to save score:', error);
            this.handleError('Failed to save score');
        }
    }

    displayLeaderboard(leaderboard) {
        this.leaderboardBody.innerHTML = '';
        
        leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .forEach((entry, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.firstName} ${entry.lastName}</td>
                    <td>${entry.score}</td>
                    <td>${new Date(entry.date).toLocaleDateString()}</td>
                `;
                this.leaderboardBody.appendChild(row);
            });
    }

    handleError(message) {
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `
            <td colspan="4" style="text-align: center; color: red;">
                ${message}. Please try again later.
            </td>
        `;
        this.leaderboardBody.innerHTML = '';
        this.leaderboardBody.appendChild(errorRow);
    }
}

// Initialize leaderboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboard = new Leaderboard();
});
