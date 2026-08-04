# CSSS Kiosk Site

The application that runs on the SFU CSSS's common room touchscreen.
It uses Angular for the frontend and Express for the proxy server.

## Development

You will need `node`, `npm`, and the CSSS backend server (potentially).

### Setting up your environment

1. Clone the repository.
2. Install all dependencies.
```bash
# in path/to/csss-site-kiosk
npm install # Installs the frontend dependencies
npm run server:install # Installs the server dependencies
```
3. Run the CSSS backend server locally or download the `openapi.json` file from it and name it `src/app/api/backend-api.json`.
4. Run the API generator for the frontend.
```bash
# in path/to/csss-site-kiosk
npm run api:url # If you have the backend server running on localhost:3049
npm run api:file # If you have the file at `src/app/api/backend-api.json`
```
5. Create `server/.env` by copying `server/.env.example`. See [Environment variables](#environment-variables) to see what each does.
6. Once you've done all of this you can move on to [Running this locally](#running-this-locally).

## Running this locally

Make sure you've done everything in [Setting up your environment](#setting-up-your-environment) before running these.

There are a few ways to run this application, use whatever you want based on the domain you're working on.
The frontend will send requests based on the file it's using in `src/environments/`.

By default will be accessible on [https://localhost:8080](https://localhost:8080) once it's running.

### Frontend only

Use this if you only need to work on the UI.

- The frontend will be built using its `development` environment.
- The frontend will send requests directly to `localhost:3049`.

```bash
# in path/to/csss-site-kiosk
npx ng serve # just `ng serve` if you have the Angular CLI installed globally
```

### Frontend + proxy server

Use this if you need the proxy server running as well.

- The proxy will serve whatever is in `dist/csss-site-kiosk/browser/`.
- The frontend will be built using the `production` environment and send requests to `localhost:SERVER_PORT` (default 8080).
- The proxy will send requests to `PROXY_TARGET` (default `localhost:3049`).

```bash
# in path/to/csss-site-kiosk
npm run dev
```

## Environment Variables

There are two sets of environment variables: one for the frontend and one for the proxy.
The frontend environment defaults can be found in [src/environments](src/environments/).

| Variable   | Default (development)       | Description                                               |
|------------|-----------------------------|-----------------------------------------------------------|
| production | `false`                     | The environment the frontend assumes it's in.             |
| csssApiUrl | `http://localhost:3049/api` | The target for requests going to the CSSS backend server. |
| appUrl     | `http://localhost:8080`     | The URL this server is served from.                       |


The proxy server uses `server/.env`.

| Variable         | Default                 | Description                                                                              |
|------------------|-------------------------|------------------------------------------------------------------------------------------|
| NODE_ENV         | `development`           | The environment the proxy assumes it's in.                                              |
| KIOSK_API_SECRET | `secret_on_backend`     | The authorization bearer key that the CSSS backend server will use to authenticate requests. |
| PROXY_TARGET     | `http://localhost:3049` | Where the proxy will forward its requests.                                               |
| SERVER_PORT      | `8080`                  | The port the proxy will be served from.                                                  |

