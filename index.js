var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
var d2gsi = require('dota2-gsi');
var path = require('path');

// GSI escutando localmente (apenas se quiser rodar isso localmente também)
var server = new d2gsi({
    port: 3000,
    tokens: ["production"]
});

app.use(cors());
app.use(express.json()); // <- necessário para ler JSON no body

// Log de acesso a arquivos estáticos
app.use((req, res, next) => {
    if (req.url.startsWith('/videos/') || req.url.startsWith('/assets/')) {
        console.log('Acessando arquivo estático:', req.url);
    }
    next();
});

// Servir arquivos estáticos do Svelte compilado
app.use(express.static(path.join(__dirname, 'svelte-app/public')));

// ========== NOVO: endpoint /api/relay ==========
app.post('/api/relay', (req, res) => {
    const newdata = req.body;
    console.log("POST recebido em /api/relay");

    try {
        if (newdata) {
            io.emit('newdata', newdata); // Envia tudo para o frontend
        }

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
                if (team2?.hasOwnProperty(key)) {
                    io.emit(`radiant_pick:${key}`, team2[key]);
                }
            });

            dire_picks.forEach(key => {
                if (team3?.hasOwnProperty(key)) {
                    io.emit(`dire_pick:${key}`, team3[key]);
                }
            });

            radiant_bans.forEach(key => {
                if (team2?.hasOwnProperty(key)) {
                    io.emit(`radiant_ban:${key}`, team2[key]);
                }
            });

            dire_bans.forEach(key => {
                if (team3?.hasOwnProperty(key)) {
                    io.emit(`dire_ban:${key}`, team3[key]);
                }
            });
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Erro no /api/relay:', error);
        res.sendStatus(500);
    }
});

// Socket.io de debug (opcional)
io.on('connection', (socket) => {
    console.log("Frontend conectado via socket.io");
});

// Porta dinâmica para ambientes como Render (ou 3001 localmente)
const PORT = process.env.PORT || 3001;
http.listen(PORT, function () {
    console.log(`Servidor rodando na porta ${PORT}`);
});
