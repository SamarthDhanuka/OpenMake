document.addEventListener('DOMContentLoaded', () => {
    let stepCounter = 1;
    const stepMediaLists = {}; // Store media per step using step ID

    function addStep(insertAfterElement = null) {
        stepCounter++;
        const firstStep = document.querySelector('.uploadblock');
        if (!firstStep) {
            console.error("Couldn't find the '.uploadblock' element");
            return;
        }

        const newStep = firstStep.cloneNode(true);
        updateStepNumber(newStep, stepCounter);
        resetStep(newStep, stepCounter);

        if (insertAfterElement) {
            insertAfterElement.after(newStep);
        } else {
            const stepsContainer = document.getElementById('stepsContainer');
            const addStepButton = document.querySelector('.add-step-button');
            stepsContainer.insertBefore(newStep, addStepButton.parentNode);
        }

        attachButtonFunctions(newStep);
        setupMediaManagement(newStep, stepCounter);
        toggleDeleteButtonVisibility();
        renumberSteps();
    }

    function resetStep(step, stepId) {
        step.setAttribute('data-step-id', stepId);
        step.querySelector('textarea').value = '';
        const imagePreview = step.querySelector('.carouselPlaceholder');
        imagePreview.src = 'images/placeholder.png';
        stepMediaLists[stepId] = []; // Initialize empty media list
        step.querySelector('.carousel-controls').classList.add('hidden'); // Hide carousel controls initially
    }

    function renumberSteps() {
        const steps = document.querySelectorAll('.uploadblock');
        steps.forEach((step, index) => {
            step.querySelector('h3').textContent = `Step ${index + 1}`;
        });
    }

    function toggleDeleteButtonVisibility() {
        const steps = document.querySelectorAll('.uploadblock');
        steps.forEach(step => {
            const deleteButton = step.querySelector('.deleteButton');
            deleteButton.disabled = steps.length === 1;
        });
    }

    function moveStepUp(step) {
        const previousStep = step.previousElementSibling;
        if (previousStep && previousStep.classList.contains('uploadblock')) {
            step.parentNode.insertBefore(step, previousStep);
            renumberSteps();
        }
    }

    function moveStepDown(step) {
        const nextStep = step.nextElementSibling;
        if (nextStep && nextStep.classList.contains('uploadblock')) {
            step.parentNode.insertBefore(nextStep, step);
            renumberSteps();
        }
    }

    function deleteStep(step) {
        const stepId = step.getAttribute('data-step-id');
        delete stepMediaLists[stepId]; // Remove the media list for this step
        step.remove();
        renumberSteps();
        toggleDeleteButtonVisibility();
    }

    function updateStepNumber(step, stepNumber) {
        step.querySelector('h3').textContent = `Step ${stepNumber}`;
    }

    function attachButtonFunctions(step) {
        const upButton = step.querySelector('.upButton');
        const downButton = step.querySelector('.downButton');
        const plusButton = step.querySelector('.plusButton');
        const deleteButton = step.querySelector('.deleteButton');

        upButton.addEventListener('click', () => moveStepUp(step));
        downButton.addEventListener('click', () => moveStepDown(step));
        plusButton.addEventListener('click', () => addStep(step));
        deleteButton.addEventListener('click', () => deleteStep(step));
    }

    function setupMediaManagement(step, stepId) {
        const imagePreview = step.querySelector('.carouselPlaceholder');
        const imageDialog = step.querySelector('.imageDialog');
        const imageInput = step.querySelector('.imageInput');
        const addImagesButton = step.querySelector('.addImagesButton');
        const addVideoButton = step.querySelector('.addVideoButton');
        const videoUrlInput = step.querySelector('.videoUrlInput');
        const doneButton = step.querySelector('.doneButton');
        const mediaList = step.querySelector('.image-list tbody');
        const prevMediaButton = step.querySelector('.prevImage');
        const nextMediaButton = step.querySelector('.nextImage');
        const editButton = step.querySelector('.editMedia');
        const carouselControls = step.querySelector('.carousel-controls');

        let currentIndex = 0;

        imagePreview.addEventListener('click', () => {
            renderMediaList(stepMediaLists[stepId], mediaList);
            imageDialog.showModal();
        });

        addImagesButton.addEventListener('click', (event) => {
            event.stopPropagation();
            imageInput.click();
        });

        imageInput.addEventListener('change', function () {
            const files = Array.from(this.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const mediaType = file.type.includes("video") ? "video" : "image";
                    stepMediaLists[stepId].push({
                        type: mediaType,
                        src: event.target.result,
                        name: file.name
                    });
                    renderMediaList(stepMediaLists[stepId], mediaList);
                    updateCarousel(stepId);
                };
                reader.readAsDataURL(file);
            });
            imageInput.value = ""; // Clear file input
        });

        addVideoButton.addEventListener('click', () => {
            const videoUrl = videoUrlInput.value.trim();
            if (videoUrl) {
                const embedUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')
                    ? `https://www.youtube.com/embed/${new URL(videoUrl).searchParams.get('v') || videoUrl.split('/').pop()}`
                    : videoUrl;

                stepMediaLists[stepId].push({ type: 'embed', src: embedUrl, name: 'Embedded Video' });
                renderMediaList(stepMediaLists[stepId], mediaList);
                updateCarousel(stepId);
                videoUrlInput.value = '';
            }
        });

        function updateCarousel(stepId) {
            const mediaItems = stepMediaLists[stepId];
            if (mediaItems.length === 0) {
                imagePreview.src = 'images/placeholder.png';
                carouselControls.classList.add('hidden');
            } else {
                const currentMedia = mediaItems[currentIndex];
                resetCarouselPreview(imagePreview);
                if (currentMedia.type === 'image') {
                    imagePreview.src = currentMedia.src;
                    imagePreview.style.display = 'block';
                } else if (currentMedia.type === 'video') {
                    const videoElement = createVideoElement(currentMedia.src);
                    replacePreviewWith(videoElement);
                } else if (currentMedia.type === 'embed') {
                    const iframeElement = createEmbedElement(currentMedia.src);
                    replacePreviewWith(iframeElement);
                }
                carouselControls.classList.remove('hidden');
            }
            prevMediaButton.disabled = currentIndex === 0;
            nextMediaButton.disabled = currentIndex === mediaItems.length - 1;
        }

        function renderMediaList(mediaItems, mediaListElement) {
            mediaListElement.innerHTML = '';
            mediaItems.forEach((media, index) => {
                const row = createMediaRow(media, index, mediaItems, stepId);
                mediaListElement.appendChild(row);
            });
        }

        prevMediaButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel(stepId);
            }
        });

        nextMediaButton.addEventListener('click', () => {
            if (currentIndex < stepMediaLists[stepId].length - 1) {
                currentIndex++;
                updateCarousel(stepId);
            }
        });

        editButton.addEventListener('click', () => {
            imageDialog.showModal();
        });

        doneButton.addEventListener('click', () => {
            imageDialog.close();
        });
    }

    function createVideoElement(src) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        return video;
    }

    function createEmbedElement(src) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.allowFullscreen = true;
        return iframe;
    }

    function resetCarouselPreview(previewElement) {
        const container = previewElement.parentNode;
        container.querySelectorAll('.carousel-video, iframe').forEach(el => el.remove());
        previewElement.style.display = 'block';
    }

    function createMediaRow(media, index, mediaItems, stepId) {
        const row = document.createElement('tr');
        row.dataset.index = index;

        const previewCell = document.createElement('td');
        const mediaPreview = media.type === 'image'
            ? document.createElement('img')
            : document.createElement(media.type === 'video' ? 'video' : 'iframe');
        mediaPreview.src = media.src;
        mediaPreview.classList.add('dialog-thumbnail');
        previewCell.appendChild(mediaPreview);

        const nameCell = document.createElement('td');
        nameCell.textContent = media.name;

        const actionsCell = document.createElement('td');
        actionsCell.appendChild(createActionButton('↑', () => moveMedia(index, -1, mediaItems, stepId)));
        actionsCell.appendChild(createActionButton('↓', () => moveMedia(index, 1, mediaItems, stepId)));
        actionsCell.appendChild(createActionButton('Delete', () => deleteMedia(index, mediaItems, stepId)));

        row.appendChild(previewCell);
        row.appendChild(nameCell);
        row.appendChild(actionsCell);
        return row;
    }

    function createActionButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', onClick);
        return button;
    }

    function moveMedia(index, direction, mediaItems, stepId) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < mediaItems.length) {
            [mediaItems[index], mediaItems[newIndex]] = [mediaItems[newIndex], mediaItems[index]];
            renderMediaList(mediaItems, document.querySelector(`[data-step-id="${stepId}"] .image-list tbody`));
        }
    }

    function deleteMedia(index, mediaItems, stepId) {
        mediaItems.splice(index, 1);
        renderMediaList(mediaItems, document.querySelector(`[data-step-id="${stepId}"] .image-list tbody`));
    }

    const firstStep = document.querySelector('.uploadblock');
    resetStep(firstStep, stepCounter);
    attachButtonFunctions(firstStep);
    setupMediaManagement(firstStep, stepCounter);

    document.querySelector('.add-step-button').addEventListener('click', (event) => {
        event.preventDefault();
        addStep();
    });
});