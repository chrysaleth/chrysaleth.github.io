function enlargeCard(card) {
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modal-text');
    const text = card.querySelector('.writing-content p').textContent;
    
    modalText.textContent = text;
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
