document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    const modal = document.getElementById('imageModal');
    const fullImage = document.getElementById('fullImage');
    const closeModal = document.querySelector('.closeModal');

    // Image carousel functionality
    carousels.forEach(carousel => {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.closest('.stepblock').querySelector('.prevImage');
        const nextButton = carousel.closest('.stepblock').querySelector('.nextImage');

        let currentIndex = 0;
        updateButtons();

        nextButton.addEventListener('click', () => {
            if (currentIndex < items.length - 1) {
                items[currentIndex].classList.remove('active');
                currentIndex++;
                items[currentIndex].classList.add('active');
                updateButtons();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                items[currentIndex].classList.remove('active');
                currentIndex--;
                items[currentIndex].classList.add('active');
                updateButtons();
            }
        });

        function updateButtons() {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === items.length - 1;
        }
    });

    // Fullscreen modal functionality
    document.querySelectorAll('.carousel-item').forEach(img => {
        img.addEventListener('click', () => {
            fullImage.src = img.src;  // Set clicked image as the modal content
            modal.classList.remove('hidden');  // Show the modal
        });
    });

    // Close modal when clicking on 'x' or outside the image
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');  // Close only if outside the image
    });
});