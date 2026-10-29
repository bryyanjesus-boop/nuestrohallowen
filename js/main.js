import * as THREE from 'three';
import {OrbitControls} from '../vendor/OrbitControls.js';
import {MENSAJES} from './mensajes.js';
const $=s=>document.querySelector(s);
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.45,...o});
const sph=new THREE.SphereGeometry(1,24,16),cyl=new THREE.CylinderGeometry(1,1,1,20),cone=new THREE.ConeGeometry(1,1,4),box=new THREE.BoxGeometry(1,1,1);
const S=(g,m,p=[0,0,0],s=1)=>{const o=new THREE.Mesh(g,m);o.position.set(...p);o.scale.set(...(typeof s=='number'?[s,s,s]:s));o.castShadow=true;return o};
const B=(m,p,s)=>S(sph,m,p,s);
// ---------- Escena (paleta rosa oscuro / cielo fucsia) ----------
const R=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const bg=new THREE.Color(0x16040f),scene=new THREE.Scene();scene.background=bg;scene.fog=new THREE.Fog(0x16040f,18,48);
const cam=new THREE.PerspectiveCamera(50,1,.1,100);cam.position.set(3,4,11);
const ctl=new OrbitControls(cam,R.domElement);Object.assign(ctl,{enableDamping:true,minDistance:4,maxDistance:14,maxPolarAngle:1.45,enablePan:false});ctl.target.set(3,1.3,2.4);
scene.add(new THREE.HemisphereLight(0xff9ad0,0x8a2a5a,.75));
const sun=new THREE.DirectionalLight(0xffc2a0,.95);sun.position.set(4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10});scene.add(sun);
const pinkL=new THREE.PointLight(0xff5fa8,30,16);pinkL.position.set(-4,3,3);scene.add(pinkL);
const ground=S(new THREE.CircleGeometry(1,48),M(0x8f2d60,{roughness:1}),[0,0,0],[14,14,1]);ground.rotation.x=-Math.PI/2;ground.castShadow=false;ground.receiveShadow=true;scene.add(ground);
// mundo alrededor: suelo lejano, colinas y bosque rosado
const far=S(new THREE.CircleGeometry(1,48),M(0x3a0f2a,{roughness:1}),[0,-.03,0],[90,90,1]);far.rotation.x=-Math.PI/2;far.castShadow=false;scene.add(far);
for(let i=0;i<9;i++){const a=i/9*6.283+.3,r=30+Math.random()*9;scene.add(B(M(0x4a1236,{roughness:1}),[Math.sin(a)*r,0,Math.cos(a)*r],[9,3+Math.random()*2.5,9]))}
const FT=[],NT=26,tk=new THREE.InstancedMesh(cyl,M(0x5a2a3a),NT),tf=new THREE.InstancedMesh(sph,M(0xffffff),NT*2),d2=new THREE.Object3D();
for(let i=0;i<NT;i++){const a=i/NT*6.283+Math.random()*.2,r=17+Math.random()*13,x=Math.sin(a)*r,z=Math.cos(a)*r,h=2+Math.random()*1.5,c=new THREE.Color([0xff6fa5,0xe0457f,0xff8ec0,0xc2185b][i%4]);
 FT.push([x,z,h]);d2.position.set(x,h/2,z);d2.scale.set(.3,h,.3);d2.updateMatrix();tk.setMatrixAt(i,d2.matrix);
 d2.position.set(x,h+.8,z);d2.scale.setScalar(1.5+Math.random()*.6);d2.updateMatrix();tf.setMatrixAt(i*2,d2.matrix);tf.setColorAt(i*2,c);
 d2.position.set(x+.4,h+1.8,z);d2.scale.setScalar(1);d2.updateMatrix();tf.setMatrixAt(i*2+1,d2.matrix);tf.setColorAt(i*2+1,c)}scene.add(tk,tf);
const fl=new THREE.InstancedMesh(sph,M(0xffffff),90),dm=new THREE.Object3D(),fc=[0xffd6e6,0xffffff,0xffe27a,0xff7ab8];
for(let i=0;i<90;i++){const a=Math.random()*6.28,r=3+Math.random()*9.5;dm.position.set(Math.cos(a)*r,.12,Math.sin(a)*r);dm.scale.setScalar(.1+Math.random()*.06);dm.updateMatrix();fl.setMatrixAt(i,dm.matrix);fl.setColorAt(i,new THREE.Color(fc[i%4]))}scene.add(fl);
scene.add(B(M(0xfff1c9,{emissive:0xffe9a8,emissiveIntensity:.9,fog:false}),[-8,10,-18],3));
const sp=[];for(let i=0;i<280;i++){const a=Math.random()*6.283,y=.1+Math.random()*.9,r=Math.sqrt(1-y*y)*55;sp.push(Math.cos(a)*r,y*55,Math.sin(a)*r)}
scene.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(sp,3)),new THREE.PointsMaterial({size:.55,color:0xffe14a,fog:false})));
const ff=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:120},()=>Math.random()-.5),3)),fp=ff.attributes.position;
const ffM=new THREE.PointsMaterial({size:.18,color:0xffe27a,transparent:true,opacity:.9,depthWrite:false});scene.add(new THREE.Points(ff,ffM));
const tree=(x,z,c)=>{scene.add(S(cyl,M(0x7a3a3a),[x,1,z],[.25,2,.25]),B(M(c),[x,2.8,z],1.4),B(M(c),[x+.4,3.6,z],.9))};tree(-11,-7,0xff6fa5);tree(12,-5,0xe0457f);tree(-13,2,0xff8ec0);
const roof=S(cone,M(0xc2185b),[4,3.1,-13],[2.9,1.6,2.9]);roof.rotation.y=Math.PI/4;
scene.add(S(box,M(0xffd6e6),[4,1.1,-13],[3.2,2.2,2.6]),roof,S(box,M(0xffd27a,{emissive:0xffb347,emissiveIntensity:1}),[4.3,1.2,-11.68],[.6,.6,.05]));
const lantern=(x,z)=>{scene.add(S(cyl,M(0x5a2a40),[x,1.1,z],[.05,2.2,.05]),B(M(0xffc27a,{emissive:0xff9a3a,emissiveIntensity:1.2}),[x,2.35,z],.25));const l=new THREE.PointLight(0xffa04d,10,9);l.position.set(x,2.3,z);scene.add(l)};lantern(-3.6,1.5);lantern(4.2,-1.2);
// telarañas
const webTx=(()=>{const k=document.createElement('canvas');k.width=k.height=128;const g=k.getContext('2d');g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.5;for(let i=0;i<8;i++){const a=i/8*6.283;g.beginPath();g.moveTo(64,64);g.lineTo(64+60*Math.cos(a),64+60*Math.sin(a));g.stroke()}for(let r=12;r<=60;r+=12){g.beginPath();for(let i=0;i<=8;i++){const a=i/8*6.283,rr=r*(i%2?.88:1);g[i?'lineTo':'moveTo'](64+rr*Math.cos(a),64+rr*Math.sin(a))}g.stroke()}return new THREE.CanvasTexture(k)})();
const mWeb=new THREE.MeshBasicMaterial({map:webTx,transparent:true,depthWrite:false,side:THREE.DoubleSide});
const web=(x,y,z,s)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mWeb);m.position.set(x,y,z);m.scale.setScalar(s);m.rotation.y=Math.atan2(-x,-z);scene.add(m)};
[[-11,-7],[12,-5],[-13,2]].forEach(([x,z])=>{const r=Math.hypot(x,z);web(x-x/r*1.7,2.9,z-z/r*1.7,2.2)});web(2.9,1.7,-11.6,1.4);web(5.2,2.6,-11.6,1.1);
const webC=(g,x,y,z,s)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),mWeb);m.position.set(x,y,z);g.add(m)};
FT.forEach(([x,z,h],i)=>{if(i%2==0){const r=Math.hypot(x,z);web(x-x/r*1.7,h+.8,z-z/r*1.7,2+Math.random())}});
// ---------- Calabaza con carita feliz ----------
const mO=M(0xf08090,{roughness:.5}),mGr=M(0x7a9a40),mPk=M(0xff7ab8,{roughness:.4}),mBow=M(0xe0457f,{roughness:.5}),mHt=new THREE.MeshBasicMaterial({color:0x8a1650,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,side:THREE.DoubleSide}),mGl=new THREE.MeshBasicMaterial({color:0xffa83a,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,side:THREE.DoubleSide});
// carita tallada, pegada a la superficie elipsoidal con triángulos pequeños
const zs=(x,Y)=>1.17*Math.max(.02,1-(Math.abs(x)/1.17)**2.4-(Math.abs(Y-.94)/.94)**2.4)**(1/2.4)+.06;
const surf=gm=>{const ps=gm.attributes.position;for(let i=0;i<ps.count;i++){const x=ps.getX(i),Y=ps.getY(i)+.2;ps.setY(i,Y);ps.setZ(i,zs(x,Y))}return gm};
function strip(a,b,mat){const v=[];for(let i=0;i<a.length-1;i++)v.push(a[i][0],a[i][1],0,b[i][0],b[i][1],0,a[i+1][0],a[i+1][1],0,a[i+1][0],a[i+1][1],0,b[i][0],b[i][1],0,b[i+1][0],b[i+1][1],0);return new THREE.Mesh(surf(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(v,3))),mat)}
const poly=(pts,mat)=>new THREE.Mesh(surf(new THREE.ShapeGeometry(new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1]))))),mat);
const arr=(n,f)=>Array.from({length:n+1},(_,i)=>f(i/n)),mir=a=>a.map(p=>[-p[0],p[1]]);
const T=x=>.46+.26*(x/.62)**2,Bt=x=>T(x)-(.05+.26*(1-(x/.62)**2)),ew=x=>((x+.385)/.265)**2;
const EYT=arr(12,u=>{const x=-.65+u*.53;return [x,.96+.26*(1-ew(x))]}),EYB=EYT.map(([x,y])=>[x,y-.22*(1-ew(x))**.7-.02]);
const MT=arr(24,u=>{const x=-.62+u*1.24;return [x,T(x)]}),MB=MT.map(([x])=>[x,Bt(x)]),NO=[[-.09,.66],[.09,.66],[0,.84]];
const HT=(cx,cy)=>Array.from({length:24},(_,i)=>{const t=i/24*6.283;return [cx+.099*Math.sin(t)**3,cy+.0062*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))]});
const mTh=M(0xfff1e6,{roughness:.5,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6});
const mkFace=()=>[strip(EYT,EYB,mGl),strip(mir(EYT),mir(EYB),mGl),poly(NO,mGl),strip(MT,MB,mGl),poly(HT(-.84,.62),mHt),poly(HT(.84,.62),mHt),
 poly([[-.3,T(-.3)+.01],[-.14,T(-.14)+.01],[-.22,T(-.22)-.2]],mTh),poly([[.14,T(.14)+.01],[.3,T(.3)+.01],[.22,T(.22)-.2]],mTh),poly([[-.08,Bt(-.08)-.01],[.08,Bt(.08)-.01],[.08,Bt(.08)+.14],[-.08,Bt(-.08)+.14]],mTh)];
const bodyG=(()=>{const gm=new THREE.SphereGeometry(1,64,48),ps=gm.attributes.position,E=2.4;
 for(let i=0;i<ps.count;i++){let x=ps.getX(i),y=ps.getY(i),z=ps.getZ(i);const q=(Math.abs(x)**E+Math.abs(y)**E+Math.abs(z)**E)**(1/E);x/=q;y/=q;z/=q;
  const rr=Math.hypot(x,z);if(y>0)y-=.18*Math.exp(-((rr/.3)**2));const k=1+.05*Math.cos(10*Math.atan2(x,z))*rr;ps.setXYZ(i,x*k,y,z*k)}
 gm.computeVertexNormals();return gm})();
function pumpkin(){const g=new THREE.Group();
 g.add(S(bodyG,mO,[0,.94,0],[1.17,.94,1.17]),...mkFace());
 const lid=new THREE.Group();lid.position.set(0,1.72,-.55);g.add(lid);
 const l=new THREE.Group();l.position.z=.55;lid.add(l);
 l.add(B(mO,[0,.08,0],[.62,.22,.62]),S(cyl,mGr,[0,.35,0],[.09,.3,.09]));
 const tr=new THREE.Mesh(new THREE.TorusGeometry(.2,.045,8,16),mPk);tr.rotation.x=Math.PI/2;tr.position.y=.2;l.add(tr);
 return {g,lid,l}}
const P=pumpkin();P.g.scale.setScalar(1.65);scene.add(P.g);P.l.userData.tag='lid';
P.g.add(S(cyl,M(0x3a0a20),[0,1.83,0],[.45,.02,.45]));
const candies=new THREE.Group();P.g.add(candies);
[0xff9ec7,0xffd6e6,0xfff0a0,0x9fe0d0,0xff9a4a,0xffffff,0xff7ab8,0xffc2d8].forEach((c,i)=>candies.add(B(M(c),[Math.cos(i*.8)*.28,1.93+(i%3)*.05,Math.sin(i*.8)*.28],.13)));
const glow=new THREE.PointLight(0xff7ab8,0,6);glow.position.set(0,2.3,0);P.g.add(glow);
const spk=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:60},(_,i)=>i%3==1?1.95+Math.random():(Math.random()-.5)),3)),new THREE.PointsMaterial({size:.07,color:0xfff0a0,depthWrite:false}));P.g.add(spk);spk.visible=false;
[[-3,2.2,.4],[3.8,-2,.35],[-4.5,-2,.5]].forEach(([x,z,s])=>{const q=pumpkin();q.g.position.set(x,0,z);q.g.scale.setScalar(s);scene.add(q.g)});
let pk={open:false,k:0,cd:0};
function togglePumpkin(){if(boom)return;pk.open=!pk.open;sfx.open();
 if(pk.open&&Date.now()>pk.cd){pk.cd=Date.now()+30000;st.inv.dulce++;render();save();say('¡Salió un dulce de la calabaza! 🍬 (+1)')}else say(pk.open?'¡Luz mágica!':'Tapita cerrada.')}
// ---------- Gatitos (principal + bailarines) ----------
const mE=M(0x2a1a2a,{roughness:.2}),mP=M(0xff8fb8),mN=M(0x3a2a30);
function makePet(mat,kind='cat',bow=false){const g=new THREE.Group(),body=B(mat,[0,.45,0],[.45,.4,.55]),head=new THREE.Group(),tail=new THREE.Group(),ck=kind=='cat'||kind=='bunny';
 head.position.set(0,.95,.35);head.add(B(mat,[0,0,0],[.5,.44,.46]));
 for(const s of [-1,1]){
  if(kind=='cat'){const e=S(cone,mat,[s*.3,.4,0],[.2,.36,.2]);e.rotation.y=Math.PI/4;e.rotation.z=-s*.25;head.add(e,B(mP,[s*.3,.36,.1],.06))}
  if(kind=='dog')head.add(B(M(0x5a3a2a),[s*.44,.1,0],[.13,.3,.12]));
  if(kind=='bunny')head.add(B(mat,[s*.17,.72,0],[.1,.42,.07]),B(mP,[s*.17,.72,.05],[.05,.3,.03]));
  if(kind=='bear')head.add(B(mat,[s*.36,.34,0],.13))}
 if(!ck)head.add(B(M(0xffffff,{roughness:.8}),[0,-.1,.4],[.2,.14,.14]));
 const eyes=[-1,1].map(s=>{const e=B(mE,[s*.2,.05,.4],[.09,.12,.05]);head.add(e,B(M(0xffffff,{emissive:0xffffff}),[s*.2+.02,.1,.44],.025));return e});
 head.add(B(ck?mP:mN,[0,-.05,ck?.45:.54],.05),B(mP,[-.3,-.1,.38],[.08,.05,.03]),B(mP,[.3,-.1,.38],[.08,.05,.03]));
 if(bow){const m=M(0xff4f9a);head.add(B(m,[.36,.36,.14],[.1,.07,.06]),B(m,[.5,.36,.14],[.1,.07,.06]),B(M(0xffd27a),[.43,.36,.14],.04))}
 const legs=[[-.2,.25],[.2,.25],[-.2,-.25],[.2,-.25]].map(([x,z])=>{const l=S(cyl,mat,[x,.15,z],[.09,.3,.09]);g.add(l);return l});
 tail.position.set(0,.5,-.5);tail.rotation.x=-.5;tail.add(kind=='bunny'?B(M(0xffffff),[0,.12,0],.15):S(cyl,mat,[0,.3,0],[.07,.6,.07]));g.add(body,head,tail);return {g,body,head,tail,legs,eyes}}
const mW=M(0xfff6ea,{roughness:.8}),{g:CG,body,head,tail,legs,eyes}=makePet(mW,'cat',true);
CG.position.set(3,0,2.4);scene.add(CG);CG.userData.tag='cat';
const cat={face:0,sit:0,sleep:0,sitK:0,slK:0,pet:0,eat:0,cheer:0,j:-1,bt:2,bl:0,walk:false,dance:0};
// bola disco colorida + luces + animalitos esparcidos
const disco={on:false,k:0},ball=new THREE.Group();
const bgm=new THREE.IcosahedronGeometry(1,2).toNonIndexed(),cc=[];for(let i=0;i<bgm.attributes.position.count/3;i++){const c=new THREE.Color().setHSL(Math.random(),.95,.6);for(let j=0;j<3;j++)cc.push(c.r,c.g,c.b)}bgm.setAttribute('color',new THREE.Float32BufferAttribute(cc,3));
ball.add(S(cyl,M(0xffffff),[0,4,0],[.02,8,.02]),new THREE.Mesh(bgm,new THREE.MeshBasicMaterial({vertexColors:true})));
const beams=new THREE.Group();ball.add(beams);const bgeo=new THREE.ConeGeometry(1.3,9,14,1,true).translate(0,-4.5,0);
for(let i=0;i<8;i++){const p=new THREE.Group(),m=new THREE.Mesh(bgeo,new THREE.MeshBasicMaterial({transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.rotation.z=.6;p.rotation.y=i*Math.PI/4;p.add(m);beams.add(p)}
ball.position.set(0,16,0);scene.add(ball);
const dLs=[0,1].map(()=>{const l=new THREE.PointLight(0xff5fa8,0,22);scene.add(l);return l});
const ANI=[['cat',0xffa56a],['cat',0x9a8a8a],['cat',0x4a3f4f],['cat',0xffc2d8],['dog',0xd9a066],['dog',0x8a5a3a],['dog',0xf2e6d6],['bunny',0xffffff],['bunny',0xcfcfd8],['bunny',0xffd0e0],['bear',0xa8683a],['bear',0xf5f0ea]];
const dancers=ANI.map(([k,c],i)=>{const d=makePet(M(c,{roughness:.8}),k,false),a=i*2.4,r=3.4+(i*1.9)%3.6;d.g.position.set(Math.sin(a)*r,0,Math.cos(a)*r);d.base=a+Math.PI;d.hop=k=='bunny'?.6:.35;d.g.visible=false;scene.add(d.g);return d});
// explosión de la calabaza: mini calabazas y dulces
const pm=[0xf08090,0xff9a4a,0xff7ab8,0xffd27a].map(c=>M(c,{roughness:.4})),cm=[0xff9ec7,0xfff0a0,0x9fe0d0,0xffffff,0xff9a4a].map(c=>M(c));
const pieces=Array.from({length:48},(_,i)=>{const g=new THREE.Group();
 if(i%3==0)g.add(B(pm[i%4],[0,0,0],[.22,.18,.22]),S(cyl,mGr,[0,.17,0],[.03,.1,.03]));else g.add(B(cm[i%5],[0,0,0],.11),S(cone,cm[(i+2)%5],[.14,0,0],.06));
 g.visible=false;scene.add(g);return {g,v:new THREE.Vector3(),w:new THREE.Vector3(),s:1}});
let boom=0; // 0 entera, 1 explotada, 2 recogiendo, 3 reaparece
function explode(){if(boom==1)return;if(boom==2){boom=1;pieces.forEach(p=>p.s=1);return}
 boom=1;pk.open=false;P.g.visible=false;sfx.open();cat.dance=1;cat.sit=0;cat.sleep=0;
 pieces.forEach(p=>{p.g.position.set((Math.random()-.5)*.8,1.2+Math.random()*.6,(Math.random()-.5)*.8);const a=Math.random()*6.283,sp=2+Math.random()*4;p.v.set(Math.cos(a)*sp,5+Math.random()*5,Math.sin(a)*sp);p.w.set(Math.random()*8,Math.random()*8,0);p.s=1;p.g.scale.setScalar(1);p.g.visible=true})}
// gatito negro tierno que espera en el centro
const kit=makePet(M(0x2a2630,{roughness:.8}),'cat',true);kit.eyes.forEach(e=>e.material=M(0xffd24a,{emissive:0xffb300,emissiveIntensity:.6}));kit.g.visible=false;scene.add(kit.g);let kv=0,kt=0;
// mejoras: estrella fugaz y murciélagos rosados
const shoot=S(sph,new THREE.MeshBasicMaterial({color:0xffe14a,fog:false}),[0,0,0],[.12,.12,1.4]);shoot.visible=false;scene.add(shoot);const sh={t:6,d:new THREE.Vector3()};
const mBt=M(0xc2336f),bats=Array.from({length:4},()=>{const g=new THREE.Group(),wl=B(mBt,[-.28,0,0],[.3,.06,.18]),wr=B(mBt,[.28,0,0],[.3,.06,.18]),w=M(0xffffff,{emissive:0xffffff});g.add(B(mBt,[0,0,0],[.16,.14,.14]),wl,wr,B(mBt,[-.08,.14,0],.05),B(mBt,[.08,.14,0],.05),B(w,[-.05,.03,.12],.025),B(w,[.05,.03,.12],.025));g.scale.setScalar(1.3);scene.add(g);return {g,wl,wr}});
// ---------- Estaciones de recuerdos alrededor ----------
const tx=(t,c='#ff6fa5')=>{const k=document.createElement('canvas');k.width=k.height=128;const g=k.getContext('2d');g.fillStyle=c;g.fillRect(0,0,128,128);g.fillStyle='#fff';g.font='bold 22px sans-serif';g.textAlign='center';g.fillText(t,64,70);return new THREE.CanvasTexture(k)};
const ST=[],pics={},SZ=[1.2,.9,1.5,1.1,1.7,1.0,1.4,.8,1.3,1.6,1.05,1.45,.95,1.25,1.55,.85];
function station(n,k,i,build){const a=n/20*6.283+.15,r=9.6+(n*7%5)*.45,x=Math.sin(a)*r,z=Math.cos(a)*r,g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=a+Math.PI;g.userData={tag:'st',k,i};build(g);scene.add(g);ST.push({g,k,i,x,z})}
const face=(w,h,t,c,y,z)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx(t,c)}));p.position.set(0,y,z);return p};
for(let i=1;i<=16;i++)station(i-1,'fotos',i,g=>{const w=SZ[i-1],h=w*1.1,d=w*.8;g.add(S(box,M(0xffd6e6),[0,h/2,0],[w,h,d]),S(box,M(0xe0457f),[0,h+.06,0],[w+.12,.12,d+.12]));const p=face(w*.85,h*.75,'Foto '+i,'#ff6fa5',h*.5,d/2+.01);g.add(p);pics[i]=p;webC(g,(i%2?1:-1)*(w/2-.3),h-.3,d/2+.03,.6);});
for(let i=1;i<=3;i++)station(15+i,'videos',i,g=>{g.add(S(box,M(0x3a0a20),[0,.8,0],[2.2,1.6,1.1]),S(box,M(0xe0457f),[0,1.66,0],[2.3,.12,1.2]),face(1.9,1.2,'▶ Video '+i,'#e0457f',.8,.56));webC(g,-.9,1.4,.58,.9)});
station(19,'musica',0,g=>{g.add(S(box,M(0xff5fa5),[0,1,0],[1.3,2,.9]),face(1,1,'♪ Música','#ff9a4a',1.3,.46));webC(g,-.5,1.8,.47,.7)});
const MED={fotos:{n:16,ex:['jpg','jpeg','png','webp']},videos:{n:3,ex:['mp4','webm']},musica:{n:10,ex:['mp3','m4a','ogg','wav']}},PRE={fotos:'foto',videos:'video',musica:'cancion'},url={fotos:{},videos:{},musica:{}};
function probe(t,i){const b=`assets/${t}/${PRE[t]}${i}.`,ex=[...MED[t].ex];(function nx(){const e=ex.shift();if(!e)return;fetch(b+e,{method:'HEAD'}).then(r=>{if(!r.ok)return nx();url[t][i]=b+e;if(t=='fotos')new THREE.TextureLoader().load(b+e,x=>{x.colorSpace=THREE.SRGBColorSpace;pics[i].material.map=x;pics[i].material.needsUpdate=true})}).catch(nx)})()}
for(const t in MED)for(let i=1;i<=MED[t].n;i++)probe(t,i);
// ---------- Estado / comida (se gana con regalitos 🎁) ----------
const FOODS={leche:{e:'🥛',n:'Leche',h:-20,f:8,l:2,m:'Glup glup… ¡leche calentita!'},galleta:{e:'🍪',n:'Galletitas',h:-12,f:12,l:3,m:'Crunch crunch, ¡qué rico!'},churu:{e:'🍥',n:'Churu',h:-15,f:18,l:5,m:'Ñam, lamidita de churu 💗'},atun:{e:'🐟',n:'Atún',h:-30,f:10,e2:5,m:'¡Plato limpio! Eres la mejor.'},agua:{e:'💧',n:'Agua',h:-5,f:4,e2:8,m:'Fresquita… ahhh, relax.'},dulce:{e:'🍬',n:'Dulce',h:-8,f:25,l:6,m:'¡Dulce mágico! ¡Fiesta de chispitas!'}};
let st=JSON.parse(localStorage.getItem('nhm2')||'null')||{h:55,f:65,e:80,l:50,inv:{leche:1,galleta:1,churu:1,atun:1,agua:1,dulce:1}};
const cl=v=>Math.max(0,Math.min(100,v)),save=()=>localStorage.setItem('nhm2',JSON.stringify(st));
function render(){$('#stats').innerHTML=[['Hambre','h'],['Felicidad','f'],['Energía','e'],['Cariño','l']].map(([n,k])=>`${n}<div class="b"><i style="width:${st[k]}%"></i></div>`).join('');
 $('#foods').innerHTML=Object.entries(FOODS).map(([k,f])=>`<button data-k="${k}" class="${st.inv[k]?'':'z'}">${f.e}<b>${st.inv[k]}</b><span>${f.n}</span></button>`).join('')}
let mt;function say(t){const m=$('#msg');m.textContent=t;m.style.opacity=1;clearTimeout(mt);mt=setTimeout(()=>m.style.opacity=0,3200)}
function hearts(n=5){const v=head.getWorldPosition(new THREE.Vector3()).project(cam);for(let i=0;i<n;i++){const h=document.createElement('div');h.className='heart';h.textContent='♥';h.style.left=((v.x+1)/2*innerWidth+(Math.random()-.5)*50)+'px';h.style.top=((1-v.y)/2*innerHeight-20)+'px';document.body.append(h);setTimeout(()=>h.remove(),1400)}}
function food(t){const g=new THREE.Group(),w=M(0xffffff),p=M(0xffb3d1);
 if(t=='leche')g.add(S(cyl,w,[0,.12,0],[.35,.24,.35]),S(cyl,p,[0,.02,0],[.38,.04,.38]),S(cyl,M(0xfffdf5),[0,.23,0],[.3,.02,.3]));
 if(t=='galleta')[[0xff9a4a,-.2,0],[0xffffff,.2,0],[0xff9ec7,0,.25]].forEach(([c,x,z])=>g.add(S(cyl,M(c),[x,.04,z],[.15,.06,.15]),B(M(0x3a2a2a),[x-.03,.09,z],.025)));
 if(t=='churu'){const u=S(cyl,p,[0,.12,0],[.08,.45,.08]);u.rotation.z=1.3;g.add(u,B(w,[.2,.12,0],.09),S(cyl,w,[-.1,.1,0],[.09,.12,.09]))}
 if(t=='atun'){g.add(S(cyl,w,[0,.03,0],[.4,.06,.4]));[[-.1,0],[.12,.08],[.05,-.15]].forEach(([x,z])=>g.add(B(M(0xe8907a),[x,.1,z],[.13,.07,.1])))}
 if(t=='agua')g.add(S(cyl,M(0x9fd8ff,{transparent:true,opacity:.7}),[0,.12,0],[.35,.24,.35]),S(cyl,M(0x5fb8ff),[0,.22,0],[.3,.02,.3]));
 if(t=='dulce')g.add(B(M(0xff9ec7),[0,.12,0],.14),S(cone,M(0xffd6e6),[.2,.12,0],.1),S(cone,M(0xffd6e6),[-.2,.12,0],.1));
 return g}
let cur=null,busy=false;
function feed(k){const f=FOODS[k];if(busy)return;if(!st.inv[k])return say('No tienes '+f.n.toLowerCase()+'. ¡Busca regalitos 🎁 por el jardín!');
 busy=true;st.inv[k]--;$('#foods').hidden=true;cur=food(k);const a=CG.rotation.y;cur.position.set(CG.position.x+Math.sin(a)*1.1,0,CG.position.z+Math.cos(a)*1.1);cur.scale.setScalar(.01);scene.add(cur);render();
 cat.sleep=0;cat.eat=2;if(k=='galleta')cat.sit=1;
 setTimeout(()=>{scene.remove(cur);cur=null;cat.sit=0;st.h=cl(st.h+f.h);st.f=cl(st.f+f.f);st.l=cl(st.l+(f.l||0));st.e=cl(st.e+(f.e2||0));
  if(k=='dulce'||k=='galleta')cat.cheer=1.8,hearts(8);else hearts(3);sfx.eat();say(f.m);render();save();busy=false},2000)}
// regalitos recolectables
const gifts=[];const spawn=g=>{const a=Math.random()*6.28,r=2.8+Math.random()*3.6;g.position.set(Math.sin(a)*r,.6,Math.cos(a)*r);g.visible=true};
for(let i=0;i<8;i++){const g=new THREE.Group();g.add(S(box,M(0xff4f9a),[0,0,0],.4),S(box,M(0xffffff),[0,.2,0],[.45,.06,.1]),B(M(0xffd27a,{emissive:0xffb347}),[0,.3,0],.1));scene.add(g);gifts.push(g);spawn(g)}
// ---------- Fantasma ----------
const auto=new Date()>=new Date(2026,10,1);let gT=auto?1:0,ghost=gT;
const cream=new THREE.Color(0xfff6ea),gb=new THREE.Color(0xcfeaff),bg0=new THREE.Color(0x16040f),bg1=new THREE.Color(0x061a2e);
function setGhost(on,msg){gT=on?1:0;if(on)sfx.ghost();if(msg)say(on?'Ya soy un gatito fantasma… pero seguiré cuidándote siempre. 👻':'Vuelvo a ser gatito normal.')}
if(auto)setTimeout(()=>say('Hoy es 1 de noviembre: tu gatito se despide con un abrazo fantasma 👻'),1500);
// ---------- Audio ----------
let ac,snd=false,mus,song=null;
function tone(f,d=.2,ty='sine',v=.06,at=0){if(!snd||song)return;const t=ac.currentTime+at,o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d)}
const sfx={open:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.07,i*.09)),pet:()=>{tone(180,.5,'sine',.05);tone(200,.5,'sine',.04,.2)},eat:()=>[392,494,587].forEach((f,i)=>tone(f,.15,'square',.03,i*.1)),ghost:()=>[880,660,523,392,330].forEach((f,i)=>tone(f,.5,'sine',.05,i*.2))};
function toggleSound(){snd=!snd;$('[data-n=sound]').firstChild.textContent=snd?'🔊':'🔇';if(snd){ac=ac||new AudioContext();ac.resume();let i=0;const n=[220,262,330,262,196,247,294,247];mus=setInterval(()=>tone(n[i++%8],.7,'sine',.025),650)}else clearInterval(mus)}
const stopSong=()=>{if(song){song.pause();song=null}disco.on=false;if(boom==1)boom=2};
function playSong(i){stopSong();song=new Audio(url.musica[i]);song.onended=stopSong;song.play().then(()=>{disco.on=true;explode();say('🎶 Canción '+i+' — ¡fiesta de gatitos!')}).catch(()=>{song=null;say('No pude reproducir esa canción')})}
// ---------- Recuerdos ----------
let tab='fotos';
function renderMedia(t){tab=t;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));
 $('#grid').innerHTML=Array.from({length:MED[t].n},(_,j)=>{const i=j+1,u=url[t][i];return u?`<button data-i="${i}">${t=='fotos'?`<img src="${u}" loading="lazy">`:t=='videos'?'🎬':'🎵'}<span>${PRE[t]}${i}</span></button>`:`<button disabled class="e">?<span>${PRE[t]}${i}.${MED[t].ex[0]}</span></button>`}).join('')}
function openMedia(t){renderMedia(t||tab);$('#media').hidden=false}
function open1(t,i){if(t=='musica'&&!i)return openMedia('musica');const u=url[t][i];if(!u)return say('Falta assets/'+t+'/'+PRE[t]+i+'.'+MED[t].ex[0]);
 if(t=='musica')return playSong(i);if(t=='videos')stopSong();return showMedia(t,i);
 const lb=$('#lb');lb.innerHTML='<button id="x">✕</button>'+(t=='fotos'?`<img src="${u}">`:`<video src="${u}" controls autoplay playsinline></video>`);lb.hidden=false;$('#x').onclick=()=>{lb.hidden=true;lb.innerHTML=''}}
const DECO=['🧛','🧟','🎃','🍬','🦇','👻','🕸️','🍭','💀','🧙','🍫','🕷️','🧁','🌙','🍎','🐱'];
function showMedia(t,i){const u=url[t][i],m=(MENSAJES[t]||{})[i]||'',lb=$('#lb'),o=(i*3+(t=='videos'?5:0))%16;
 lb.innerHTML='<button id="x">✕</button><div class="card hw">'+Array.from({length:8},(_,k)=>`<i class="c c${k+1}">${DECO[(o+k)%16]}</i>`).join('')+(t=='fotos'?`<img src="${u}">`:`<video src="${u}" controls autoplay playsinline></video>`)+'<p class="msg"></p></div>';
 const mp=lb.querySelector('.msg');mp.textContent=m;lb.querySelector('.card').classList.toggle('hasmsg',!!m);if(m.length>140)mp.style.fontSize='14px';lb.hidden=false;$('#x').onclick=()=>{lb.hidden=true;lb.innerHTML=''}}
$('.tabs').onclick=e=>{const b=e.target.closest('button');b&&renderMedia(b.dataset.t)};
$('#grid').onclick=e=>{const b=e.target.closest('button');b&&open1(tab,+b.dataset.i)};
$('#stop').onclick=stopSong;$('#mclose').onclick=()=>$('#media').hidden=true;
// ---------- Controles ----------
const D={u:[0,1],d:[0,-1],l:[-1,0],r:[1,0]},act=new Set();
document.querySelectorAll('[data-d]').forEach(b=>{const k=b.dataset.d;b.onpointerdown=e=>{e.preventDefault();act.add(k)};['pointerup','pointerleave','pointercancel'].forEach(ev=>b['on'+ev]=()=>act.delete(k))});
const joy={x:0,y:0},jb=$('#joy'),jk=jb.firstElementChild;let jid=null;
const jmove=e=>{const r=jb.getBoundingClientRect(),dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60),L=Math.hypot(dx,dy),m=Math.min(L,45),k=L?m/L:0,mx=m/45;jk.style.transform=`translate(${dx*k}px,${dy*k}px)`;joy.x=mx>.15?dx/L*mx:0;joy.y=mx>.15?-dy/L*mx:0};
jb.onpointerdown=e=>{e.preventDefault();jid=e.pointerId;jb.setPointerCapture(jid);jmove(e)};jb.onpointermove=e=>{if(e.pointerId===jid)jmove(e)};
const jend=e=>{if(e.pointerId!==jid)return;jid=null;joy.x=joy.y=0;jk.style.transform=''};jb.onpointerup=jend;jb.onpointercancel=jend;
const KM={ArrowUp:'u',w:'u',ArrowDown:'d',s:'d',ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r'};
addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('textarea,input,[contenteditable]'))return;const k=KM[e.key];if(k)act.add(k);if(e.key==' ')interact();if(e.key=='j')jump()});addEventListener('keyup',e=>{const k=KM[e.key];k&&act.delete(k)});
let near=null;const jump=()=>{if(cat.j<0){cat.j=0;st.e=cl(st.e-3);render()}};
function interact(){if(near)return open1(near.k,near.i);cat.pet=.9;cat.sleep=0;st.l=cl(st.l+4);st.f=cl(st.f+2);hearts();sfx.pet();say('Ronroneo… prrr 💗');render();save()}
$('#pad').onclick=e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.b;
 if(a=='dance'){cat.sit=0;cat.sleep=0;cat.dance=(cat.dance+1)%6;say(cat.dance?'💃 Baile: '+['','Saltitos','Giro','Ola','Twist','Voltereta'][cat.dance]:'Fin del baile')}if(a=='a')interact();if(a=='b')jump();if(a=='sit'){cat.sleep=0;cat.sit=1-cat.sit}
 if(a=='sleep'){cat.sit=0;cat.sleep=1;say('Zzz… dulces sueños.');setTimeout(()=>{if(cat.sleep){cat.sleep=0;st.e=cl(st.e+30);render();save()}},5000)}};
const rc=new THREE.Raycaster(),mv=new THREE.Vector2();let d0=null;
R.domElement.addEventListener('pointerdown',e=>d0=[e.clientX,e.clientY]);
R.domElement.addEventListener('pointerup',e=>{if(!d0||Math.hypot(e.clientX-d0[0],e.clientY-d0[1])>6)return;
 mv.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);rc.setFromCamera(mv,cam);
 const h=rc.intersectObjects([CG,P.g,...ST.map(s=>s.g)],true)[0];if(!h)return;let o=h.object;while(o&&!o.userData.tag)o=o.parent;if(!o)return;const tag=o.userData.tag;
 if(tag=='lid')togglePumpkin();if(tag=='cat')interact();if(tag=='st')open1(o.userData.k,o.userData.i)});
$('#nav').onclick=e=>{const b=e.target.closest('button');if(!b)return;const n=b.dataset.n;
 if(n=='home')cam.position.copy(ctl.target).add(new THREE.Vector3(0,3.5,8));
 if(n=='food')$('#foods').hidden=!$('#foods').hidden;
 if(n=='media')openMedia();
 if(n=='letter'){$('#letter').hidden=false;$('#txt').style.animation='none';void $('#txt').offsetWidth;$('#txt').style.animation=''}
 if(n=='ghost')setGhost(gT<.5,true);if(n=='sound')toggleSound()};
$('#foods').onclick=e=>{const b=e.target.closest('button');b&&feed(b.dataset.k)};
const LD='Mi amor,\n\nQuise hacerte este pequeño jardín mágico porque contigo cada momento se siente como una noche de Halloween bonita: con luces cálidas, risas y algo de magia.\n\nGracias por los recuerdos que ya tenemos y por los que nos faltan crear. Quiero más tardes contigo, más dulces compartidos y más aventuras a tu lado.\n\nTe quiero muchísimo. 🎃💗';
const lt=JSON.parse(localStorage.getItem('nhm-letter')||'null')||{to:'Mi amor',t:LD};$('#to').value=lt.to;$('#txt').textContent=lt.t;
$('#save').onclick=()=>{localStorage.setItem('nhm-letter',JSON.stringify({to:$('#to').value,t:$('#txt').innerText}));say('Carta guardada 💌');$('#letter').hidden=true};$('#close').onclick=()=>$('#letter').hidden=true;
setInterval(()=>{st.h=cl(st.h+1.5);st.f=cl(st.f-1);st.e=cl(st.e-.5);render();save()},20000);
// ---------- Bucle ----------
function resize(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.8?68:50;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();render();
const clock=new THREE.Clock(),V=new THREE.Vector3(),bub=$('#bubble'),bv=new THREE.Vector3(0,4.2,0),BF=['🥰','😊','😍','🎃'];let bShow=false,bi=0,bDone=false,bT=0;
R.setAnimationLoop(()=>{if(document.hidden){clock.getDelta();return}
 const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime,c=cat,sad=st.h>75;
 pk.k+=((pk.open?1:0)-pk.k)*Math.min(1,dt*5);P.lid.rotation.x=-1.9*pk.k;candies.scale.setScalar(.01+pk.k);glow.intensity=pk.k*6;spk.visible=pk.k>.05;
 if(spk.visible){for(let i=0;i<20;i++){let y=spk.geometry.attributes.position.getY(i)+dt*.6;if(y>3.5)y=1.95;spk.geometry.attributes.position.setY(i,y)}spk.geometry.attributes.position.needsUpdate=true}
 // movimiento con botones (relativo a la cámara)
 let ix=0,iy=0;act.forEach(k=>{ix+=D[k][0];iy+=D[k][1]});ix+=joy.x;iy+=joy.y;c.walk=!!(ix||iy)&&!c.eat;
 if(c.walk){const f=V.subVectors(ctl.target,cam.position);f.y=0;f.normalize();const d=new THREE.Vector3(-f.z*ix,0,f.x*ix).addScaledVector(f,iy),ln=Math.min(1,d.length());d.normalize();
  CG.position.addScaledVector(d,3.2*dt*ln);c.face=Math.atan2(d.x,d.z);c.sit=0;c.sleep=0;c.dance=0;
  const L=Math.max(.01,Math.hypot(CG.position.x,CG.position.z)),Lc=Math.min(12.5,Math.max(boom?.3:2.3,L));CG.position.x*=Lc/L;CG.position.z*=Lc/L}
 if(c.dance&&!c.walk)c.face+=dt*(c.dance==2?7:c.dance==1?2:0);let da=c.face-CG.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));CG.rotation.y+=da*Math.min(1,dt*8);
 legs.forEach((l,i)=>l.rotation.x=c.walk?Math.sin(t*14+(i%2)*3.14)*.6:0);
 c.sitK+=(c.sit-c.sitK)*Math.min(1,dt*6);c.slK+=(c.sleep-c.slK)*Math.min(1,dt*4);
 body.rotation.x=-.5*c.sitK;body.position.y=.45-.18*c.slK-.05*c.sitK;body.scale.y=.4+Math.sin(t*2.2)*.012;head.position.y=.95-.3*c.slK-.12*c.sitK;
 head.rotation.y=c.pet>0?Math.sin(t*14)*.3:Math.sin(t*.7)*.15;head.rotation.x=(sad?.25:0)+(c.eat>0?.5+Math.sin(t*10)*.12:0)+.5*c.slK;
 tail.rotation.z=Math.sin(t*(c.pet>0||c.cheer>0||c.dance?16:sad?1:3))*(c.pet>0||c.dance?.7:.3);head.rotation.z=c.dance&&!c.walk?Math.sin(t*7)*.3:0;
 if((c.bt-=dt)<0){c.bt=2+Math.random()*3;c.bl=.15}c.bl-=dt;
 const cl2=c.bl>0||c.pet>0||c.sleep||c.slK>.5;eyes.forEach(e=>e.scale.y=cl2?.015:(sad?.09:.12));
 let y=0;if(c.j>=0){c.j+=dt;y=Math.sin(c.j/.7*Math.PI)*.9;if(c.j>.7)c.j=-1}if(c.cheer>0)y=Math.abs(Math.sin(t*7))*.5;const dk2=c.dance&&!c.walk?c.dance:0;if(dk2)y=dk2==1?Math.abs(Math.sin(t*7))*.3:dk2==2?.12:dk2==3?0:dk2==4?Math.abs(Math.sin(t*8))*.2:Math.max(0,Math.sin(t*4.5))*.9;CG.rotation.z=dk2==3?Math.sin(t*4)*.3:0;CG.rotation.x=dk2==5&&Math.sin(t*4.5)>0?((t*4.5)%6.283)*2:0;body.rotation.y=dk2==4?Math.sin(t*8)*.7:0;
 ['pet','eat','cheer'].forEach(k=>c[k]=Math.max(0,c[k]-dt));
 ghost+=(gT-ghost)*Math.min(1,dt*1.2);CG.position.y=y+ghost*(.35+Math.sin(t*2)*.1);
 mW.transparent=true;mW.opacity=1-.35*ghost;mW.color.lerpColors(cream,gb,ghost);mW.emissive.setRGB(.3*ghost,.42*ghost,.8*ghost);
 bg.lerpColors(bg0,bg1,ghost);scene.fog.color.copy(bg);ffM.color.setHex(ghost>.5?0x9fd8ff:0xffe27a);
 kv+=((boom==1?1:0)-kv)*Math.min(1,dt*4);kit.g.visible=kv>.02;kt=boom==1?kt+dt:0;
 if(kit.g.visible){const dn=kt>3;kit.g.scale.setScalar(Math.max(.001,kv));const ks=dn?Math.floor((kt-3)/4)%3:-1;kit.g.position.set(-1.5,dn?(ks==2?Math.max(0,Math.sin(t*4.5))*.9:Math.abs(Math.sin(t*6))*.35):0,.3);kit.g.rotation.y=ks==1?t*5:dn?Math.sin(t*3)*.6:Math.sin(t*.8)*.3;kit.g.rotation.x=ks==2&&Math.sin(t*4.5)>0?((t*4.5)%6.283)*2:0;kit.body.rotation.x=dn?0:-.5;kit.head.position.y=dn?.95:.83;kit.tail.rotation.z=Math.sin(t*(dn?12:4))*.5;kit.head.rotation.z=Math.sin(t*5)*.2}
 sh.t+=dt;if(sh.t>8){sh.t=0;const sx=Math.random()<.5?1:-1;shoot.position.set(-sx*25,30+Math.random()*8,-35);sh.d.set(sx*30,-14,0)}
 shoot.visible=sh.t<1.3;if(shoot.visible){shoot.position.addScaledVector(sh.d,dt);shoot.lookAt(shoot.position.clone().add(sh.d))}
 bats.forEach((b,i)=>{const a=t*.35+i*1.57,r=7+i%2*2;b.g.position.set(Math.cos(a)*r,5.5+Math.sin(t*1.3+i)*.8+i%2,Math.sin(a)*r);b.g.rotation.y=-a;b.wl.rotation.z=Math.sin(t*12+i)*.7;b.wr.rotation.z=-Math.sin(t*12+i)*.7});
 if(boom==1)pieces.forEach(p=>{p.v.y-=14*dt;const q=p.g.position;q.addScaledVector(p.v,dt);if(q.y<.15){q.y=.15;p.v.y=Math.abs(p.v.y)>1.5?-p.v.y*.45:0;p.v.x*=.7;p.v.z*=.7}if(p.v.y){p.g.rotation.x+=p.w.x*dt;p.g.rotation.z+=p.w.y*dt}});
 if(boom==2){let n=0;pieces.forEach(p=>{p.s=Math.max(0,p.s-dt*1.2);p.g.scale.setScalar(Math.max(.001,p.s));if(p.s>0)n++});if(!n){pieces.forEach(p=>p.g.visible=false);P.g.visible=true;P.g.scale.setScalar(.01);boom=3;sfx.open()}}
 if(boom==3){const z=P.g.scale.x+(1.65-P.g.scale.x)*Math.min(1,dt*5);P.g.scale.setScalar(z);if(z>1.64){P.g.scale.setScalar(1.65);boom=0}}
 // burbuja: solo tras explotar la calabaza y al acercarse al centro; dura un buen rato
 if(boom!==1){bDone=false;if(bShow){bShow=false;bub.classList.remove('on')}}
 if(boom==1&&!bShow&&!bDone&&Math.hypot(CG.position.x,CG.position.z)<3.2){bShow=true;bDone=true;const m=MENSAJES.centro||'';bT=MENSAJES.centroSeg||Math.max(10,5+m.length*.12);bub.querySelector('i').textContent=BF[bi++%4];bub.querySelector('p').textContent=m;bub.classList.add('on')}
 if(bShow&&(bT-=dt)<=0){bShow=false;bub.classList.remove('on')}
 if(bShow){const v=bv.clone().project(cam);bub.style.left=((v.x+1)/2*innerWidth)+'px';bub.style.top=((1-v.y)/2*innerHeight)+'px';bub.style.display=v.z>1?'none':''}
 // regalitos y estaciones
 gifts.forEach((g,i)=>{if(!g.visible)return;g.position.y=.6+Math.sin(t*2+i)*.1;g.rotation.y+=dt;
  if(Math.hypot(g.position.x-CG.position.x,g.position.z-CG.position.z)<.9){g.visible=false;setTimeout(()=>spawn(g),15000);const ks=Object.keys(FOODS),k=ks[Math.floor(Math.random()*ks.length)];st.inv[k]++;render();save();hearts(3);sfx.eat();say('¡Encontraste '+FOODS[k].n.toLowerCase()+'! '+FOODS[k].e)}});
 let best=null,bd=3.4;ST.forEach(s=>{const d=Math.hypot(s.x-CG.position.x,s.z-CG.position.z);if(d<bd){bd=d;best=s}});
 if(best!==near){near=best;$('#ba').classList.toggle('near',!!near)}
 // disco
 disco.k+=((disco.on?1:0)-disco.k)*Math.min(1,dt*2);const dk=disco.k;ball.position.y=16-9.5*dk;ball.rotation.y+=dt*1.5;ball.scale.setScalar(1+Math.sin(t*8)*.04*dk);beams.visible=dk>.02;
 beams.children.forEach((b,i)=>{const m=b.children[0].material;m.color.setHSL((t*.3+i/8)%1,1,.55);m.opacity=.28*dk});
 dLs.forEach((l,i)=>{l.intensity=dk*(Math.sin(t*9+i*3)>0?45:8);l.color.setHSL((t*.4+i*.5)%1,1,.6);l.position.set(Math.sin(t+i*3)*3,5,Math.cos(t+i*3)*3)});
 const fx=$('#flash');fx.style.opacity=dk*(Math.sin(t*9)>.7?.18:0);fx.style.background='hsl('+((t*60)%360|0)+' 100% 60%)';
 dancers.forEach((d,i)=>{d.g.visible=dk>.02;if(!d.g.visible)return;d.g.scale.setScalar(Math.max(.001,dk));const m=i%4;d.g.position.y=Math.abs(Math.sin(t*6+i))*d.hop*dk;d.g.rotation.y=m==1?t*3+i:d.base+Math.sin(t*3+i)*.6;d.g.rotation.z=m==2?Math.sin(t*4+i)*.3:0;d.g.rotation.x=m==3&&Math.sin(t*4.5+i)>0?((t*4.5+i)%6.283)*2:0;d.tail.rotation.z=Math.sin(t*12)*.7;d.head.rotation.z=Math.sin(t*6+i)*.25});
 for(let i=0;i<40;i++)fp.setXYZ(i,Math.sin(t*.3+i)*9*(.5+i%3*.3),1+Math.sin(t*.7+i*2)*1+i%4*.4,Math.cos(t*.25+i*1.7)*8*(.5+i%2*.5));fp.needsUpdate=true;
 if(cur)cur.scale.setScalar(Math.min(1,cur.scale.x+dt*3));
 // cámara sigue al gatito
 V.set(CG.position.x,1.3,CG.position.z).sub(ctl.target).multiplyScalar(Math.min(1,dt*3));ctl.target.add(V);cam.position.add(V);
 ctl.update();R.render(scene,cam)});
