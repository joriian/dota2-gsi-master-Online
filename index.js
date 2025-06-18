var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080", // Pode ser atualizado para o domínio real se necessário
        methods: ["GET", "POST"]
    }
});
var d2gsi = require('dota2-gsi');
var path = require('path');

// GSI escutando localmente (para o Dota 2 enviar os dados)
var server = new d2gsi({
    port: 3000,
    tokens: ["production"]
});

app.use(cors());

// Log de acesso a arquivos estáticos
app.use((req, res, next) => {
    if (req.url.startsWith('/videos/') || req.url.startsWith('/assets/')) {
        console.log('Acessando arquivo estático:', req.url);
    }
    next();
});

// Servir arquivos estáticos do Svelte compilado
app.use(express.static(path.join(__dirname, 'svelte-app/public')));

// Eventos GSI do Dota 2
server.events.on('newclient', function (client) {
    console.log("New client connection, IP address: " + client.ip);
    if (client.auth && client.auth.token) {
        console.log("Auth token: " + client.auth.token);
    } else {
        console.log("No Auth token");
    }

    client.on('newdata', function (newdata) {
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
        } catch (error) {
            console.error('Erro ao tratar newdata:', error);
        }
    });
});

// Porta dinâmica para ambientes como Render (ou 3001 localmente)
const PORT = process.env.PORT || 3001;
http.listen(PORT, function () {
    console.log(`Servidor rodando na porta ${PORT}`);
});
