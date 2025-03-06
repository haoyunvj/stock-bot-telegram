# Documento de Implementação - Bot de Gerenciamento de Estoque de Pen Drives (NodeJS)

1. Objetivo do Bot
   
O objetivo deste bot é automatizar o gerenciamento do estoque de pen drives na empresa que trabalho atualmente como Lider de Suporte Técnico, permitindo que o usuário interaja com ele por meio de comandos no Telegram. O bot possibilita as seguintes ações:

Adicionar ou remover unidades de pen drives do estoque.
Consultar o estoque total de pen drives.
Definir um estoque mínimo para alertas.
Notificar automaticamente quando o estoque ficar abaixo do mínimo, além de registrar as movimentações em um banco de dados.

2. Dependências e Frameworks Utilizados
   
node-telegram-bot-api: Biblioteca para integração com a API do Telegram.
mysql2: Biblioteca para interação com o banco de dados MySQL.
dotenv: Biblioteca para gerenciamento de variáveis de ambiente (para segurança do token do Telegram e dados do banco de dados).

3. Funcionalidades do Bot

/add <quantidade>: Adiciona unidades de pen drives ao estoque.
/sub <quantidade>: Remove unidades de pen drives do estoque, respeitando o estoque disponível.
/total: Exibe o estoque total de pen drives, levando em consideração as movimentações de entrada e saída.
/setmin <quantidade>: Define o estoque mínimo para alertas.

Alertas automáticos: O bot envia alertas quando o estoque estiver abaixo do mínimo configurado (a cada 1hr).

