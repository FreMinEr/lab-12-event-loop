/**
 * Event loop demo (Lab 12, task 4)
 * Student: Parfenok Ivan Nikolaevich, group 477, variant 17
 *
 * Typical output order:
 *   5. Синхронный код
 *   3. process.nextTick
 *   4. Promise.then
 *   1. setTimeout
 *   2. setImmediate
 *
 * Why this order (Node.js event loop phases):
 * 1. Synchronous code runs first on the current call stack. Nothing from the
 *    event loop is processed until the stack is empty.
 * 2. process.nextTick callbacks run next. They are not a loop phase; they are
 *    drained from the nextTick queue immediately after the current operation
 *    and before other microtasks / phases.
 * 3. Promise.then callbacks are microtasks (the microtask queue). After
 *    nextTick is empty, pending microtasks run. That is why Promise.then
 *    prints after process.nextTick and before timers.
 * 4. setTimeout(..., 0) is scheduled on the timers phase. After microtasks,
 *    the loop enters the timers phase and runs expired timers.
 * 5. setImmediate is scheduled on the check phase, which comes after timers
 *    (and I/O) in the same iteration when the script is started from the
 *    main module. So setImmediate usually prints after setTimeout(0) here.
 *
 * Note: between setTimeout(0) and setImmediate the relative order can depend
 * on how the script was started (main vs inside I/O). In this file, started
 * as the main script, timers run before check, so 1 then 2.
 */

setTimeout(() => {
  console.log('1. setTimeout');
}, 0);

setImmediate(() => {
  console.log('2. setImmediate');
});

process.nextTick(() => {
  console.log('3. process.nextTick');
});

Promise.resolve().then(() => {
  console.log('4. Promise.then');
});

console.log('5. Синхронный код');
