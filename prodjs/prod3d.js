function initThreeJS() {
    scene = new THREE.Scene();

    // Fixed camera setup
    camera = new THREE.PerspectiveCamera(45, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Renderer targeting threeCanvas
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threeCanvas'),  // Use your existing canvas
        antialias: true,
        alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-120, -120, 120);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(120, 120, -120);
    scene.add(directionalLight2);

    // Orbit controls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controls.update();

    loadDefaultModel();  // Load the default model
    animate();
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = threeCanvas.clientWidth / threeCanvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
}