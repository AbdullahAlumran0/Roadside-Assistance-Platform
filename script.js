// Toggle request details
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const details = button.parentElement.nextElementSibling;
        const isVisible = !details.hidden;
        details.hidden = isVisible;
        button.setAttribute('aria-expanded', !isVisible);
    });
});

// Open and close the New Request Modal
const newRequestModal = document.getElementById('newRequestModal');
const openModalButton = document.getElementById('openNewRequestModal');
const closeModalButton = document.getElementById('cancelRequest');

openModalButton.addEventListener('click', () => {
    newRequestModal.style.display = 'flex';
    newRequestModal.setAttribute('aria-hidden', 'false');
});

closeModalButton.addEventListener('click', () => {
    newRequestModal.style.display = 'none';
    newRequestModal.setAttribute('aria-hidden', 'true');
});

// Close modal if clicked outside of content area
window.addEventListener('click', (event) => {
    if (event.target === newRequestModal) {
        newRequestModal.style.display = 'none';
        newRequestModal.setAttribute('aria-hidden', 'true');
    }
});
