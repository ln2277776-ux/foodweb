const { readData, writeData } = require('../utils/jsonDB');
const FILE = 'orders.json';

const Order = {
  getAll() {
    return readData(FILE);
  },

  getByUser(userId) {
    return readData(FILE).filter((o) => o.userId === Number(userId));
  },

  getById(id) {
    return readData(FILE).find((o) => o.id === Number(id));
  },

  create(data) {
    const orders = readData(FILE);
    const newId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const order = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Chờ xử lý',
      ...data
    };
    orders.push(order);
    writeData(FILE, orders);
    return order;
  },

  updateStatus(id, status) {
    const orders = readData(FILE);
    const idx = orders.findIndex((o) => o.id === Number(id));
    if (idx === -1) return null;
    orders[idx].status = status;
    writeData(FILE, orders);
    return orders[idx];
  }
};

module.exports = Order;
