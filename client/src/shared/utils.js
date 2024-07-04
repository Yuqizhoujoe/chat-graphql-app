export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      return fn.apply(this, args);
    }, delay);
  };
};
