document.querySelectorAll('.uploadblock').forEach(setupMediaManagement);

function setupMediaManagement(step) {
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
    const carouselControls = step.querySelector(".carousel-controls");

    let mediaItems = [];
    let currentIndex = 0;

    imagePreview.addEventListener('click', () => {
        renderMediaList();
        imageDialog.showModal();
    });

    addImagesButton.addEventListener('click', (event) => {
        event.stopPropagation();
        imageInput.click();
    });

    imageInput.addEventListener('change', function () {
        Array.from(this.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileType = file.type.split('/')[0];
                if (fileType === 'image') {
                    mediaItems.push({ type: 'image', src: event.target.result, name: file.name });
                } else if (fileType === 'video') {
                    mediaItems.push({ type: 'video', src: event.target.result, name: file.name });
                }
                renderMediaList();
                updateCarousel();
            };
            reader.readAsDataURL(file);
        });
        this.value = ""; // Clear file input for new selections
    });

    addVideoButton.addEventListener('click', () => {
        const videoUrl = videoUrlInput.value.trim();
        if (videoUrl) {
            // Validate YouTube URL
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)[^#\&\?]{11}/;
            
            if (!youtubeRegex.test(videoUrl)) {
                alert("Please enter a valid YouTube URL."); // Simple alert, can be replaced with custom UI feedback
                return; // Stop execution if URL is invalid
            }
    
            // Extract video ID and create embed URL
            const videoId = videoUrl.includes('youtube.com') 
                ? new URL(videoUrl).searchParams.get('v') 
                : videoUrl.split('/').pop();
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
            // Add the valid YouTube video to the media list
            mediaItems.push({ type: 'embed', src: embedUrl, name: 'YouTube Video' });
            renderMediaList();
            updateCarousel();
            videoUrlInput.value = ''; // Clear the input field
        }
    });

    doneButton.addEventListener('click', () => {
        updateCarousel();
        imageDialog.close();
    });

    prevMediaButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextMediaButton.addEventListener('click', () => {
        if (currentIndex < mediaItems.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    editButton.addEventListener('click', () => {
        renderMediaList();
        imageDialog.showModal();
    });

    function renderMediaList() {
        mediaList.innerHTML = '';
        mediaItems.forEach((media, index) => {
            const row = createMediaRow(media, index);
            mediaList.appendChild(row);
        });
    }

    function updateCarousel() {
        // Ensure currentIndex is valid
        if (mediaItems.length === 0) {
            currentIndex = 0;
            imagePreview.src = 'images/placeholder.png';
            imagePreview.style.objectFit = 'cover';
            carouselControls.classList.add('hidden');
            return;
        }

        if (currentIndex >= mediaItems.length) {
            currentIndex = mediaItems.length - 1;
        }

        const currentMedia = mediaItems[currentIndex];
        resetCarouselPreview();

        if (currentMedia.type === 'image') {
            imagePreview.src = currentMedia.src;
            imagePreview.style.objectFit = 'contain';
        } else if (currentMedia.type === 'video') {
            replacePreview(createVideoElement(currentMedia.src));
        } else if (currentMedia.type === 'embed') {
            replacePreview(createIframeElement(currentMedia.src));
        }

        carouselControls.classList.remove('hidden');
        prevMediaButton.disabled = currentIndex === 0;
        nextMediaButton.disabled = currentIndex === mediaItems.length - 1;
    }

    function resetCarouselPreview() {
        const container = imagePreview.parentNode;
        container.querySelectorAll('video, iframe').forEach(el => el.remove());
        imagePreview.style.display = 'block';
    }

    function replacePreview(newElement) {
        imagePreview.style.display = 'none';
        imagePreview.parentNode.appendChild(newElement);
    }

    function createVideoElement(src) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.classList.add("carousel-video");
        return video;
    }

    function createIframeElement(src) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.allowFullscreen = true;
        iframe.classList.add("carousel-video");
        return iframe;
    }

    function createMediaRow(media, index) {
        const row = document.createElement('tr');
        const previewCell = document.createElement('td');
        const preview = document.createElement(media.type === 'image' ? 'img' : media.type === 'video' ? 'video' : 'iframe');
        preview.src = media.src;
        preview.classList.add('dialog-thumbnail');
        preview.style.width = '50px';
        preview.style.height = '50px';
        previewCell.appendChild(preview);

        const nameCell = document.createElement('td');
        nameCell.textContent = media.name;

        const actionsCell = document.createElement('td');
        actionsCell.classList.add('flex', 'gap4', 'acenter');

        // Create the Up Button
        const upButton = createActionButton('', () => moveMedia(index, -1));
        upButton.classList.add('upButton');
        upButton.title = "Move front";
        upButton.textContent = '↑'; // Add arrow symbol for clarity
        actionsCell.appendChild(upButton);

        // Create the Down Button
        const downButton = createActionButton('', () => moveMedia(index, 1));
        downButton.classList.add('downButton');
        downButton.title = "Move back";
        downButton.textContent = '↓'; // Add arrow symbol for clarity
        actionsCell.appendChild(downButton);

        // Create the Delete Button
        const deleteButton = createActionButton('', () => deleteMedia(index));
        deleteButton.classList.add('deleteButton');

        // Add the SVG Icon to the Delete Button
        deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z"/>
    </svg>`;
    deleteButton.title = "Delete media";
        actionsCell.appendChild(deleteButton);


        actionsCell.append(upButton, downButton, deleteButton);
        row.append(previewCell, nameCell, actionsCell);

        return row;
    }

    function createActionButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', onClick);
        return button;
    }

    function moveMedia(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < mediaItems.length) {
            [mediaItems[index], mediaItems[newIndex]] = [mediaItems[newIndex], mediaItems[index]];
            renderMediaList();
        }
    }

    function deleteMedia(index) {
        mediaItems.splice(index, 1);
        if (currentIndex >= mediaItems.length) {
            currentIndex = mediaItems.length - 1;
        }
        renderMediaList();
        updateCarousel();
    }
}