// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';  
  
global.crypto = {  
  randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)  
} as any;

const req = require as any;

(require as any).context = (  
  _dir: string,  
  _recursive?: boolean,  
  _match?: RegExp  
) => {  
  const ctx = (_id: string) => '';  
  ctx.keys    = () => [] as string[];  
  ctx.resolve = (_id: string) => '';  
  ctx.id      = _dir;  
  return ctx;  
};