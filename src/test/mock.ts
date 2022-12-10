import {JSDOM} from 'jsdom';

const {window} = new JSDOM('<div id="mock-app"></div>', 
{ 
    url: 'http://localhost:3000' 
});
global.window = <unknown>window as Window & typeof globalThis;
global.document = window.document;
