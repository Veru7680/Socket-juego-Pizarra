module.exports = (io) => {
    var line_history = [];

    io.on('connection', socket => {
        console.log('New user connected');

        // Enviar el historial de líneas a los usuarios que se conectan
        for (let i in line_history) {
            socket.emit('draw_line', { line: line_history[i] });
        }

        // Escuchar evento de dibujar línea
        socket.on('draw_line', data => {
            line_history.push(data.line);
            io.emit('draw_line', data);
        });

        // Escuchar evento de borrar el canvas
        socket.on('clear_canvas', () => {
            // Emitir a todos los clientes para borrar el canvas
            io.emit('clear_canvas');
        });
    });
};
