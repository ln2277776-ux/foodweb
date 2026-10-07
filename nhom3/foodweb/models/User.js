const crypto = require('crypto');
const { readData, writeData } = require('../utils/jsonDB');
const FILE = 'users.json';

function hash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

const User = {
  getAll() {
    return readData(FILE);
  },

  getById(id) {
    return readData(FILE).find((u) => u.id === Number(id));
  },

  getByUsername(username) {
    return readData(FILE).find((u) => u.username === username);
  },

  create({ username, password, fullname, phone, address }) {
    const users = readData(FILE);
    if (users.some((u) => u.username === username)) {
      throw new Error('Tên đăng nhập đã tồn tại, vui lòng chọn tên khác');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = {
      id: newId,
      username,
      salt,
      password: hash(password, salt),
      fullname,
      phone,
      address,
      role: 'user'
    };
    users.push(user);
    writeData(FILE, users);
    return user;
  },

  verify(username, password) {
    const user = this.getByUsername(username);
    if (!user) return null;
    const hashed = hash(password, user.salt);
    return hashed === user.password ? user : null;
  }
};

module.exports = User;
