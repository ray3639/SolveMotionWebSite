let active = false;
globalThis.solveMotionReadPoseFrame = bytes => new Promise((resolve, reject) => {
  if (active || !(bytes instanceof Uint8Array)) {
    reject(new Error('Pose reader unavailable or busy'));
    return;
  }
  active = true;
  let worker;
  let timer;
  let finished = false;
  const finish = (error, result) => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    worker?.terminate();
    active = false;
    if (error) reject(new Error('Local pose inference unavailable'));
    else resolve(JSON.stringify(result));
  };
  try {
    worker = new Worker(new URL('pose_worker.mjs', import.meta.url), { type: 'module' });
    worker.onerror = () => finish(true);
    worker.onmessageerror = () => finish(true);
    worker.onmessage = event => finish(event.data?.ok !== true, event.data);
    timer = setTimeout(() => finish(true), 7000);
    const localCopy = bytes.slice();
    worker.postMessage(localCopy, [localCopy.buffer]);
  } catch (_) { finish(true); }
});
