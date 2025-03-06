# Documento de Implementação - Bot de Gerenciamento de Estoque de Pen Drives (NodeJS)

1. Objetivo do Bot
   
O objetivo deste bot é automatizar o gerenciamento do estoque de pen drives, permitindo que o usuário interaja com ele por meio de comandos no Telegram. O bot possibilita as seguintes ações:

Adicionar ou remover unidades de pen drives do estoque.
Consultar o estoque total de pen drives.
Definir um estoque mínimo para alertas.
Notificar automaticamente quando o estoque ficar abaixo do mínimo, além de registrar as movimentações em um banco de dados.

2. Dependências e Frameworks Utilizados
   
node-telegram-bot-api: Biblioteca para integração com a API do Telegram.
mysql2: Biblioteca para interação com o banco de dados MySQL.
dotenv: Biblioteca para gerenciamento de variáveis de ambiente (para segurança do token do Telegram e dados do banco de dados).
