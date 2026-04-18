require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const authPacRoutes = require('./routes/auth-pac');
const pacientesRoutes = require('./routes/pacientes');
const prontuariosRoutes = require('./routes/prontuarios');
const sessoesRoutes = require('./routes/sessoes');
const pagamentosRoutes = require('./routes/pagamentos');
const chatRoutes = require('./routes/chat');
const chatPacRoutes = require('./routes/chat-pac');
const psicologosRoutes = require('./routes/psicologos');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.get('/', (req, res) => res.redirect('/index.html'));

app.use('/api/auth', authRoutes);
app.use('/api/auth-pac', authPacRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/prontuarios', prontuariosRoutes);
app.use('/api/sessoes', sessoesRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-pac', chatPacRoutes);
app.use('/api/psicologos', psicologosRoutes);

// Chat em tempo real via Socket.io
io.on('connection', (socket) => {
  socket.on('join_room', (room) => socket.join(room));
  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Theralink rodando na porta ${PORT}`));
