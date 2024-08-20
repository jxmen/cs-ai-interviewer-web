class LocalStorage {
  constructor() {
  }

  static logout() {
    if (!LocalStorage.removeItem('accessToken')) return false
    if (!LocalStorage.removeItem('refreshToken')) return false

    return true
  }

  static isLoggedIn() {
    return LocalStorage.hasItem('accessToken') && LocalStorage.hasItem('refreshToken');
  }

  static setItem(key, item) {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, item);
      return true
    }

    return false
  }

  static getItem(key) {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  }

  static removeItem(key) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
      return true
    }

    return false
  }

  static hasItem(key) {
    if (typeof window !== "undefined") {
      return LocalStorage.getItem(key) !== null;
    }

    return false;
  }

}

export default LocalStorage;
