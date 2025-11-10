/// <reference lib="deno.ns" />
import process from 'node:process'

import { authMiddleware } from './middleware.ts'
import { listenRustIPC } from './rust-ipc.ts'

listenRustIPC()

const DEFAULT_PORT = 3000
const PORT = process.env['PORT'] ?? `${DEFAULT_PORT}`

const isProd = process.env.NODE_ENV === 'production'

function handleCors(_: Request, res: Response) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Headers', '*')
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  return res
}

Deno.serve(
  {
    port: !Number.isNaN(PORT) ? +PORT : DEFAULT_PORT,
    hostname: '127.0.0.1',
    onListen: (server) => {
      // biome-ignore lint/suspicious/noConsole: <>
      console.log(
        `Deno server running at http://${server?.hostname}:${server.port}`,
      )
    },
  },
  async (req) => {
    if (req.method === 'OPTIONS') {
      return handleCors(req, new Response(null, { status: 204 }))
    }

    if (isProd) {
      const authResp = await authMiddleware(req)
      if (authResp) return handleCors(req, authResp)
    }

    const url = new URL(req.url)
    if (url.pathname === '/') {
      return handleCors(
        req,
        new Response(JSON.stringify({ data: 'Hello from Deno!' })),
      )
    }
    if (url.pathname === '/ping') {
      return handleCors(req, new Response(JSON.stringify({ data: 'pong' })))
    }

    return handleCors(req, new Response('Not Found', { status: 404 }))
  },
)
