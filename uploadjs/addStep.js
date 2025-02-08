document.addEventListener('DOMContentLoaded', () => {
    let stepCounter = 1;

    function addStep(insertBeforeElement = null) {
        stepCounter++;

        const firstStep = document.querySelector('.uploadblock');
        if (!firstStep) {
            console.error("Couldn't find the '.uploadblock' element");
            return;
        }

        const newStep = firstStep.cloneNode(true);

        // Reset step fields
        newStep.querySelector('.textarea').innerHTML = ''; // Corrected to value for textarea
        newStep.querySelector('.carouselPlaceholder').src = 'images/placeholder.png';
        newStep.querySelector('.carouselPlaceholder').style.display = 'block';
        newStep.querySelector('.carouselPlaceholder').style.objectFit = 'cover';
        newStep.querySelector('.carousel-controls').classList.add('hidden');
        newStep.querySelector('.image-list tbody').innerHTML = ''; // Clear media list
        newStep.querySelector('.videoUrlInput').value = ''; // Clear video URL input
        newStep.querySelectorAll('video, iframe').forEach(el => el.remove());

        // Attach functions and reset step ID
        attachButtonFunctions(newStep);
        setupMediaManagement(newStep);
        updateStepNumber(newStep, stepCounter);

        if (insertBeforeElement) {
            insertBeforeElement.parentNode.insertBefore(newStep, insertBeforeElement); // Insert before the selected step
        } else {
            const stepsContainer = document.getElementById('stepsContainer');
            const addStepButton = document.querySelector('.add-step-button');
            stepsContainer.insertBefore(newStep, addStepButton.parentNode);
        }

        toggleDeleteButtonVisibility();
        renumberSteps();
        toggleButtonStates();  // Update button states after adding a step
    }

    function renumberSteps() {
        document.querySelectorAll('.uploadblock').forEach((step, index) => {
            step.querySelector('h3').textContent = `Step ${index + 1}`;
        });
    }

    function toggleDeleteButtonVisibility() {
        const steps = document.querySelectorAll('.uploadblock');
        steps.forEach(step => {
            const deleteButton = step.querySelector('.deleteButton');
            deleteButton.disabled = steps.length === 1;  // Disable if only one step
        });
    }

    function toggleButtonStates() {
        const steps = document.querySelectorAll('.uploadblock');
        const totalSteps = steps.length;
    
        steps.forEach((step, index) => {
            const upButton = step.querySelector('.upButton');
            const downButton = step.querySelector('.downButton');
            const deleteButton = step.querySelector('.deleteButton');
    
            // Disable the up button for the first step
            upButton.disabled = index === 0;
    
            // Disable the down button for the last step
            downButton.disabled = index === totalSteps - 1;
    
            // Disable the delete button only if there's just one step
            deleteButton.disabled = totalSteps === 1;
        });
    }

    function moveStepUp(step) {
        const previousStep = step.previousElementSibling;
        if (previousStep && previousStep.classList.contains('uploadblock')) {
            step.parentNode.insertBefore(step, previousStep);
            renumberSteps();
            toggleButtonStates();  // Update button states after moving up
        }
    }

    function moveStepDown(step) {
        const nextStep = step.nextElementSibling;
        if (nextStep && nextStep.classList.contains('uploadblock')) {
            step.parentNode.insertBefore(nextStep, step);
            renumberSteps();
            toggleButtonStates();  // Update button states after moving down
        }
    }

    function deleteStep(step) {
        step.remove();
        renumberSteps();
        toggleDeleteButtonVisibility();
        toggleButtonStates();  // Update button states after deleting a step
    }

    function updateStepNumber(step, stepNumber) {
        step.querySelector('h3').textContent = `Step ${stepNumber}`;
    }

    function attachButtonFunctions(step) {
        step.querySelector('.upButton').addEventListener('click', () => moveStepUp(step));
        step.querySelector('.downButton').addEventListener('click', () => moveStepDown(step));
        step.querySelector('.plusButton').addEventListener('click', () => addStep(step));
        step.querySelector('.deleteButton').addEventListener('click', () => deleteStep(step));
    }

    // Initialize the first step
    const firstStep = document.querySelector('.uploadblock');
    attachButtonFunctions(firstStep);
    setupMediaManagement(firstStep);

    // Add step button
    document.querySelector('.add-step-button').addEventListener('click', (event) => {
        event.preventDefault();
        addStep();
    });

    // Initial button state check
    toggleButtonStates();
});