

function process(){
  stats.begin();

  controls.update( 1/60 );
  handleObjects();
  renderer.render( scene, camera );

  stats.end();
  requestAnimationFrame(process);
}

function init(){
  ng = new LCG();
  stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  scene = new THREE.Scene();

  // ( FOV, aspectRatio, near clipping, far clipping)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new THREE.FirstPersonControls( camera );
				controls.movementSpeed = 5;
				controls.lookSpeed = 0.05;
				controls.lookVertical = true;

  geometry = new THREE.BoxGeometry(1,1,1)
  material = new THREE.MeshBasicMaterial({ color:0xff0000, wireframe:true })

  //in THREE, a mesh is an object pairing a geometry and material to be added to the scene.
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube);


  /*
  object = new THREE.Mesh( new THREE.OctahedronGeometry( 75, 2 ), material );
  				object.position.set( 100, 0, 200 );
  				scene.add( object );
  */

  //add defaults to 0,0,0
  for(var i = 0; i < 300; i++){
    newCube = cube.clone();
    newCube.position.set(ng.nextFloatRange(0,100), ng.nextFloatRange(0,10), ng.nextFloatRange(0,100) )
    scene.add(newCube);
  }
  //scene.add(cube);

  camera.position.z = 5;
}

function handleObjects(){
  cube.rotation.x += .01;
  cube.rotation.y += .01;
}

init();
process();
