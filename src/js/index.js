import string from './models/Search';
import { add as a, multiply, ID } from './views/searchView';
import * as searchView from './views/searchView';
console.log(`Using imported functions: add as a - ${a(ID, 2)} and multiply - ${multiply(3,5)}. As well as, ${string}`);
console.log(`Using imported functions, importing everything: add - ${searchView.add(ID, 2)} and multiply - ${searchView.multiply(3,5)}.`);