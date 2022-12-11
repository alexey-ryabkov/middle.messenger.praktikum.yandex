import {JSDOM} from 'jsdom';

const {window} = new JSDOM('<div class="_mockApp"></div>', 
{ 
    url: 'http://localhost:3000' 
});
global.window = <unknown>window as Window & typeof globalThis;
global.document = window.document;
global.FormData = window.FormData;
global.XMLHttpRequest = window.XMLHttpRequest;
global.HTMLElement = window.HTMLElement;
