# Tauri + Deno

This repo shows you how to setup a cross-platform desktop app using Tauri but
with Deno as a web server. The web server is fully secured and is only
accessible by the Tauri webview via token authentication that can be verified
via Rust only. Accessing the webserver outside of the Rust and the Tauri webview
will be blocked completely.
<br />

##### A Tauri + Bun version is available [here](https://github.com/niraj-khatiwada/tauri-bun).

<img src="/assets/hero.png" style="object-fit: contain;" />
<img src="/assets/process.png" style="object-fit: contain;" />

### Development

Install [Deno](https://deno.com/). The project uses npm workspace so make sure
to install [Node](https://nodejs.org) as well. (Deno doesn't work quite well
with frontend inside client `apps/client` so we need to install Node.js as well.
The Bun version of this repo requires only Bun.)

- Run the client server:

```
cd ./apps/client
npm run dev
```

- Run the web server:

```
cd ./apps/server
deno run dev
```

- Run the Tauri server:

```
npm run tauri:dev
```

### Production

In production, the Deno web server is compiled as a standalone binary and this
binary is embedded as a sidecar in Tauri.

```
npm run tauri:build
```
