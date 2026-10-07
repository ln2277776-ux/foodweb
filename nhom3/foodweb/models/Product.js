const { readData, writeData } = require('../utils/jsonDB');
const FILE = 'products.json';

const Product = {
  getAll() {
    return readData(FILE);
  },

  getById(id) {
    return readData(FILE).find((p) => p.id === Number(id));
  },

  create(data) {
    const products = readData(FILE);
    const newId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const product = { id: newId, ...data };
    products.push(product);
    writeData(FILE, products);
    return product;
  },

  update(id, data) {
    const products = readData(FILE);
    const idx = products.findIndex((p) => p.id === Number(id));
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data, id: products[idx].id };
    writeData(FILE, products);
    return products[idx];
  },

  delete(id) {
    let products = readData(FILE);
    products = products.filter((p) => p.id !== Number(id));
    writeData(FILE, products);
  },

  getCategories() {
    const products = readData(FILE);
    return [...new Set(products.map((p) => p.category))];
  }
};

module.exports = Product;
