// -------- Category Section --------
const categoryButton = document.getElementById('primaryCategory');
const categoryDialog = document.getElementById('pcatdialog');
const categoryDoneButton = categoryDialog.querySelector('.doneButton');
const categoryTagListDivs = categoryDialog.querySelectorAll('.tagList');

categoryButton.addEventListener('click', function () {
    categoryDialog.showModal();
});

// Add event listener for each category tag
categoryTagListDivs.forEach(div => {
    div.addEventListener('click', function () {
        // Deselect all other tags
        categoryTagListDivs.forEach(d => {
            d.classList.remove('selectedTag');
            const button = d.querySelector('.removeTag');
            if (button) button.classList.add('hidden');
        });

        // Select the clicked tag
        div.classList.add('selectedTag');
        const button = div.querySelector('.removeTag');
        if (button) button.classList.remove('hidden');
    });
});

// Add event listener for category remove buttons
categoryDialog.querySelectorAll('.removeTag').forEach(button => {
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        const parentDiv = button.closest('.tagList');
        if (parentDiv) parentDiv.classList.remove('selectedTag');
        button.classList.add('hidden');
    });
});

// Update category button text when done
categoryDoneButton.addEventListener('click', function () {
    const selectedTag = categoryDialog.querySelector('.tagList.selectedTag');
    if (selectedTag) {
        const selectedCategory = Array.from(selectedTag.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('');
        categoryButton.textContent = `Category: ${selectedCategory}`;
    } else {
        categoryButton.textContent = 'Choose category';
    }
    categoryDialog.close();
});

// -------- Material Section --------
const materialButton = document.getElementById('primaryMaterial');
const materialDialog = document.getElementById('pmatdialog');
const materialDoneButton = materialDialog.querySelector('.doneButton');
const materialTagListDivs = materialDialog.querySelectorAll('.tagList');

materialButton.addEventListener('click', function () {
    materialDialog.showModal();
});

// Add event listener for each material tag
materialTagListDivs.forEach(div => {
    div.addEventListener('click', function () {
        const selectedTags = materialDialog.querySelectorAll('.tagList.selectedTag');
        if (!div.classList.contains('selectedTag') && selectedTags.length < 2) {
            div.classList.add('selectedTag');
            const button = div.querySelector('.removeTag');
            if (button) button.classList.remove('hidden');
        }
    });
});

// Add event listener for material remove buttons
materialDialog.querySelectorAll('.removeTag').forEach(button => {
    button.addEventListener('click', function (event) {
        event.stopPropagation();
        const parentDiv = button.closest('.tagList');
        if (parentDiv) parentDiv.classList.remove('selectedTag');
        button.classList.add('hidden');
    });
});

// Update material button text when done
materialDoneButton.addEventListener('click', function () {
    const selectedTags = materialDialog.querySelectorAll('.tagList.selectedTag');
    if (selectedTags.length > 0) {
        const selectedMaterials = Array.from(selectedTags).map(tag =>
            Array.from(tag.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('')
        );
        materialButton.textContent = `Material: ${selectedMaterials.join(', ')}`;
    } else {
        materialButton.textContent = 'Choose primary material';
    }
    materialDialog.close();
});





// --------- License section ------------
const licenseButton = document.getElementById('chooseLicense');
const licenseDialog = document.getElementById('licenseDialog');
const licenseDoneButton = licenseDialog.querySelector('.doneButton');
const licenseTagListDivs = licenseDialog.querySelectorAll('.license');
const ccby = licenseDialog.querySelector('.BY');
const ccsa = licenseDialog.querySelector('.SA');
const ccnc = licenseDialog.querySelector('.NC');
const ccnd = licenseDialog.querySelector('.ND');
const cc0 = licenseDialog.querySelector('.CC0');

licenseButton.addEventListener('click', function () {
    licenseDialog.showModal();
});

// Add event listener for each license div
licenseTagListDivs.forEach(div => {
    div.addEventListener('click', function () {
        // Deselect all other tags
        if (!ccby.classList.contains('subtext')) ccby.classList.replace('bold', 'subtext');
        if (!ccnc.classList.contains('subtext')) ccnc.classList.replace('bold', 'subtext');
        if (!ccnd.classList.contains('subtext')) ccnd.classList.replace('bold', 'subtext');
        if (!ccsa.classList.contains('subtext')) ccsa.classList.replace('bold', 'subtext');
        if (!cc0.classList.contains('subtext')) cc0.classList.replace('bold', 'subtext');
        licenseTagListDivs.forEach(d => {
            d.classList.remove('selectLicense');
        });
        // Select the clicked tag
        div.classList.add('selectLicense');
        if (div.classList.contains('BY')) ccby.classList.replace('subtext', 'bold');
        if (div.classList.contains('ND')) ccnd.classList.replace('subtext', 'bold');
        if (div.classList.contains('NC')) ccnc.classList.replace('subtext', 'bold');
        if (div.classList.contains('SA')) ccsa.classList.replace('subtext', 'bold');
        if (div.classList.contains('CC0')) cc0.classList.replace('subtext', 'bold');
    });
});


// Update license button text when done
licenseDoneButton.addEventListener('click', function () {
    const selectedTag = licenseDialog.querySelector('.license.selectLicense');
    if (selectedTag) {
        const selectedCategory = selectedTag.alt;
        licenseButton.textContent = `License: ${selectedCategory}`;
    } else {
        categoryButton.textContent = 'Choose License';
    }
    licenseDialog.close();
});