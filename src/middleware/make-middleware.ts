function _m(fns: any[], n: number, ...args: any[]) {
  if (n === fns.length - 1) return fns[n](...args);
  fns[n].apply(null, [...args, _m.bind(null, fns, n + 1)]);
}
export function middleware(...fns) {
  return _m.bind(null, fns, 0);
}
