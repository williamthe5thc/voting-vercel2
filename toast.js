// toast.js
export class Toast {
    static show(message, type = 'info') {
        try {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
            }, 100);
        } catch (error) {
            console.error('Error showing toast:', error);
            // Fallback to console.log if toast fails
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}
