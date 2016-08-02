/* global THREE window document requestAnimationFrame Stats*/

var scene;
var camera;
var renderer;
var stats;

init();
animate();

/**
 * The initial function that setups the scene
 */
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xf0f0f0);
  document.body.appendChild(renderer.domElement);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // var cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  var geometry = new THREE.BoxGeometry(20, 20, 20);

  // ============================= WHERE THE OBJECTS ARE ADDED ============================= //
  for (var i = 0; i < 1500; i++) {
    var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    }));

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    scene.add(object);
  }

  // ============================= PLANE ============================= //

  var planeGeometry = new THREE.BoxGeometry(50, 0.01, 50);
  planeGeometry.scale(20, 1, 20);
  var planeMaterial = new THREE.LineBasicMaterial({color: 65532, opacity: 0.25, transparent: true, alphaTest: 0.25});
  var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  scene.add(planeMesh);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  var light = new THREE.DirectionalLight(0xffffff, 0.35);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  camera.position.z = 5;

  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
}

/**
 * the animate function
 */
function animate() {
  requestAnimationFrame(animate, renderer.domElement);

  render();
  stats.update();
}

/**
 * This will create a loop that causes the renderer to draw the scene 60 times per second
 */
function render() {
  renderer.render(scene, camera);
}
