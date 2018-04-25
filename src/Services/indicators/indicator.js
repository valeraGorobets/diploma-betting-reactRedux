export default class Indicator {
  constructor() {
    if (new.target === Indicator) {
      throw new TypeError('Cannot construct Indicator instances directly');
    }
  }
  
}