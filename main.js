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
  ng.setSeed(1019);
  cubeCount=90
  cubes=[];
  cubeColors=['#1f8','#18f']
  fieldRadius=150
  gridSegs=8
  playerRotateSpeed=.025
  playerSpeed=.1
  playerCubeScore=0;
  playerRadius = 5;
  floor=1
  ceiling=-6
  camVX=camVY=camVZ=camPitchV=camYawV=camPitch=0
  camX=40
  camY=0
  camZ=25
  camYaw=3.6
  lineSubs=1
  mx=my=leftbutton=rightbutton=shiftkey=ctrlkey=spacekey=upkey=downkey=leftkey=rightkey=wkey=akey=skey=dkey=ckey=fkey=0
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


}

function loadScene(){

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0, 75,130)

  // ( FOV, aspectRatio, near clipping, far clipping)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  raycaster = new THREE.Raycaster();
  center = new THREE.Vector2(0,0);
  raycaster.setFromCamera( center, camera );
  raycaster.near = 0; raycaster.far = 5;

  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new THREE.FirstPersonControls( camera );
				controls.movementSpeed = 10;
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

  //ceiling
  geometry = new THREE.PlaneGeometry(1,1,60,60)
  material = new THREE.MeshLambertMaterial({ color:0x8888ff, wireframe: true })
  ceilingPlane = new THREE.Mesh(geometry, material);
  ceilingPlane.scale.set(fieldRadius*2, fieldRadius*2, fieldRadius*2)
  ceilingPlane.position.y=20;
  ceilingPlane.rotation.x= Math.PI/2;
  ceilingPlane.name = 'ceilingPlane';

  scene.add(ceilingPlane);


  //floor
  material = new THREE.MeshLambertMaterial({ color:0x880000, wireframe: true })
  floorPlane = new THREE.Mesh(geometry, material);
  floorPlane.scale.set(fieldRadius*2, fieldRadius*2, fieldRadius*2)
  floorPlane.position.y=-20;
  floorPlane.rotation.x= -Math.PI/2;
  floorPlane.name = 'floorPlane';
  scene.add(floorPlane);



  geometry = new THREE.CubeGeometry(1,1,1)
  material = new THREE.MeshLambertMaterial({ color:0xff2288 })


  for ( var i = 0; i < cubeCount; i ++ ) {
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
					object.position.x = ng.nextFloatRange(-fieldRadius, fieldRadius);
					object.position.y = ng.nextFloatRange(floor,ceiling);
					object.position.z = ng.nextFloatRange(-fieldRadius, fieldRadius);
					object.rotation.x = ng.nextFloatRange(2,10);
					object.rotation.y = ng.nextFloatRange(2,10);
					object.rotation.z = ng.nextFloatRange(2,10);
		      size =  ng.nextFloatRange(2, 5);
					object.scale.x = size
					object.scale.y = size
					object.scale.z = size
          cubes.push[object];
					scene.add( object );
				}

  camera.position.z = 5;


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
