// Pure tracker rules shared with the reader and covered by Node tests.
(() => {
  const requiredRatio = ({height}, viewportHeight) => Math.min(.5, Math.max(.05, Math.min(height, viewportHeight) * .5 / Math.max(1, height)));
  const qualificationStart = ({wasVisible, visible, wasActive, active, qualifiedAt}, now) => visible && active ? ((!wasVisible || !wasActive || !qualifiedAt) ? now : qualifiedAt) : 0;
  const retryQueue = (queue, attemptedIds, maxAttempts) => queue.map(event => attemptedIds.has(event.event_id) ? {...event, attempts:(event.attempts || 0)+1} : event).filter(event => (event.attempts || 0) < maxAttempts);
  globalThis.ReaderTrackerCore = {requiredRatio, qualificationStart, retryQueue};
})();
