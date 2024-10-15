// results-display.js
import { fetchData, showToast } from './client-utils.js';

async function displayResults() {
    try {
        const results = await fetchData('/api/results');
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Clear any existing content

        if (results.message === 'No votes recorded yet') {
            resultsContainer.textContent = 'No votes have been recorded yet.';
            return;
        }

        for (const [category, dishes] of Object.entries(results)) {
            const categoryElement = document.createElement('div');
            categoryElement.innerHTML = `<h2>${category}</h2>`;

            dishes.forEach((dish, index) => {
                const dishElement = document.createElement('p');
                dishElement.textContent = `${index + 1}. ${dish.dish} (Score: ${dish.score.toFixed(2)})`;
                categoryElement.appendChild(dishElement);
            });

            resultsContainer.appendChild(categoryElement);
        }
    } catch (error) {
        console.error('Error fetching results:', error);
        showToast('Error fetching results. Please try again later.', 'error');
        document.getElementById('results').textContent = 'Unable to load results at this time.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayResults().catch(error => {
        console.error('Unhandled error in displayResults:', error);
        showToast('An unexpected error occurred. Please refresh the page.', 'error');
    });
});
