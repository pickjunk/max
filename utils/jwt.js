// payload get payload from jwt
function payload(t) {
  const p = t.split('.')[1];
  return JSON.parse(atob(p));
}

export { payload };
