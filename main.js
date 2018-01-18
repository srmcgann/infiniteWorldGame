function process(){
  stats.begin();

  controls.update( 1/60 );
  handleCamera();
  handleObjects();
  renderer.render( scene, camera );

  stats.end();
  requestAnimationFrame(process);
}

function init(){
  ng = new LCG();
  ng.setSeed(1019);
  stats = new Stats();

  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );
  ng.setSeed(1019);
  cubeCount=90
  cubeColors=['#1f8','#18f']
  fieldRadius=150
    //w=c.width/2,h=c.height/2,t=0
  hud=new Image()
  showHud = false;
  hud.src="hud1.png"
  //ctx=x
}

function handleObjects(){
  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( center, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

   if(intersects.length > 0){
     intersect = intersects[0].object;
   }
    if ( intersect.name != 'ceilingPlane' && intersect.name != 'floorPlane' ) {
		intersect.material.color.set( 0xffff00 );
    }

  scene.traverse (function (object) {
      if (object.name == 'cube')
      {
          object.rotation.x += .02;

          if(camera.position.z - object.position.z > fieldRadius)object.position.z += fieldRadius*2;
          if(camera.position.z - object.position.z < -fieldRadius)object.position.z -= fieldRadius*2;
          if(camera.position.x - object.position.x > fieldRadius)object.position.x += fieldRadius*2;
          if(camera.position.x - object.position.x < -fieldRadius)object.position.x -= fieldRadius*2;
      }
  });
}

function loadScene(){

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 50,130)

  // ( FOV, aspectRatio, near clipping, far clipping)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  raycaster = new THREE.Raycaster();
  center = new THREE.Vector2(0,0);
  raycaster.setFromCamera( center, camera );
  raycaster.near = 0; raycaster.far = 20;

  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new THREE.FirstPersonControls( camera );
				controls.movementSpeed = 15;
				controls.lookSpeed = 0.2;
				controls.lookVertical = true;

	light = new THREE.DirectionalLight( 0xddffdd, 0.8 );
	light.position.set( -80, 80, 80 );
	scene.add(light);
	light = new THREE.DirectionalLight( 0xddddff, 0.8 );
	light.position.set( 130, 80, 160 );
	scene.add(light);
	light = new THREE.DirectionalLight( 0x8888ff, 0.8 );
	light.position.set( 130, -80, 120 );
	scene.add(light);
  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  scene.add( light );

  //ceiling
  ceilingPlane = new THREE.GridHelper( 900, 200, 0x8888ff, 0x8888ff );
  ceilingPlane.position.y=20;
  ceilingPlane.name = 'ceilingPlane';
  scene.add(ceilingPlane);


  //floor
  floorPlane = new THREE.GridHelper( 900, 200, 0xff0000, 0xff0000 );
  floorPlane.position.y=-20;
  floorPlane.name = 'floorPlane';
  scene.add(floorPlane);

  geometry = new THREE.CubeGeometry(1,1,1)

  for ( var i = 0; i < cubeCount; i ++ ) {
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
					object.position.x = ng.nextFloatRange(-fieldRadius, fieldRadius);
					object.position.y = ng.nextFloatRange(-15,15);
					object.position.z = ng.nextFloatRange(-fieldRadius, fieldRadius);
					object.rotation.x = ng.nextFloatRange(2,10);
					object.rotation.y = ng.nextFloatRange(2,10);
					object.rotation.z = ng.nextFloatRange(2,10);
		      size =  ng.nextFloatRange(2, 5);
					object.scale.x = size
					object.scale.y = size
					object.scale.z = size
          object.name = 'cube';
					scene.add( object );
				}

  camera.position.z = 5;

}

function handleCamera(){
  if(camera.position.y > 19)camera.position.y = 19;
  if(camera.position.y < -19)camera.position.y = -19;
}

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );

init();
loadScene();
process();
