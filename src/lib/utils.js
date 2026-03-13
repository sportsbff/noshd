export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function restKey(country, name) {
  return `${country}||${name}`;
}
