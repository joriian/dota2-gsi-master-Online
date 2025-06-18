const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas as origens no Render
    methods: ["GET", "POST"]
  }
});

// Servir os arquivos do frontend Svelte
app.use(cors());
app.use(express.static(path.join(__dirname, 'svelte-app/public')));

// Conexão com clientes WebSocket (streamers e overlays)
io.on('connection', (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Cliente (streamer) envia os dados do Dota 2
  socket.on('gsi_data', (newdata) => {
    io.emit('newdata', newdata); // Broadcast para todos os overlays conectados

    try {
      if (newdata && newdata.draft) {
        const {
          activeteam,
          pick,
          activeteam_time_remaining,
          radiant_bonus_time,
          dire_bonus_time,
          team2,
          team3
        } = newdata.draft;

        io.emit('activeteam', activeteam);
        io.emit('pick', pick);
        io.emit('activeteam_time_remaining', activeteam_time_remaining);
        io.emit('radiant_bonus_time', radiant_bonus_time);
        io.emit('dire_bonus_time', dire_bonus_time);

        const radiant_picks = ['pick0_class', 'pick1_class', 'pick2_class', 'pick3_class', 'pick4_class'];
        const dire_picks = ['pick0_class', 'pick1_class', 'pick2_class', 'pick3_class', 'pick4_class'];
        const radiant_bans = ['ban0_class', 'ban1_class', 'ban2_class', 'ban3_class', 'ban4_class', 'ban5_class', 'ban6_class'];
        const dire_bans = ['ban0_class', 'ban1_class', 'ban2_class', 'ban3_class', 'ban4_class', 'ban5_class', 'ban6_class'];

        radiant_picks.forEach(key => {
          if (team2 && team2.hasOwnProperty(key)) {
            io.emit(`radiant_pick:${key}`, team2[key]);
          }
        });

        dire_picks.forEach(key => {
          if (team3 && team3.hasOwnProperty(key)) {
            io.emit(`dire_pick:${key}`, team3[key]);
          }
        });

        radiant_bans.forEach(key => {
          if (team2 && team2.hasOwnProperty(key)) {
            io.emit(`radiant_ban:${key}`, team2[key]);
          }
        });

        dire_bans.forEach(key => {
          if (team3 && team3.hasOwnProperty(key)) {
            io.emit(`dire_ban:${key}`, team3[key]);
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar dados do draft:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Porta usada no Render (usa PORT do ambiente)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
