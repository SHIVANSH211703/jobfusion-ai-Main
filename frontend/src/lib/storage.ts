const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T>(key: string): T | null {
    if (!isBrowser) return null;

    const value = localStorage.getItem(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  },

  set(key: string, value: unknown): void {
    if (!isBrowser) return;

    if (typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string): void {
    if (!isBrowser) return;

    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isBrowser) return;

    localStorage.clear();
  },
};