require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');

// Configuração do bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Configuração do banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        process.exit(1);
    }
    console.log("Conectado ao MySQL!");
});

// Adicionar pen drives
bot.onText(/\/add (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const quantidade = parseInt(match[1]);

    db.query("UPDATE pendrives SET quantidade = quantidade + ? WHERE id = 1", [quantidade], (err) => {
        if (err) {
            bot.sendMessage(chatId, "Erro ao adicionar pen drives.");
            return;
        }

        db.query("INSERT INTO historico_movimentacoes (tipo, quantidade) VALUES ('ADD', ?)", [quantidade]);

        bot.sendMessage(chatId, `✅ Adicionados ${quantidade} pen drives ao estoque.`);
    });
});

// Remover pen drives
bot.onText(/\/sub (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const quantidade = parseInt(match[1]);

    db.query("SELECT quantidade, estoque_minimo FROM pendrives WHERE id = 1", (err, results) => {
        if (err) {
            bot.sendMessage(chatId, "Erro ao acessar o banco de dados.");
            return;
        }

        const { quantidade: estoqueAtual, estoque_minimo } = results[0];

        if (quantidade > estoqueAtual) {
            bot.sendMessage(chatId, "❌ Estoque insuficiente para essa remoção.");
            return;
        }

        db.query("UPDATE pendrives SET quantidade = quantidade - ? WHERE id = 1", [quantidade], (err) => {
            if (err) {
                bot.sendMessage(chatId, "Erro ao remover pen drives.");
                return;
            }

            db.query("INSERT INTO historico_movimentacoes (tipo, quantidade) VALUES ('SUB', ?)", [quantidade]);

            bot.sendMessage(chatId, `📉 Removidos ${quantidade} pen drives do estoque.`);

            // Verificar se o estoque ficou abaixo do mínimo
            db.query("SELECT quantidade FROM pendrives WHERE id = 1", (err, results) => {
                if (err) return;
                const novoEstoque = results[0].quantidade;

                if (novoEstoque < estoque_minimo) {
                    bot.sendMessage(chatId, `⚠️ Atenção! O estoque caiu para ${novoEstoque}, abaixo do mínimo (${estoque_minimo}).`);
                }
            });
        });
    });
});

// Configurar estoque mínimo
bot.onText(/\/setmin (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const estoqueMinimo = parseInt(match[1]);

    db.query("UPDATE pendrives SET estoque_minimo = ? WHERE id = 1", [estoqueMinimo], (err) => {
        if (err) {
            bot.sendMessage(chatId, "Erro ao configurar o estoque mínimo.");
            return;
        }

        bot.sendMessage(chatId, `📌 Estoque mínimo definido para ${estoqueMinimo} pen drives.`);
    });
});

// Mostrar quantidade total de pen drives
bot.onText(/\/total/, (msg) => {
    const chatId = msg.chat.id;
    connection.query("SELECT quantidade FROM pendrives LIMIT 1", (err, results) => {
        if (err) {
            bot.sendMessage(chatId, "❌ Erro ao acessar o banco de dados.");
            console.error("Erro MySQL:", err);
            return;
        }
        
        if (results.length === 0) {  // Se não houver resultados
            bot.sendMessage(chatId, "📦 O estoque ainda não foi cadastrado.");
            return;
        }

        const quantidade = results[0].quantidade;
        bot.sendMessage(chatId, `📦 Estoque atual: ${quantidade} pen drives.`);
    });
});

bot.on("message", (msg) => {
   const chatId = msg.chat.id;
    const message = msg.text;

    if (!message.startsWith("/")) {
        bot.sendMessage(chatId, "❓ Comando não reconhecido. Use /add, /sub, /setmin ou /total.");
    }
});
