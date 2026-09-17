const http = require('http');
const EventEmitter = require('events');
const logger = require('./logger');

/**
 * Lab 12: event-driven HTTP server
 * Student: Parfenok Ivan Nikolaevich, group 477, variant 17
 */

function computePi() {
  // Nilakantha series: pi = 3 + 4/(2*3*4) - 4/(4*5*6) + 4/(6*7*8) - ...
  let pi = 3;
  for (let n = 2; n < 200000; n += 2) {
    const term = 4 / (n * (n + 1) * (n + 2));
    pi += ((n / 2) % 2 === 1) ? term : -term;
  }
  return (Math.floor(pi * 1e7) / 1e7).toFixed(7);
}

class AppServer extends EventEmitter {
  constructor() {
    super();
    this.server = null;
    this.orderHandler = new OrderHandler();
  }

  start(port) {
    this.server = http.createServer((req, res) => {
      this.emit('request:received', {
        url: req.url,
        method: req.method
      });

      const orderMatch = /^\/order\/([^/?#]+)/.exec(req.url || '');
      if (req.method === 'GET' && orderMatch) {
        const orderId = decodeURIComponent(orderMatch[1]);
        this.orderHandler.processOrder(orderId);
        res.writeHead(202, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Order #${orderId} accepted`);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Hello from Event-Driven Server!');
    });

    this.server.listen(port, () => {
      this.emit('server:started', port);
    });
  }

  stop() {
    if (!this.server) {
      return;
    }
    this.server.close(() => {
      this.emit('server:stopped');
    });
  }
}

class OrderHandler extends EventEmitter {
  processOrder(orderId) {
    this.emit('order:start', orderId);

    setTimeout(() => {
      this.emit('order:processing', { orderId, message: 'Идёт обработка...' });
    }, 2000);

    setTimeout(() => {
      const sum = Math.floor(Math.random() * 901) + 100;
      this.emit('order:complete', { orderId, sum });
    }, 4000);
  }
}

class UserTracker extends EventEmitter {
  trackAction(userId, action, metadata) {
    this.emit('user:action', {
      userId,
      action,
      timestamp: new Date().toISOString(),
      metadata,
      id: Math.random().toString(36).substr(2, 9)
    });
  }
}

const app = new AppServer();

app.on('server:started', (port) => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
});

app.on('request:received', (info) => {
  console.log(`📨 Получен запрос: ${info.method} ${info.url}`);
});

app.on('server:stopped', () => {
  console.log('🛑 Сервер остановлен');
});

app.orderHandler.on('order:start', (orderId) => {
  console.log(`[order:start] Заказ #${orderId} начат`);
});

app.orderHandler.on('order:processing', ({ orderId, message }) => {
  console.log(`[order:processing] Заказ #${orderId}: ${message}`);
});

app.orderHandler.on('order:complete', ({ orderId, sum }) => {
  const pi = computePi();
  console.log(`💰 Заказ #${orderId} завершён на сумму ${sum} руб. PI = ${pi}`);
});

logger.setupLogger(app);

const tracker = new UserTracker();
tracker.on('user:action', (event) => {
  console.log(`👤 Пользователь ${event.userId} совершил действие "${event.action}"`);
  console.log(`Время: ${event.timestamp}`);
  console.log(`ID события: ${event.id}`);
  console.log(`Доп. данные: ${JSON.stringify(event.metadata)}`);
});

tracker.trackAction(17, 'login', { group: 477, source: 'web' });
tracker.trackAction(17, 'open-lab', { lab: 12, variant: 17 });
tracker.trackAction(17, 'create-order', { path: '/order/42' });

app.start(3000);

setTimeout(() => {
  app.stop();
}, 10000);

module.exports = { AppServer, OrderHandler, UserTracker, computePi };
