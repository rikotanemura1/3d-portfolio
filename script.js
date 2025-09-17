// Basic Three.js setup with interactive controls and starfield
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

// Configure camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
// Position the camera so the torus knot sits front and center.  A zero Y value
// centers the 3D object vertically in the viewport.  Keeping the Z
// distance similar to before preserves the same zoom level.
camera.position.set(0, 0, 60);

// Configure renderer and enable transparency
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create an interactive Torus Knot centerpiece
const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x0078f0,
  metalness: 0.6,
  roughness: 0.4,
  emissive: 0x000000,
  emissiveIntensity: 0.5
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add subtle ambient and directional lighting for depth
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(20, 40, 60);
scene.add(directionalLight);

// Generate a starfield backdrop
function createStarField(numStars = 1000, spread = 1000) {
  const positions = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * spread;
    const y = (Math.random() - 0.5) * spread;
    const z = (Math.random() - 0.5) * spread;
    positions.push(x, y, z);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8
  });
  return new THREE.Points(starGeometry, starMaterial);
}
const stars = createStarField(1500, 2000);
scene.add(stars);

// Add OrbitControls for interactive camera movement
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 120;
controls.minDistance = 30;

// Animation loop with color shifting and damped controls
function animate() {
  requestAnimationFrame(animate);
  // Rotate the torus knot slowly
  torusKnot.rotation.x += 0.004;
  torusKnot.rotation.y += 0.008;
  // Hue shift the torus color over time
  const time = performance.now() * 0.0002;
  const hue = (time % 1);
  torusKnot.material.color.setHSL(hue, 0.65, 0.55);
  // Spin the starfield gently to create depth
  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.00025;
  // Update controls
  controls.update();
  // Render the scene
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});