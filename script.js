// Basic Three.js setup with an interactive 3D element that responds to scroll
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

// Configure camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
// Position the camera so the 3D element is centred in the viewport
camera.position.set(0, 0, 60);

// Configure renderer and enable transparency
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create a torus (donut) geometry to showcase a 3D element
const geometry = new THREE.TorusGeometry(10, 3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0xff78ff,
  metalness: 0.6,
  roughness: 0.4,
  emissive: 0x0,
  emissiveIntensity: 0.2
});
const donut = new THREE.Mesh(geometry, material);
scene.add(donut);

// Add lighting to illuminate the 3D model
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(25, 50, 80);
scene.add(directionalLight);

// Add OrbitControls for user interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 120;
controls.minDistance = 30;

// Update the donut's rotation based on scroll position
function handleScroll() {
  const scrollY = window.scrollY;
  // Normalize scroll value to a factor; full rotation occurs per viewport height scrolled
  const rotationFactor = scrollY / window.innerHeight;
  donut.rotation.x = rotationFactor * Math.PI;
  donut.rotation.y = rotationFactor * 2 * Math.PI;
}
window.addEventListener('scroll', handleScroll);

// Animation loop: continue rendering and apply slight rotation for liveliness
function animate() {
  requestAnimationFrame(animate);
  // Slowly rotate the donut for subtle movement
  donut.rotation.y += 0.002;
  donut.rotation.x += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});