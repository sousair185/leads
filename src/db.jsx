const users = [
  { username: 'sousair', password: '123456' },
  { username: 'maria', password: 'abcdef' },
  { username: 'pedro', password: 'qwerty' },
];

export function authenticate(username, password) {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
}
