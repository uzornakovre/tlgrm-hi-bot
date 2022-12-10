const TelegramApi = require('node-telegram-bot-api');
const { optionsDigitGame, optionsDigitGameStartAgain } = require('./options.js');
const myToken = '5764061116:AAHaS7aBWGdEx_FKEDPG46tEzCZkq0fvB-E';
const bot = new TelegramApi(myToken, {polling: true});

const chats = {};

const start = () => {
  bot.setMyCommands([
    {
      command:     '/start',
      description: 'Начать заново'
    },
    {
      command:     '/info',
      description: 'Информация о пользователе'
    },
    {
      command:     '/digit',
      description: 'Отгадай цифру'
    }
  ]);
  
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/7.webp');
      return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.first_name}. Нажмите "Меню" для выбора команды`);
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId, 
        `Ваше имя: ${msg.from.first_name}\nВаш никнейм: ${msg.from.username}`
      );
    }
    if (text === '/digit') {
      return startDigitGame(chatId);
    }

    return bot.sendMessage(chatId, 'Данные введены некорректно / нет такой команды')
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      startDigitGame(chatId);
    }
    if (Number(data) === chats[chatId]) {
      return bot.sendMessage(chatId, `Правильно! Ты отгадал цифру ${chats[chatId]}`, optionsDigitGameStartAgain);
    } else {
      return bot.sendMessage(chatId, `Не угадал, я загадал цифру ${chats[chatId]}`, optionsDigitGameStartAgain);
    }
  })
}

const startDigitGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Я загадываю число от 0 до 9...');
  const randomDigit = Math.floor(Math.random() * 10);
  chats[chatId] = randomDigit;
  await bot.sendMessage(chatId, 'Отгадай:', optionsDigitGame);
}

start();