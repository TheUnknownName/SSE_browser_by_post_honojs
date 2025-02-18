import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import {SSEStreamingApi, streamSSE} from 'hono/streaming';
import {isNull} from "node:util";

const app = new Hono();
const clients: SSEStreamingApi[] = []; // Store active SSE clients

// Middleware for CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
}));

app.use("sse/*",async (c,next)=>{
  c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');
    c.header('Access-Control-Allow-Origin', '*');
    c.header('X-Accel-Buffering', 'no');
  await next();
})

// POST endpoint to send data to SSE clients
app.post('/message', async (c) => {
  const body = await  c.req.json();
  console.log('📨 Received message:', body);

  // Send data to all active SSE clients
  console.log(body.message);
  if (body.message) {
    clients.forEach((stream) => {
      stream.writeSSE({ data: JSON.stringify(body), event: 'message' });
    });
  }

  return c.json({ message: 'Message sent to clients' });
});

// SSE Endpoint
app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    console.log('🔌 New SSE client connected');

    let fun = async () => {
      await stream.sleep(1000);
    }

    clients.push(stream);

    while (1){
      await fun();
    }

    // Handle client disconnect
    stream.onAbort(() => {
      console.log('❌ SSE client disconnected');
      clients.splice(clients.indexOf(stream), 1);
    });
  });
});

// Start server
serve({ fetch: app.fetch, port: 3000 });
console.log('🚀 Server running on http://localhost:3000');
