# CSSS Kiosk Site

The application that runs on the SFU CSSS's common room touchscreen.
It uses Angular for the frontend and Express for the proxy server.

## Development

You will need `node`.
The repository is an npm workspace containing the Angular frontend and Express proxy server.

### Setting up your environment

1. Clone the repository.
2. Install all workspace dependencies from the repository root.

   ```bash
   # in path/to/csss-site-kiosk
   npm install
   ```

3. Create `server/.env` by copying `server/.env.example`. See
   [Environment variables](#environment-variables) for the available settings.

The frontend API client is generated automatically before frontend start and build commands. By
default it uses the OpenAPI document from `@sfucsss/backend-openapi`. To generate from a CSSS
backend running locally instead, run `npm run api:url` from the repository root.

## Running this locally

Make sure you've completed [Setting up your environment](#setting-up-your-environment) first.

There are several root-level commands depending on the part of the application you are working on.
The frontend sends requests based on the file selected from `frontend/src/environments/`.

By default the application is available at [http://localhost:8080](http://localhost:8080).

### Full application

Build the frontend and start the Express server:

```bash
npm start
```

For development, run the production frontend build watcher and Express server together:

```bash
npm run dev
```

### Frontend only

Use this if you only need to work on the UI.

- The frontend will be built using its `development` environment.
- The frontend will send requests directly to `localhost:3049`.

```bash
# in path/to/csss-site-kiosk
npm run start:frontend
```

### Frontend + proxy server

Use this if you need the proxy server running as well.

- The proxy serves the latest build from `frontend/dist/csss-kiosk-site/browser/`.
- The frontend will be built using the `production` environment and send requests to `localhost:SERVER_PORT` (default 8080).
- The proxy will send requests to `PROXY_TARGET` (default `localhost:3049`).

```bash
# in path/to/csss-site-kiosk
npm run build
npm run start:server
```

## Environment Variables

There are two sets of environment variables: one for the frontend and one for the proxy.
The frontend environment defaults can be found in
[frontend/src/environments](frontend/src/environments/).

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
| PROXY_TARGET     | `http://localhost:3049` | Where the proxy will forward its requests to.                                               |
| SERVER_PORT      | `8080`                  | The port the proxy will be served from.                                                  |
