const {v4: uuidv4} = require('uuid');

module.exports = function(io) {
    io.on("connection", (socket) => {
        console.log("a user connected: ", socket.id);
        socket.emit('Пользователь успешно подключился!', socket.id);
        let creatorId;

        socket.on('createRoom', () => {
            const roomId = uuidv4();
            socket.join(roomId);
            creatorId = socket.id;
            socket.emit('Комната была успешно создана!', roomId);
            console.log(`Комната ${roomId} создана`);
        })

        socket.on('joinRoom', (roomId, username) => {
            socket.join(roomId);
            console.log(`Пользователь ${username} присоединился к комнате ${roomId}`);
            io.in(roomId).emit(`Пользователь ${username} подключился`, creatorId);
        })

        socket.on('movieSelection:start', data => {
            const {theme} = data;
            const moviesList =
            socket.emit('Создатель инициализировал процесс подбора', moviesList);

            socket.on('movieSelection:vote', () => {


                socket.on('movieSelection:finish', () => {

                })
            })
        })

        socket.on('disconnect', () => {
            if (socket.id === creatorId) {

            } else {

            }
        })
    })
}
