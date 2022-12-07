# Курсовой проект Чат. Спринт 3

## О проекте

[Прототипы дизайна страниц](https://www.figma.com/file/ko0yhDeNEP1BOH26fyuIvl/Sur-Chat?node-id=0%3A1)

[Приложение](https://glistening-cactus-b24c7b.netlify.app/)

Верстка проверялась только в актуальном хроме, неадаптивна.

**Пока реализован только функционал простых чатов (между двумя пользователями). Собеседник, заданный через логин, добавляется в чат автоматически при его создании.**

## Структура проекта

Следовал рекомендуемой в курсе структуре (components, layouts, pages, modules, etc). При этом те составные элементы приложения, которые "не знают" в построении какого приложения они участвуют, собраны в папке lib, - они смогут быть использованы повторно в другом приложении. Остальные, завязанные на структуре и особенностях данного приложения - в папке app. 

В папке app/models - классы, описывающие базовые сущности приложения. Они предоставлют структурированный интерфейс к данным из стора для комопонетов и модулей, но не являются моделями в mvc понимании, т.к. занимаются в том числе бизнес-логикой приложения.

## БЭМ

#### Схема именования БЭМ-сущностей:
- В именаях БЭМ-сущностей для разделения слов вместо дефиса используется camel case (someBlock). 
- Имя элемента отделяется от имени блока двумя подчеркиваниями (someBlock__someElement).
- Имя модификатора отделяется от имени блока или элемента двумя дефисами (someBlock__someElement--disabled).
- Значение модификатора отделяется от имени модификатора одним подчеркиванием (someBlock__someElement--theme_coolTheme).

Блоки, для которых не предусматривается повторное использование за пределами приложения, предваряются подчеркиванием (_someNoBemBlock). 
В них могут не соблюдаются требования к БЭМ-сущностям, в основном это базовые модули приложения (шаблон, страница, главный модуль). 

## Команды

```
npm run start — запуск
npm run build — сборка
npm run dev — запуск в режиме разработки
```
