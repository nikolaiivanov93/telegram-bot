// require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");
require('dotenv').config();
// const unirest = require("unirest");
// const request = require('request');

const fetch = require('node-fetch');
// Создать бота с полученным ключом
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);


// Подключаем модуль multi-geocoder
var MultiGeocoder = require('multi-geocoder'),
    // Получаем доступ к сервису геокодирования.
    geocoder = new MultiGeocoder({
        coordorder: 'latlong',
        lang: 'ru-RU'
    });

    


// bot.command('custom', async (ctx) => {
//   return await ctx.reply('Custom buttons keyboard', Markup
//     .keyboard([
//       ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
//       ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
//       ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
//     ])
//     .oneTime()
//     .resize()
//   )
// })

// bot.command('random', (ctx) => {
//   return ctx.reply(
//     'random example',
//     Markup.inlineKeyboard([
//       Markup.button.callback('Coke', 'Coke'),
//       Markup.button.callback('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
//       Markup.button.callback('Pepsi', 'Pepsi')
//     ])
//   )
// })

// Обработчик начала диалога с ботом
bot.on('location', (ctx) => {
  Markup.removeKeyboard();
  console.log(ctx.message.location);
  const lon = ctx.message.location.longitude;
  const lat = ctx.message.location.latitude;
  // console.log(lon,lat, process.env.YANDEX_TOKEN);

  const url = `https://geocode-maps.yandex.ru/1.x?format=json&lang=ru_RU&kind=house&geocode=${lon},${lat}&apikey=${process.env.YANDEX_TOKEN}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const location = data;
      console.log(data.response.GeoObjectCollection.featureMember[0].GeoObject.description, data.response.GeoObjectCollection.featureMember[0].GeoObject.name);

        ctx.reply(`Вы находитесь по адресу ${data.response.GeoObjectCollection.featureMember[0].GeoObject.description}, ${data.response.GeoObjectCollection.featureMember[0].GeoObject.name}?`, 
    Markup.inlineKeyboard([
        [Markup.button.callback('Да', 'yes'), Markup.button.callback('Нет', 'no')], // Row1 with 2 buttons
      ])
    )
    });
  // console.log(location);
  // return await ctx.reply(`Вы находитесь по адресу ${data.response.GeoObjectCollection.featureMember[0].GeoObject.description}, ${data.response.GeoObjectCollection.featureMember[0].GeoObject.name}?`, 
  // Markup.keyboard([
  //     ['Да', 'Нет'], // Row1 with 2 buttons
  //   ])
  //   .oneTime()
  //   .resize()
  // )
  // geocoder.geocode([
  //   [ctx.message.location],
  //   [ctx.message.longitude]
  //   ], {
  //   // Описание объектов в ответе будет на алглийском языке,
  //   // несмотря на то что параметр lang задан также в конструкторе MultiGeocoder.
  //   lang: 'en-US'
  // })
  //   .then(function (res) {
  //       console.log(res);
  //   });
});

bot.action('yes', (ctx) => {
  setInfoUser(ctx)
})
bot.action('no', ctx => {
  ctx.reply('Введите адрес')
  bot.on('text', ctx => {
    setInfoUser(ctx);
  })
})

async function setInfoUser(ctx) {
  await ctx.reply('Укажите тип вашего автообиля',
  Markup.inlineKeyboard(
    [
      [Markup.button.callback('Седан', 'btn_1'), Markup.button.callback('Хетчбек', 'btn_2')],
      [Markup.button.callback('Кроссовер', 'btn_3'), Markup.button.callback('Минивен', 'btn_4')],
      [Markup.button.callback('Микроавтобус', 'btn_5')]
    ]
  )
  // Markup.keyboard([
  //   ['Седан', 'Хетчбек'],
  //   ['Кроссовер', 'Минивен'],
  //   ['Микроавтобус'] // Row1 with 2 buttons
  // ])
  //   .oneTime()
  //   .resize()
  )
  
  bot.action(['btn_1', 'btn_2', 'btn_3', 'btn_4', 'btn_5'], async (ctx) => {
    // console.log(ctx.message.text);
    await ctx.replyWithHTML('Cколько колес заблокировано на вашем автомобиле?', 
    Markup.inlineKeyboard(
      [
        [Markup.button.callback('1', 'btn_6'), Markup.button.callback('2', 'btn_7'), Markup.button.callback('3', 'btn_8'), Markup.button.callback('4', 'btn_9')]
      ]
    ),
    
    // Markup.keyboard([
    //   ['1', '2', '3', '4'],
    // ])
    //   .oneTime()
    //   .resize()
    )
    bot.action(['btn_6', 'btn_7', 'btn_8', 'btn_9'], async (ctx) => {
      await ctx.reply('Предоставьте ваш номер телефона, чтобы водитель смог связаться с вами',
      Markup.keyboard([
        Markup.button.contactRequest('Предоставить номер'),
      ])
      .resize()
      .oneTime()
    );

      bot.on('contact', async (ctx) => {
        await ctx.reply('Ваши данные отправлены ближайшему водителю. Скоро он с вами свяжется');
      });
    });
    
  })
}

bot.start(ctx => {
        console.log(ctx.message.chat.id);
        // сtx.reply(ctx.message);
  // ctx.reply(
  //   `Приветствую, ${
  //      ctx.from.first_name ? ctx.from.first_name : "хороший человек"
  //   }! Нажмите кнопку снизу, чтобы мы могли определить вашу геопозицию.`,
  //   Markup.keyboard([
  //       Markup.button.locationRequest('Предоставить геопозицию'),
  //   ])
  //   .resize()
  //   .oneTime()
  // )
});

// function getLocation(ctx) {
//   const { id, username, first_name, last_name } = ctx.from;

//     const url = 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/';

//     const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
//         'X-RapidAPI-Key': 'ef0834ad0dmsh0c5c32831d4cc5dp1e6559jsn1d566a806367'
//     }
//     };

//     let geolocation;
//     // console.log(ctx.message);
//     fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//             geolocation = json; 
//             // console.log(geolocation);
//             ctx.reply(`Кто ты в телеграмме:
//             id: ${id}
//             username: ${username}
//             Имя: ${first_name}
//             Фамилия: ${last_name}
//             chatId: ${ctx.chat.id}
//             Страна: ${geolocation.country}
//             Город: ${geolocation.country_capital}
//             Регион: ${geolocation.region}
//             Город: ${geolocation.city}
//             `);
//             console.log(geolocation.country)
//         })
//         .catch(err => console.error('error:' + err));
// }

// Обработчик команды /help
bot.help((ctx) => ctx.reply("Справка в процессе"));

// Обработчик команды /whoami
bot.command("whoami", (ctx) => {
  const { id, username, first_name, last_name } = ctx.from;

    const url = 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/';

    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com',
        'X-RapidAPI-Key': 'ef0834ad0dmsh0c5c32831d4cc5dp1e6559jsn1d566a806367'
    }
    };

    let geolocation;
    // console.log(ctx.message);
    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            geolocation = json; 
            // console.log(geolocation);
            ctx.reply(`Кто ты в телеграмме:
            id: ${id}
            username: ${username}
            Имя: ${first_name}
            Фамилия: ${last_name}
            chatId: ${ctx.chat.id}
            Страна: ${geolocation.country}
            Город: ${geolocation.country_capital}
            Регион: ${geolocation.region}
            Город: ${geolocation.city}
            `);
            console.log(geolocation.country)
        })
        .catch(err => console.error('error:' + err));

  

});

// Обработчик простого текста
// bot.on("Send location", (ctx) => {
//   ctx.reply('Send location');
// });

// Запуск бота
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))