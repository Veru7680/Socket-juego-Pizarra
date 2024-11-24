const socket = io();

//DOM
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let clearBtn = document.getElementById('clear'); // Botón de borrar

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

    socket.on('draw_line', (data) => {
        const line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * canvas.width, line[0].y * canvas.height);
        context.lineTo(line[1].x * canvas.width, line[1].y * canvas.height);
        context.stroke();
    });

    // Limpiar canvas (cuando el servidor emite el evento)
    socket.on('clear_canvas', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Evento de clic en el botón de "Borrar"
    clearBtn.addEventListener('click', () => {
        socket.emit('clear_canvas');
    });

    // Funciones para el dibujo con el mouse
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect(); // Obtiene las coordenadas del canvas en la pantalla
      // Calcula las coordenadas dentro del canvas, usando el tamaño real
      mouse.pos.x = (e.clientX - rect.left) / rect.width;  // Calcula la posición en relación con el tamaño real
      mouse.pos.y = (e.clientY - rect.top) / rect.height;  // Calcula la posición en relación con el tamaño real
      mouse.move = true;
  });
  
  canvas.addEventListener('mousedown', (e) => {
      mouse.click = true;
      const rect = canvas.getBoundingClientRect();  // Cálculo preciso de la posición
      // Calcula las coordenadas relativas al canvas con el tamaño correcto
      mouse.pos.x = (e.clientX - rect.left) / rect.width;
      mouse.pos.y = (e.clientY - rect.top) / rect.height;
  });
  
  canvas.addEventListener('mouseup', () => {
      mouse.click = false;
  });
  function resizeCanvas() {
   const canvasContainer = document.getElementById('canvas-container');
   canvas.width = canvasContainer.clientWidth;
   canvas.height = canvasContainer.clientHeight - 40; // Ajusta por el botón o margen
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Llama a resizeCanvas cuando se carga la página por primera vez

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

// CHAT
btn.addEventListener('click', function () {
    socket.emit('chat:message', {
        username: username.value,
        message: message.value
    });
});

message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username.value)
});

socket.on('chat:message', function (data) {
    output.innerHTML += `<p><strong>${data.username}</strong>:${data.message}</p>`
});

socket.on('chat:typing', function (data) {
    actions.innerHTML = `<p><em>${data} is typing a message right now</em></p>`
});