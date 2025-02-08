
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileinput');
    const filesContainer = document.getElementById('filesContainer');

    fileInput.addEventListener('change', function() {
        const files = this.files; // Get the selected files

        // Loop through the selected files and append them to the container
        Array.from(files).forEach((file) => {
            // Create file details container
            const fileDetails = document.createElement('div');
            fileDetails.classList.add('fileDetails');
            
            // Create custom title input field
            const fileTitle = document.createElement('input');
            fileTitle.type = 'text';
            fileTitle.placeholder = `Enter title for ${file.name}`;
            fileDetails.appendChild(fileTitle);

            // Create a downloadable link for the file
            const fileLink = document.createElement('a');
            fileLink.href = URL.createObjectURL(file); // Create a temporary URL for the file
            fileLink.textContent = file.name;
            fileLink.download = file.name; // Set the download attribute to the filename
            fileLink.classList.add('fileLink');
            fileDetails.appendChild(fileLink); 

            // Display the current date as upload date
            const today = new Date();
            const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
            const uploadDate = document.createElement('p');
            uploadDate.textContent = `${formattedDate}`;
            fileDetails.appendChild(uploadDate);

            // Create a delete button with a trash icon
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 -960 960 960">
                                        <path
                                            d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z" />
                                    </svg>`; // Trash icon using Font Awesome
            deleteButton.classList.add('deleteButton');
            deleteButton.title = "Delete file";
            deleteButton.addEventListener('click', function() {
                filesContainer.removeChild(fileDetails); // Remove the fileDetails container
            });
            fileDetails.appendChild(deleteButton);

            // Append the file details to the container without clearing previous content
            filesContainer.appendChild(fileDetails);
        });
    });
});