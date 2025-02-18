import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import EventEmitter from 'events';

const app = new Hono();
const emitter = new EventEmitter();

// Apply CORS middleware to all routes
app.use('*', cors({
    origin: 'http://localhost:8080', // Specify the allowed origin
    methods: 'GET, OPTIONS, POST', // Specify allowed methods
    headers: 'Content-Type, Authorization', // Specify allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

// Middleware for SSE headers
app.use('/sse/*', (c, next) => {
    c.header('Content-Type', 'text/event-stream');
    c.header('Cache-Control', 'no-cache');
    c.header('Connection', 'keep-alive');
    return next();
});

// POST endpoint to send data to the SSE stream
app.post('/message', async (c) => {
    const body = await c.req.json();
    const message = body.message;
    emitter.emit('message', message);
    return c.json({ message: 'Message sent' });
});

// SSE Endpoint
app.get('/sse', async (c) => {
    return streamSSE(c, async (stream) => {
        const handler = (message: string) => {
            stream.writeSSE({
                data: message,
                event: 'message',
            });
        };

        stream.onAbort(() => {
            console.log('Connection aborted');
        });

        emitter.on('message', handler);

        // Cleanup when the stream is closed
        return () => {
            emitter.off('message', handler);
        };
    });
});

// Start server
serve({ fetch: app.fetch, port: 3000 });
console.log('Server running on http://localhost:3000');