веб-приложение "мессенджер"

Зависимости:
- TypeScript (^5.9.2)
- Vite (^7.1.3)
    - Проект запускаenся на 3000 порту.
    - Сборка и запуск проекта - `npm run start`
    - Запуск проекта в режиме разработки  - `npm run dev`
- PostCSS (^8.5.6)
- Hаndlebars (с компиляцией на стороне клиента) (^4.7.8)
- Netlify (настроен автодеплой из ветки deploy) - https://lenaschat.netlify.app/

Экраны ([макеты](https://www.figma.com/design/DREP04CXtc20hg7oYzcThE/my-messenger?node-id=0-1&p=f&t=GT1khhNJKRhHLTQd-0))
- Авторизация ([/pages/login/index.html](https://lenaschat.netlify.app/pages/login/index.html))
    - с формой, имена полей: `login`, `password`
    - с кнопкой `Sign in`
    - с ссылкой на страницу регистрации `Register`
- Регистрация ([/pages/register/index.html](https://lenaschat.netlify.app/pages/register/index.html))
    - с формой, имена полей: `first_name`, `second_name`, `login`, `email`, `password`, `phone`
    - с кнопкой `Sign up`
- Список чатов и лента переписки ([/pages/chats/index.html](https://lenaschat.netlify.app/pages/chats/index.html))
    - имя поля для ввода сообщения: `message`
- Настройки пользователя ([/pages/profile/index.html](https://lenaschat.netlify.app/pages/profile/index.html))
    - Имена полей для изменения информации о пользователе: `first_name`, `second_name`, `display_name`, `login`, `email`, `phone`
    - Поле для изменения аватара: `avatar`
    - Поля для изменения пароля: `oldPassword`, `newPassword`
- Страница 404 ([/pages/notFound/index.html](https://lenaschat.netlify.app/pages/notFound/index.html))
- Страница 5** ([/pages/fatal/index.html](https://lenaschat.netlify.app/pages/fatal/index.html))
