export const Debounce = (fn, t) => {
  let delay = t || 500;
  let timer;
  return function() {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, delay);
  };
};
export const Throttle = (fn, t) => {
  let last;
  let timer;
  // 默认fn为500毫秒节流执行的函数
  let interval = t || 500;
  return function() {
    let args = arguments;
    let now = +new Date();
    // 如果本次执行没有达到间隔，就清除计时器,不允许fn执行，则进行一次新的计时。
    // 不把Throttle(fn,t)设计成回调函数，只需要在新的计时器执行时，重置last！
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
      // 到点了，允许fn执行并且重置last
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
};
