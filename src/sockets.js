 module.exports = (io)=>{
    var line_history=[];
    io.on('connection',socket =>{
        console.log('new user connected');
        socket.on('draw_line', (data=>{
console.log(data );
        }));
    })
 }