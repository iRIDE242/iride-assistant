// Define pipe method for combining functions
export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

