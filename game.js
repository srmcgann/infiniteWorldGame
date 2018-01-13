function P3D(X,Y,Z){
  let d=p=0
  X-=camX
  Y-=camY
  Z-=camZ
  d=Math.hypot(X,Z)
  p=Math.atan2(X,Z)-camYaw
  X=S(p)*d
  Z=C(p)*d
  d=Math.hypot(Y,Z)
  p=Math.atan2(Y,Z)-camPitch
  Y=S(p)*d
  Z=C(p)*d
  if(Z>0) return [w+X/Z*w,h+Y/Z*w,Z]
}


function handleCamera(){

	if(mx){
		camYawV+=mx/400;
		mx=0;
	}
	if(my){
		camPitchV+=my/400;
		my=0;
	}
  let PRS=playerRotateSpeed
  if(leftkey){
    camYawV-=PRS
  }
  if(rightkey){
    camYawV+=PRS
  }
  if(upkey){
    camPitchV-=PRS
  }
  if(downkey){
    camPitchV+=PRS
  }
  camYaw+=camYawV
  camPitch+=camPitchV
  if(camPitch>Math.PI/2)camPitch=Math.PI/2
  if(camPitch<-Math.PI/2)camPitch=-Math.PI/2
  camYawV/=2
  camPitchV/=2
  let V=playerSpeed*(shiftkey?3:1)
  if(wkey){
    camVX+=Math.sin(camYaw)*Math.cos(camPitch)*V
    camVY+=Math.sin(camPitch)*V
    camVZ+=Math.cos(camYaw)*Math.cos(camPitch)*V
  }
  if(akey){
    camVX+=Math.sin(camYaw-Math.PI/2)*V
    camVZ+=Math.cos(camYaw-Math.PI/2)*V
  }
  if(skey){
    camVX-=Math.sin(camYaw)*Math.cos(camPitch)*V
    camVY-=Math.sin(camPitch)*V
    camVZ-=Math.cos(camYaw)*Math.cos(camPitch)*V
  }
  if(dkey){
    camVX+=Math.sin(camYaw+Math.PI/2)*V
    camVZ+=Math.cos(camYaw+Math.PI/2)*V
  }
  camX+=camVX
  camY+=camVY
  camZ+=camVZ
  if(camY<ceiling+1)camY=ceiling+1
  if(camY>floor-1)camY=floor-1
  camVX/=1.5
  camVY/=1.5
  camVZ/=1.5
}


function Seg(x1,y1,z1,x2,y2,z2){
	this.a={x:x1,y:y1,z:z1};
	this.b={x:x2,y:y2,z:z2};
}


function Cube(x,y,z, scale=1, color = "#fff"){
	Q={};
  Q.hit = 15;
	Q.x=x;
	Q.y=y;
	Q.z=z;
  Q.c=color;
  Q.scale=scale;
	Q.s=[];
	Q.s.push(new Seg(-1,-1,-1,1,-1,-1));
	Q.s.push(new Seg(1,-1,-1,1,1,-1));
	Q.s.push(new Seg(1,1,-1,-1,1,-1));
	Q.s.push(new Seg(-1,1,-1,-1,-1,-1));
	Q.s.push(new Seg(-1,-1,1,1,-1,1));
	Q.s.push(new Seg(1,-1,1,1,1,1));
	Q.s.push(new Seg(1,1,1,-1,1,1));
	Q.s.push(new Seg(-1,1,1,-1,-1,1));
	Q.s.push(new Seg(-1,-1,-1,-1,-1,1));
	Q.s.push(new Seg(1,-1,-1,1,-1,1));
	Q.s.push(new Seg(1,1,-1,1,1,1));
	Q.s.push(new Seg(-1,1,-1,-1,1,1));
	return Q;
}


function rotateShape(shape, yaw, pitch, roll){
	var x,y,z,p,d;
	for(var i=0;i<shape.s.length;++i){
		for(var j=2;j--;){
			if(j){
				x=shape.s[i].a.x;
				y=shape.s[i].a.y;
				z=shape.s[i].a.z;
			}else{
				x=shape.s[i].b.x;
				y=shape.s[i].b.y;
				z=shape.s[i].b.z;
			}
			d=Math.sqrt(x*x+z*z);
			p=Math.atan2(x,z);
			x=Math.sin(p+yaw)*d;
			z=Math.cos(p+yaw)*d;
			d=Math.sqrt(y*y+z*z);
			p=Math.atan2(y,z);
			y=Math.sin(p+pitch)*d;
			z=Math.cos(p+pitch)*d;
			d=Math.sqrt(x*x+y*y);
			p=Math.atan2(x,y);
			x=Math.sin(p+roll)*d;
			y=Math.cos(p+roll)*d;
			if(j){
				shape.s[i].a.x=x;
				shape.s[i].a.y=y;
				shape.s[i].a.z=z;
			}else{
				shape.s[i].b.x=x;
				shape.s[i].b.y=y;
				shape.s[i].b.z=z;
			}
		}
	}
}

function mangleShape(shape, amount){
	var x,y,z,p,d;
	for(var i=0;i<shape.s.length;++i){
		for(var j=2;j--;){
			if(j){
				x=shape.s[i].a.x;
				y=shape.s[i].a.y;
				z=shape.s[i].a.z;
			}else{
				x=shape.s[i].b.x;
				y=shape.s[i].b.y;
				z=shape.s[i].b.z;
			}
			x+=Math.random()*amount-amount/2;
      y+=Math.random()*amount-amount/2;
      z+=Math.random()*amount-amount/2;
			if(j){
				shape.s[i].a.x=x;
				shape.s[i].a.y=y;
				shape.s[i].a.z=z;
			}else{
				shape.s[i].b.x=x;
				shape.s[i].b.y=y;
				shape.s[i].b.z=z;
			}
		}
	}
}

function drawFloorAndCeiling(){

  let lw=X=Y=Z=P1=P2=0
  for(let l=0;l<2;++l){
    Y=l?1:ceiling
    for(let m=0;m<6;++m){
      Z=(m-3)*gridSegs+Math.round(camZ/gridSegs)*gridSegs+gridSegs/2
      for(let k=0;k<6;++k){
        X=(k-3)*gridSegs+Math.round(camX/gridSegs)*gridSegs+gridSegs/2
        for(let i=0;i<gridSegs;i++){
          for(let j=0;j<gridSegs;j++){
            let d=Math.hypot(i-gridSegs/2+.5+X-camX,j-gridSegs/2+.5+Z-camZ)
            let a=1-Math.pow(d/(gridSegs*2.99),6)
            if(a>.1){
              x.globalAlpha=a
              if((P1=P3D(i-gridSegs/2+.5+X,Y,j-gridSegs/2+.5+Z)) && (P2=P3D(i-gridSegs/2+.5+X,Y,j-gridSegs/2+1.5+Z))){
                x.beginPath()
                if(!i){
                  lw=100
                  x.strokeStyle="#16f"
                }else{
                  lw=50
                  x.strokeStyle="#248"
                }
                x.lineWidth=lw/(1+P2[2]*P2[2])
                x.moveTo(...P1)
                x.lineTo(...P2)
                x.stroke()
              }
              if((P1=P3D(i-gridSegs/2+.5+X,Y,j-gridSegs/2+.5+Z)) && (P2=P3D(i-gridSegs/2+1.5+X,Y,j-gridSegs/2+.5+Z))){
                x.beginPath()
                if(!j){
                  lw=100
                  x.strokeStyle="#16f"
                }else{
                  lw=50
                  x.strokeStyle="#248"
                }
                x.lineWidth=lw/(1+P2[2]*P2[2])
                x.moveTo(...P1)
                x.lineTo(...P2)
                x.stroke()
              }
            }
          }
        }
      }
    }
    x.globalAlpha=1
  }
}


function clearScreen(){
  x.globalAlpha=.45
  x.fillStyle="#000"
  x.fillRect(0,0,w*2,h*2)
  x.globalAlpha=1
  if(showHud)x.drawImage(hud,0,0,w*2,h*2)
  x.fillStyle="#4F4"
  x.font = "30px Arial"
  x.fillText('collected: '+playerCubeScore, 20, 20);
}


function drawShapes(){
  for(i=terrain.length;i--;){
		X=terrain[i].x
		Y=terrain[i].y-terrain[i].scale/2
		Z=terrain[i].z
    SC=terrain[i].scale
		let point=P3D(X,Y,Z)
    if(point){
      a=.75-Math.pow(point[2]/fieldRadius,6)*.75
      x.globalAlpha=a<0?0:a
      x.strokeStyle=terrain[i].c;
      x.lineWidth=40/(1+point[2])
      x.beginPath()
      for(let j=12;j--;){
        pta=P3D(X+terrain[i].s[j].a.x,Y+terrain[i].s[j].a.y*SC,Z+terrain[i].s[j].a.z)
        ptb=P3D(X+terrain[i].s[j].b.x,Y+terrain[i].s[j].b.y*SC,Z+terrain[i].s[j].b.z)
        if(pta&&ptb){
          x.moveTo(...pta)
          x.lineTo(...ptb)
        }
      }
      x.stroke()
    }
	}

  for(i=shapes.length;i--;){
		X=shapes[i].x
		Y=shapes[i].y
		Z=shapes[i].z
    SC=shapes[i].scale
		let point=P3D(X,Y,Z)
    if(point){
      a=.75-Math.pow(point[2]/fieldRadius,6)*.75
      x.globalAlpha=a<0?0:a
      x.strokeStyle=shapes[i].c;
      x.lineWidth=40/(1+point[2])
      x.beginPath()
      for(let j=12;j--;){
        pta=P3D(X+shapes[i].s[j].a.x*SC,Y+shapes[i].s[j].a.y*SC,Z+shapes[i].s[j].a.z*SC)
        ptb=P3D(X+shapes[i].s[j].b.x*SC,Y+shapes[i].s[j].b.y*SC,Z+shapes[i].s[j].b.z*SC)
        if(pta&&ptb){
          x.moveTo(...pta)
          x.lineTo(...ptb)
        }
      }
      x.stroke()
    }
	}
  x.globalAlpha=1
}


function handleShapes(){
  for(let i=shapes.length-1;i>0;--i){
    if(camX-shapes[i].x>fieldRadius)shapes[i].x+=fieldRadius*2
    if(camX-shapes[i].x<-fieldRadius)shapes[i].x-=fieldRadius*2
    if(camZ-shapes[i].z>fieldRadius)shapes[i].z+=fieldRadius*2
    if(camZ-shapes[i].z<-fieldRadius)shapes[i].z-=fieldRadius*2
    rotateShape(shapes[i],.01,.02,i/1000)

    if(camX-shapes[i].x<playerRadius && camX-shapes[i].x>-playerRadius &&
      camZ-shapes[i].z<playerRadius && camZ-shapes[i].z>-playerRadius && shapes[i].hit == 15){
        playerCubeScore++; shapes[i].hit-- }

    if(shapes[i].hit < 15){
      rotateShape(shapes[i],.04,.07,-i/1000)
      mangleShape(shapes[i],.5);
      shapes[i].y -= .2;
      shapes[i].hit--;
    }

    if(shapes[i].hit < 0)shapes.splice(i,1);

  }
}


function process(){

  handleCamera()
  handleShapes()
  clearScreen()
  drawFloorAndCeiling()
  drawShapes()

  t+=1/60;
  requestAnimationFrame(process);
}


function loadScene(){
  shapes=[]
  terrain=[]
  for(let i=0;i<cubeCount;++i){
    shapes.push(new Cube(
      ng.nextFloatRange(-fieldRadius, fieldRadius),
      ng.nextFloatRange(floor-ceiling-2, floor-1), //floor-1-Math.random()*(floor-ceiling-2),
      ng.nextFloatRange(-fieldRadius, fieldRadius),
      1,  //1+Math.random()-.5, //scale
      cubeColors[ng.nextIntRange(0,2)]
    ))
  }

  for(let i=0;i<100;++i){
    terrain.push(new Cube(
      ng.nextFloatRange(-fieldRadius, fieldRadius),
      0       ,
      ng.nextFloatRange(-fieldRadius, fieldRadius),
      1,
      '#00f'
    ))
  }

  terrain.push(new Cube(
    0,
    0,
    0,
    1,
    '#fff'
  ))
}


onkeydown=function(e){
  switch(e.which){
    case 16:shiftkey=1;break;
    case 32:spacekey=1;break;
    case 37:leftkey=1;break;
    case 38:upkey=1;break;
    case 39:rightkey=1;break;
    case 40:downkey=1;break;
    case 17:ctrlkey=1;break;
    case 87:wkey=1;break;
    case 65:akey=1;break;
    case 83:skey=1;break;
    case 68:dkey=1;break;
    case 72:hkey=1;break;
  }
}


onkeyup=function(e){
  switch(e.which){
    case 16:shiftkey=0;break;
    case 32:spacekey=0;break;
    case 37:leftkey=0;break;
    case 38:upkey=0;break;
    case 39:rightkey=0;break;
    case 40:downkey=0;break;
    case 17:ctrlkey=0;break;
    case 87:wkey=0;break;
    case 65:akey=0;break;
    case 83:skey=0;break;
    case 68:dkey=0;break;
    case 72:hkey=0;showHud = !showHud; break;
  }
}

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock
c.onclick = function() {c.requestPointerLock()}
canvas.addEventListener("mousemove", mouse, true);
c.onmousedown=function(event){event.preventDefault();}
c.addEventListener("mousedown", function(event) {
  switch (event.which) {
    case 1: leftbutton=true; break;
    case 3: rightbutton=true; break;
  }
});
c.addEventListener("mouseup", function(event) {
  switch (event.which) {
    case 1: leftbutton=false; break;
    case 3: rightbutton=false; break;
  }
});

function mouse(e) {

	var movementX = e.movementX ||
		e.mozMovementX          ||
		e.webkitMovementX       ||
		0;

	var movementY = e.movementY ||
		e.mozMovementY      ||
		e.webkitMovementY   ||
		0;

	mx += movementX;
	my += movementY;
}

ng = new LCG();
ng.setSeed(1019);
cubeCount=90
cubeColors=['#ff0','#f00','#f80']
fieldRadius=150
gridSegs=8
playerRotateSpeed=.025
playerSpeed=.1
playerCubeScore=0;
playerRadius = 9;
floor=1
ceiling=-6
camVX=camVY=camVZ=camX=camY=camZ=camPitchV=camYawV=camPitch=0
camYaw=1
mx=my=leftbutton=rightbutton=shiftkey=ctrlkey=spacekey=upkey=downkey=leftkey=rightkey=wkey=akey=skey=dkey=0
w=c.width/2,h=c.height/2,t=0
hud=new Image()
showHud = false;
hud.src="hud1.png"
loadScene()
process()
