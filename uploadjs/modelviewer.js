document.addEventListener('DOMContentLoaded', () => {
    const addModelButton = document.getElementById('addModelButton');
    const modelInput = document.getElementById('modelInput');
    const modelViewerContainer = document.getElementById('modelViewerContainer');
    const modelName = document.getElementById('modelName');
    const threeCanvas = document.getElementById('threeCanvas');
    const deleteModelButton = document.getElementById('deleteModelButton');

    let scene, camera, renderer, controls;
    let currentModel;


    function initThreeJS() {
        scene = new THREE.Scene();

        // Fixed camera setup
        camera = new THREE.PerspectiveCamera(45, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);  // Positioned farther back to provide space for larger models
        camera.lookAt(0, 0, 0);  // Always looking at the origin

        renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, antialias: true, alpha: true });
        renderer.setPixelRatio(10);
        // renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-120, -120, 120);
        scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(120, 120, -120);
        scene.add(directionalLight2);


        // Fixed controls setup to allow interaction without affecting camera position
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
        controls.update();

        animate();
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        // Only update renderer and camera aspect ratio on resize
        camera.aspect = threeCanvas.clientWidth / threeCanvas.clientHeight;
        camera.updateProjectionMatrix();
        // renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function fitModelToView(object) {
        // Center and scale the model to fit within the camera's fixed view
        const boundingBox = new THREE.Box3().setFromObject(object);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        // Calculate the required scale to fit model within the camera's view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;  // Adjust the '5' value if the model needs more space

        object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        object.scale.set(scale, scale, scale);

        controls.update();
        renderer.render(scene, camera);
    }

    function clearScene() {
        if (currentModel) {
            scene.remove(currentModel);
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            currentModel = null;
        }
    }

    addModelButton.addEventListener('click', () => {
        modelInput.click();
    });

    modelInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            modelName.textContent = `Model: ${file.name}`;
            const fileType = file.name.split('.').pop().toLowerCase();

            clearScene();

            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result;

                if (fileType === 'glb' || fileType === 'gltf') {
                    const loader = new THREE.GLTFLoader();
                    loader.parse(data, '', (gltf) => {
                        currentModel = gltf.scene;
                        scene.add(currentModel);
                        fitModelToView(currentModel);
                    });
                } else if (fileType === 'obj') {
                    const loader = new THREE.OBJLoader();
                    const objDataURL = URL.createObjectURL(file);
                    loader.load(objDataURL, (object) => {
                        currentModel = object;
                        scene.add(currentModel);
                        fitModelToView(currentModel);
                        URL.revokeObjectURL(objDataURL);
                    });
                } else if (fileType === 'stl') {
                    const loader = new THREE.STLLoader();
                    const geometry = loader.parse(data);
                    const material = new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true });
                    currentModel = new THREE.Mesh(geometry, material);
                    scene.add(currentModel);
                    fitModelToView(currentModel);
                } else {
                    console.error("Unsupported file type");
                }

                // Show the canvas and delete button, hide the add model button
                modelViewerContainer.classList.remove('hidden');
                deleteModelButton.classList.remove('hidden');
                addModelButton.style.display = 'none';
            };

            if (fileType === 'glb' || fileType === 'gltf' || fileType === 'stl') {
                reader.readAsArrayBuffer(file);
            } else if (fileType === 'obj') {
                reader.readAsDataURL(file);
            }
        }
    });

    deleteModelButton.addEventListener('click', () => {
        modelInput.value = '';
        clearScene();

        modelViewerContainer.classList.add('hidden');
        deleteModelButton.classList.add('hidden');
        addModelButton.style.display = 'block';
    });

    initThreeJS();
});
