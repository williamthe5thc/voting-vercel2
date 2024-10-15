// admin.js
import { fetchData, showToast, CATEGORIES } from './client-utils.js';

function generateDishCountInputs() {
    const container = document.getElementById('dishCountInputs');
    CATEGORIES.forEach(category => {
        const div = document.createElement('div');
        div.classList.add('dish-count-input');
        div.innerHTML = `
            <label for="${category.replace(/\s+/g, '')}">${category}:</label>
            <input type="number" id="${category.replace(/\s+/g, '')}" name="${category.replace(/\s+/g, '')}" min="1" max="10" value="5">
        `;
        container.appendChild(div);
    });
}

async function clearVotes() {
    if (confirm('Are you sure you want to clear all votes? This action cannot be undone.')) {
        try {
            await fetchData('/api/clear-votes', 'POST');
            showToast('Votes cleared successfully', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to clear votes. Please try again.', 'error');
        }
    }
}

async function updateDishCount() {
    const dishCounts = {};
    CATEGORIES.forEach(category => {
        const input = document.getElementById(category.replace(/\s+/g, ''));
        dishCounts[category] = parseInt(input.value);
    });

    try {
        await fetchData('/api/update-settings', 'POST', { dishesPerCategory: dishCounts });
        showToast('Number of dishes updated successfully', 'success');
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to update number of dishes. Please try again.', 'error');
    }
}

async function viewSettings() {
    try {
        const settings = await fetchData('/api/get-settings');
        let settingsHtml = '<h3>Current Dish Counts:</h3>';
        for (const [category, count] of Object.entries(settings.dishesPerCategory)) {
            settingsHtml += `<p>${category}: ${count} dishes</p>`;
        }
        document.getElementById('currentSettings').innerHTML = settingsHtml;
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to fetch settings. Please try again.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateDishCountInputs();
    document.getElementById('clearVotes').addEventListener('click', clearVotes);
    document.getElementById('updateDishCount').addEventListener('click', updateDishCount);
    document.getElementById('viewSettings').addEventListener('click', viewSettings);
});
