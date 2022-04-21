# Cервис Movies - API 📽🎞❤️‍🔥

Сервис, в котором можно найти фильмы по запросу и сохранить в личном кабинете. 🔎

### Функциональность:

Реализваны регистрация, авторизация и редактирование профиля пользования. 🎭

Роуты /saved-movies, /profile и /movies защищены авторизацией. 🛡

Все поля всех форм валидируются, польтзователь получает сообщения об ошибках. 📌

Созданы асинхронные запросы к API, ⚡

JWT-токен хранится в cookies, 🍪

Настроен прелоадер на время, пока от сервера идёт ответ, 💫

Лайк по иконке лайка отправляет запрос на сохранение фильма в созданном API. Добавленный фильм отображается на странице сохранённых фильмов. 📺

Дизлайк или кнопка удаления на странице сохраненных фильмов отправляет запрос на удаление фильма из созданного API. 💔

## Технологии 🔨

- JavaScript
- NodeJS
- ExpressJS
- MongoDB

## [Ссылка на front для этого приложения](https://github.com/Spheno/movies-explorer-frontend)

## Установка ⚙

В удобной для вас папке запустите:

```
git clone https://github.com/Spheno/movies-explorer-api.git
```

В папке проекта:

```
npm install
```

Для корректной работы потребуется установленная и запущенная MongoDB версии 5.0 и выше.

Официальная инструкция для установки и запуска MongoDB - https://www.mongodb.com/docs/manual/administration/install-community/

А теперь все запускаем на ❗3000❗ порту:

```
npm run start
```
