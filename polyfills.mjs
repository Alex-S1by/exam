import 'core-js/full/promise/with-resolvers.js';

// Polyfill for environments where window is not available (e.g., server-side rendering)
//@ts-expect-error
if (typeof Promise.withResolvers === 'undefined') {
  if (typeof window !== 'undefined') {
    //@ts-expect-error
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  } else {
    //@ts-expect-error
    global.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}
