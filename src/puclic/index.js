function init(){
let mouse={
    click: false,
    move: false,
    pos: {x:0  , y:0},
    pos_prev:false

};
 //canvas
 const canvas=document.getElementById('drawing');
 const context = canvas.getContext('2d');

 //alt y ancho
 const width = window.innerWidth;
 const heigth =window.innerHeight;

 canvas.width =width;
 canvas.heigth= heigth;

 io();

 canvas.addEventListener('mousedown',(e)=>{
    mouse.click =true;
   
 });

 canvas.addEventListener('mouseup', (e)=>{
mouse.click= false;
console.log(mouse);
 });

 //evento de capturar cuando el usuario se mueve dentro del canva

 canvas.addEventListener('mousemove', (e)=>{
    mouse.pos.x=e.clientX / width;
    mouse.pos.y=e.clientY / heigth;
    mouse.move=true;
   
     });

     function mainLoop(){
     if(mouse.click && mouse.move && mouse.pos_prev){
        //conexion web socket 
     }
setTimeout(mainLoop, 25);
    }
    mainLoop();

}

document.addEventListener('DOMContentLoaded',init);