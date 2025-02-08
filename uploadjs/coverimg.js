document.addEventListener('DOMContentLoaded', () => {
    // Image upload and preview functionality for the display image
    const displayImage = document.getElementById('displayImage');
    const displayInput = document.getElementById('displayInput');

    displayImage.addEventListener('click', () => {
        displayInput.click(); // Open file picker
    });

    displayInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                displayImage.src = event.target.result; // Display the selected image
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to handle image uploads for process steps
    function handleStepImageUpload(imagePreview, imageInput) {
        imagePreview.addEventListener('click', () => {
            imageInput.click(); // Open file picker
        });

        imageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    imagePreview.src = event.target.result; // Display selected image
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialize image uploads for all process steps
    function initializeImageUploads() {
        const imagePreviews = document.querySelectorAll('.imagePreview');
        const imageInputs = document.querySelectorAll('.imageInput');
        imagePreviews.forEach((imagePreview, index) => {
            const imageInput = imageInputs[index];
            handleStepImageUpload(imagePreview, imageInput);
        });
    }

    initializeImageUploads(); // Initialize for the first step

});