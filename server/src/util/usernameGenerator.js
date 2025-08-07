function generateUsername() {
  return crypto.randomUUID().split("-").join("");
}

export default generateUsername;
