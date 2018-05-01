import { createStore } from 'redux';
import appReducer from '../Reducers/appReducer.js';

let store = createStore(appReducer);

export default store;