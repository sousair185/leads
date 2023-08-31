const users = [
  { username: "sousair", password: "123456" },
  { username: "admin", password: "agenciacocrie" },
  { username: "igor", password: "odeiotd" },
];

export function authenticate(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
}
