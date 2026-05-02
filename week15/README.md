# Project Update - Week 15

Week 15 contains two term-project pieces:

- `week15/term-project`: Express authentication app with the Jest/Supertest acceptance tests.
- `week15/term-project/my-hawaii-app`: React Maui property page copied from Week 14, including weather and visitor dashboard components.

## Run the Maui Property Page

Start the backend API in one terminal:

```powershell
npm --prefix C:\ics385spring2026\week15\term-project\my-hawaii-app\server start
```

Start the React frontend in a second terminal:

```powershell
npm --prefix C:\ics385spring2026\week15\term-project\my-hawaii-app run dev
```

Open:

```text
http://localhost:5173
```

The visitor statistics dashboard opens from the `View Dashboard` button.

## Environment Files

The Week 14 `.env` file was not copied because it can contain API keys. Use:

```text
week15/term-project/my-hawaii-app/.env.example
week15/term-project/my-hawaii-app/server/.env.example
```

Create local `.env` files from those examples when you need weather or MongoDB data.

## Run Acceptance Tests

The authentication tests remain in `week15/term-project/tests/auth.test.js`.

```powershell
npm --prefix C:\ics385spring2026\week15\term-project test
```
