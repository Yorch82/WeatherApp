const createStorage = () => ({
  getItem: (key) =>
    Promise.resolve(
      typeof window === 'undefined' ? null : window.localStorage.getItem(key)
    ),
  setItem: (key, value) =>
    Promise.resolve(
      typeof window === 'undefined'
        ? undefined
        : window.localStorage.setItem(key, value)
    ),
  removeItem: (key) =>
    Promise.resolve(
      typeof window === 'undefined'
        ? undefined
        : window.localStorage.removeItem(key)
    ),
});

const storage = createStorage();

export default storage;
