document.addEventListener("DOMContentLoaded", function () {
    const addModelButton = document.getElementById("addModelButton");
    const embedModal = document.getElementById("embedModal");
    const embedCodeInput = document.getElementById("embedCodeInput");
    const embedPreview = document.getElementById("embedPreview");
    const insertEmbedButton = document.getElementById("insertEmbedButton");
    const doneEmbedButton = document.getElementById("doneEmbedButton");
    const cancelEmbedButton = document.getElementById("cancelEmbedButton");
    const modelViewerContainer = document.getElementById("modelViewerContainer");
    const embedViewer = document.getElementById("embedViewer");
    const deleteModelButton = document.getElementById("deleteModelButton");
    const modelName = document.getElementById("modelName");

    insertEmbedButton.disabled = true;
    doneEmbedButton.disabled = true;

    addModelButton.addEventListener("click", () => {
        embedModal.showModal();
        embedCodeInput.value = "";
        embedPreview.classList.add("hidden");
        insertEmbedButton.disabled = true;
        doneEmbedButton.disabled = true;
    });

    embedCodeInput.addEventListener("input", () => {
        const embedCode = embedCodeInput.value.trim();
        const isSketchfab = /src="https:\/\/sketchfab\.com\/models\//.test(embedCode);
        insertEmbedButton.disabled = !isSketchfab;
    });

    insertEmbedButton.addEventListener("click", () => {
        const embedCode = embedCodeInput.value.trim();
        const urlMatch = embedCode.match(/src="([^"]+)"/);
        
        if (urlMatch) {
            const embedUrl = urlMatch[1];
            embedPreview.src = embedUrl;
            embedPreview.classList.remove("hidden");
            doneEmbedButton.disabled = false;
        } else {
            alert("Invalid embed code. Please enter a complete Sketchfab embed code.");
        }
    });

    doneEmbedButton.addEventListener("click", async () => {
        const embedUrl = embedPreview.src;
        embedViewer.src = embedUrl;
        modelViewerContainer.classList.remove("hidden");
        embedModal.close();
        addModelButton.style.display = "none";

        // Extract model ID from the embed URL
        const modelIdMatch = embedUrl.match(/models\/([a-zA-Z0-9]+)/);
        if (modelIdMatch) {
            const modelId = modelIdMatch[1];
            try {
                // Fetch model details from Sketchfab API
                const response = await fetch(`https://api.sketchfab.com/v3/models/${modelId}`);
                const data = await response.json();
                const editName =  '✎ ' + data.name;
                modelName.textContent = editName || "Model Name Unavailable";
            } catch (error) {
                modelName.textContent = "Model Name Unavailable";
            }
        }
    });

    cancelEmbedButton.addEventListener("click", () => {
        embedModal.close();
    });

    deleteModelButton.addEventListener("click", () => {
        embedViewer.src = "";
        modelViewerContainer.classList.add("hidden");
        addModelButton.style.display = "block";
        modelName.textContent = "";
    });
});