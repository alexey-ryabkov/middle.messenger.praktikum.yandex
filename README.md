# Курсовой проект Мессенджер

## О проекте

Проект по созданию мессенджера (клиентское веб-приложение) без использования фреймворков (за исключением ExpressJs для раздачи статики), на базе flux-архитектуры.

[Прототипы дизайна страниц](https://www.figma.com/file/ko0yhDeNEP1BOH26fyuIvl/Sur-Chat?node-id=0%3A1)

Приложение развернуто на сервисах [netlify](https://glistening-cactus-b24c7b.netlify.app/) (сборка с помощью parcel) и на [render-com](https://sur-chat.onrender.com/messenger) (сборка с помощью webpack).

Верстка проверялась только в актуальном хроме, неадаптивна.

## Команды

#### Команды сборки webpack`ом:
```
npm run start — запуск
npm run build — сборка
npm run dev — запуск в режиме разработки
```

#### Команды сборки parcel`ом:
```
npm run start:parcel — запуск
npm run build:parcel — сборка
npm run dev:parcel — запуск в режиме разработки
```

#### Команды линтинга и тестирования:
```
npm run lint — запуск линтинга ts- и scss-кода
npm run lint:scss-fix — запуск линтинга scss-кода с автоматическим исправлением ошибок
npm run test — запуск тестов с использованием библиотек mocha и chai
npm run checker — запуск всех проверок (линтинг и тестирование); эта команда настроена на прекоммит с помощью husky
```

#### Прочие команды
```
npm run clean — очистка установленных модулей проекта
npm run reinstall - переустановка модулей проекта
```

## Структура проекта

Следовал рекомендуемой в курсе структуре (components, layouts, pages, modules, etc). При этом те составные элементы приложения, которые "не знают" в построении какого приложения они участвуют, собраны в папке src/lib, - они смогут быть использованы повторно в другом приложении. Остальные, завязанные на структуре и особенностях данного приложения - в папке src/app. 

В папке src/app/entities собраны классы и типы, описывающие базовые сущности приложения. Классы предоставлют структурированный интерфейс к данным из стора для комопонетов и модулей, но не являются моделями в mvc понимании, т.к. занимаются в том числе бизнес-логикой приложения.

Общие стили приложения находятся в модуле main (app/modules/main), который является контейнером приложения и предоставляет рабочую область для его функционала.

## БЭМ

#### Схема именования БЭМ-сущностей:
- В именаях БЭМ-сущностей для разделения слов вместо дефиса используется camel case (someBlock). 
- Имя элемента отделяется от имени блока двумя подчеркиваниями (someBlock__someElement).
- Имя модификатора отделяется от имени блока или элемента двумя дефисами (someBlock__someElement--disabled).
- Значение модификатора отделяется от имени модификатора одним подчеркиванием (someBlock__someElement--theme_coolTheme).

Блоки, для которых не предусматривается повторное использование за пределами приложения, предваряются подчеркиванием (_someNoBemBlock). 
В них могут не соблюдаются требования к БЭМ-сущностям, в основном это базовые модули приложения (шаблон, страница, главный модуль). 
