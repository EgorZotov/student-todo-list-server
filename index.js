//Импорт зависимостей 
const Koa = require('koa'); // Ядро веб-сервера
const Router = require('koa-router'); // Роутер для обработки запросов на сервер
const views = require('koa-views'); // Библиотека для отрисовки страниц с помощью HTML шаблонизаторов
const app = new Koa(); // Создаём объект веб-серверного приложения
const router = new Router();// Создаём объект роутинга
const BodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const respond = require('koa-respond');

// Устанавливает удобный формат ответов на запросы
app.use(respond());

// Устанавливаем папку, которая статично будет отдавать файлы.
// В неё вы положите свои js и css файлы
app.use(serve(__dirname + '/public'));

// Устанавливаем обработчик тела запроса
app.use(BodyParser({
    enableTypes: ['json', 'form', 'text'],
    queryString: {
        depth: Infinity
    },
    jsonLimit: '5mb',
    strict: true,
    onerror: function (err, ctx) {
        ctx.throw('body parse error', 422)
    }
}));
// Указываем что стандартным HTMK шаблонизатором будет EJS и что все .ejs шаблоны находятся в папке views
app.use(views(__dirname + '/views', { extension : "ejs"})); 

// Таким образом описывается как будет обрабатываться запрос, в данном случае GET запрос /example
router.get("/example",async (ctx)  => {
    // ctx это объект называемый контекстом
    // в контексте хранится вся информация и методы для обработки запроса
    // подробнее тут (к сожалению только на английском) https://github.com/koajs/koa/blob/master/docs/api/context.md

    // Данный метод отдаёт в ответ на запрос html сгенерированный из ejs шаблона и переданной в него переменной
    await ctx.render('example', {
        title: "Сервер работает"
    });    
});

// Пример POST запроса
router.post("/example", async (ctx) => {
    const { text } = ctx.request.body;
    await ctx.ok({
        "status": "Ответ получен",
        text
    });
});

// Так надо :P
app.use(router.routes()).use(router.allowedMethods());

// Запуск сервера на порте 3000
app.listen(3000, () => {
    console.log("Server running on port 3000")
});

