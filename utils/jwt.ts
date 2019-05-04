// payload get payload from jwt
function payload(t: string): any {
  const p = t.split('.')[1];
  return JSON.parse(atob(p));
}

export { payload };
