# Курсовой проект Чат. Спринт 1

## Страницы проекта

[Прототипы дизайна страниц](https://www.figma.com/file/ko0yhDeNEP1BOH26fyuIvl/Sur-Chat?node-id=0%3A1)

[Верстка страниц](https://glistening-cactus-b24c7b.netlify.app/)

Страницы профиля нет, т.к. в моей реализации настройки профиля производятся в модальном окне на странице чатов, где пока заглушка.
Верстка проверялась только в актуальном хроме.

## Команды

```
npm run start — запуск
npm run build — сборка
npm run dev — запуск в режиме разработки
```

## БЭМ

#### Схема именования БЭМ-сущностей:
- В именаях БЭМ-сущностей для разделения слов вместо дефиса используется camel case (someBlock). 
- Имя элемента отделяется от имени блока двумя подчеркиваниями (someBlock__someElement).
- Имя модификатора отделяется от имени блока или элемента двумя дефисами (someBlock__someElement--disabled).
- Значение модификатора отделяется от имени модификатора одним подчеркиванием (someBlock__someElement--theme_coolTheme).

Блоки, для которых не предусматривается повторное использование за пределами приложения, предваряются подчеркиванием (_someNoBemBlock). 
В них могут не соблюдаются требования к БЭМ-сущностям, в основном это базовые модули приложения (шаблон, страница, главный модуль). 

## Структура проекта

Следовал рекомендуемой в курсе структуре, но относительно нее добавлена папка models, где лежит класс-обертка для шаблонизатора, 
а также классы, где описал отношения между сущностями: лейаут (макет/шаблон страницы), страница и компонент/модуль.
Базовый модуль app связывает шаблоны составных сущностей и рендерит страницу согласно урлу в браузере.