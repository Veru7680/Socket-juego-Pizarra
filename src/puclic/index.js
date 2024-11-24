const socket = io()

//DOM
let message = document.getElementById('message')
let username = document.getElementById('username')
let btn = document.getElementById('send')
let output = document.getElementById('output')
let actions = document.getElementById('actions')


function init() {
   let mouse = {
       click: false,
       move: false,
       pos: { x: 0, y: 0 },
       pos_prev: false
   };

   // Canvas
   const canvas = document.getElementById('drawing');
   const context = canvas.getContext('2d');

   function resizeCanvas() {
       canvas.width = document.getElementById('canvas-container').clientWidth;
       canvas.height = document.getElementById('canvas-container').clientHeight - 40; // Ajusta por el botón
   }

   resizeCanvas();
   window.addEventListener('resize', resizeCanvas);

   const socket = io();

   canvas.addEventListener('mousedown', () => (mouse.click = true));
   canvas.addEventListener('mouseup', () => (mouse.click = false));

   canvas.addEventListener('mousemove', (e) => {
       const rect = canvas.getBoundingClientRect();
       mouse.pos.x = (e.clientX - rect.left) / canvas.width;
       mouse.pos.y = (e.clientY - rect.top) / canvas.height;
       mouse.move = true;
   });

   socket.on('draw_line', (data) => {
       const line = data.line;
       context.beginPath();
       context.lineWidth = 2;
       context.moveTo(line[0].x * canvas.width, line[0].y * canvas.height);
       context.lineTo(line[1].x * canvas.width, line[1].y * canvas.height);
       context.stroke();
   });

   function mainLoop() {
       if (mouse.click && mouse.move && mouse.pos_prev) {
           socket.emit('draw_line', { line: [mouse.pos, mouse.pos_prev] });
           mouse.move = false;
       }
       mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
       setTimeout(mainLoop, 25);
   }
   mainLoop();
}

document.addEventListener('DOMContentLoaded', init);

//CHAT
btn.addEventListener('click', function (){
    socket.emit('chat:message', {
        username:username.value,
        message:message.value
    });
});

message.addEventListener('keypress', function(){
    socket.emit('chat:typing', username.value)
})

socket.on('chat:message', function(data){
    output.innerHTML += `<p><strong>${data.username}</strong>:${data.message}</p>`
});

socket.on('chat:typing', function(data){
    actions.innerHTML =  `<p><em>${data} is typing a message rigth now</em></p>` 
})

