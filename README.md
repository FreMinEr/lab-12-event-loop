# Lab 12: Event Loop and EventEmitter

**Student:** Parfenok Ivan Nikolaevich (Парфёнок Иван Николаевич)  
**Group:** 477  
**Variant (list number):** 17

## Goal

Practice Node.js timers, the event loop, and EventEmitter by building an event-driven HTTP server.

## How to run

```bash
npm start
node event-loop-demo.js
```

The server listens on port `3000` and stops automatically after 10 seconds.

## Tasks

1. Event-driven HTTP server (`AppServer`)
2. File logger subscribed to server events (`logger.js`)
3. Async order processing with timers (`OrderHandler`, `GET /order/<id>`)
4. Event loop demo (`event-loop-demo.js`)
5. Custom `user:action` event (`UserTracker`)
