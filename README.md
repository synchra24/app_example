# Example `@synchra24/app`

Этот проект является примером гибридного web-приложения, которое открывается внутри мобильного приложения Synchra.24 и использует пакет [`@synchra24/app`](https://www.npmjs.com/package/@synchra24/app) для общения с native-слоем через bridge.

Пример нужен как живая песочница для проверки bridge-методов и как стартовая точка для разработки собственных внутренних сервисов.

## Что показывает example

В демо уже подключены и проверяются основные возможности `@synchra24/app`:

- `requestApi` для вызова разрешенного API Synchra
- `getGeoPosition` для получения текущей геопозиции
- `selectUsers` для открытия native-выбора пользователей
- `takePhoto` для фото с камеры
- `pickPhoto` для выбора фото из галереи
- `pickFile` для выбора файла
- `scanQr` для сканирования QR-кода
- `showSnackbar` для native snackbar
- `openModal` для native модального окна
- `selectDate` и `selectDateRange` для календарей
- `selectTime` для выбора времени
- `navigate` для перехода на внутренние экраны приложения
- `getSynchraTheme` и `onSynchraThemeChange` для работы с темой Synchra
- `isSynchraIntegrated` для проверки, что приложение реально открыто внутри Synchra

Основной пример находится в [src/App.tsx](/Users/filippzulev/Documents/synchra24/synchra_hybrid_service/hyprid/src/App.tsx).

## Установка

```bash
npm install
```

## Запуск в dev-режиме

```bash
npm run dev
```

По умолчанию проект запускается через Vite.

## Production-сборка

```bash
npm run build
```

## Структура

- [src/App.tsx](/Users/filippzulev/Documents/synchra24/synchra_hybrid_service/hyprid/src/App.tsx) — основной demo-экран
- [package.json](/Users/filippzulev/Documents/synchra24/synchra_hybrid_service/hyprid/package.json) — зависимости и скрипты
- [src/App.css](/Users/filippzulev/Documents/synchra24/synchra_hybrid_service/hyprid/src/App.css) — базовые стили примера

## Как это работает

В приложении создается экземпляр:

```ts
import { SynchraApp } from "@synchra24/app";

const synchraApp = new SynchraApp("SERVICE_TOKEN");
```

`SERVICE_TOKEN` — это токен внутреннего сервиса, выданный в Synchra.24.  
Каждый вызов bridge автоматически отправляет этот токен в native-слой, где он проходит проверку.

После этого можно вызывать bridge-методы:

```ts
const integrated = await synchraApp.isSynchraIntegrated();

if (!integrated) {
  console.log("Приложение открыто вне Synchra или токен невалиден");
}

const position = await synchraApp.getGeoPosition();
console.log(position.latitude, position.longitude);
```

## Как открыть example внутри Synchra

1. Соберите и разместите web-приложение на доступном URL.
2. В админке Synchra создайте внутренний сервис.
3. Укажите URL этого приложения.
4. Возьмите выданный сервисный токен.
5. Подставьте этот токен в `new SynchraApp("SERVICE_TOKEN")`.
6. Откройте созданный сервис из раздела приложений в мобильном клиенте Synchra.

Если приложение открыто не внутри Synchra, метод `isSynchraIntegrated()` вернет `false`, и часть native-функций работать не будет.

## Что важно помнить

- Этот проект рассчитан именно на запуск внутри WebView Synchra.
- В обычном браузере bridge-методы либо не сработают, либо вернут ошибку интеграции.
- Для некоторых методов нужны системные разрешения устройства, например камера или геопозиция.
- Методы, связанные с файлами и фото, лучше тестировать на реальном устройстве.

## Пример методов

### Вызов API

```ts
const provider = await synchraApp.getProviderContext();

const data = await synchraApp.requestApi({
  method: "GET",
  path: `providers/lite/user/${provider.user_id}`,
});
```

### Выбор файла

```ts
const file = await synchraApp.pickFile({
  upload: false,
});

console.log(file.name);
console.log(file.size);
console.log(file.local_uri);
```

### Переход на внутренний экран

```ts
await synchraApp.navigate({
  action: "navigate",
  screen: "ContactsUsers",
});
```

### Подписка на тему

```ts
const theme = synchraApp.getSynchraTheme();

const unsubscribe = synchraApp.onSynchraThemeChange((theme) => {
  console.log(theme.current);
});
```

## Для разработки новых bridge-методов

Если в example добавляется новый bridge:

1. Сначала реализуется native-обработчик в `Synchra24`.
2. Затем добавляется typed API в пакет `@synchra24/app`.
3. После этого новый метод желательно сразу показать и проверить в этом example-проекте.

Так demo остается актуальным и одновременно служит smoke-check для библиотеки.

## Связанные проекты

- [@synchra24/app package](https://github.com/synchra24/app)

