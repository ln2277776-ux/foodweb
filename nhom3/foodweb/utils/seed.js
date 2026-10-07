const crypto = require('crypto');
const { readData, writeData } = require('./jsonDB');

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

module.exports = function seed() {
  // ---- Tai khoan quan tri mau ----
  const users = readData('users.json');
  if (!users.length) {
    const salt = crypto.randomBytes(16).toString('hex');
    users.push({
      id: 1,
      username: 'admin',
      salt,
      password: hashPassword('admin123', salt),
      fullname: 'Quan tri vien',
      phone: '0900000000',
      address: 'Ha Noi',
      role: 'admin'
    });
    writeData('users.json', users);
  }

  // ---- San pham mau ----
  const products = readData('products.json');
  if (!products.length) {
    const sample = [
      { name: 'Pizza Hải Sản', category: 'Pizza', price: 159000, stock: 20, image: 'https://picsum.photos/seed/pizza1/500/350', description: 'Pizza đế giòn với tôm, mực, phô mai Mozzarella tan chảy.' },
      { name: 'Pizza Bò Phô Mai', category: 'Pizza', price: 145000, stock: 15, image: 'https://picsum.photos/seed/pizza2/500/350', description: 'Thịt bò băm, hành tây, ớt chuông và phô mai béo ngậy.' },
      { name: 'Burger Bò Phô Mai', category: 'Burger', price: 65000, stock: 30, image: 'https://picsum.photos/seed/burger1/500/350', description: 'Bánh burger nhân bò 100%, phô mai cheddar, rau tươi.' },
      { name: 'Burger Gà Giòn', category: 'Burger', price: 55000, stock: 25, image: 'https://picsum.photos/seed/burger2/500/350', description: 'Gà giòn tẩm bột chiên xù, sốt mayonnaise đặc biệt.' },
      { name: 'Gà Rán Giòn Cay', category: 'Gà rán', price: 45000, stock: 40, image: 'https://picsum.photos/seed/chicken1/500/350', description: 'Đùi gà tẩm ướp cay nồng, chiên giòn rụm.' },
      { name: 'Cơm Gà Xối Mỡ', category: 'Cơm', price: 40000, stock: 20, image: 'https://picsum.photos/seed/rice1/500/350', description: 'Cơm nóng, đùi gà xối mỡ da giòn, ăn kèm dưa leo.' },
      { name: 'Mì Ý Sốt Bò Bằm', category: 'Mì Ý', price: 50000, stock: 18, image: 'https://picsum.photos/seed/pasta1/500/350', description: 'Mì Ý sốt cà chua bò bằm đậm đà kiểu Ý.' },
      { name: 'Trà Sữa Trân Châu', category: 'Đồ uống', price: 30000, stock: 50, image: 'https://picsum.photos/seed/drink1/500/350', description: 'Trà sữa béo thơm cùng trân châu đen dẻo dai.' },
      { name: 'Nước Cam Ép', category: 'Đồ uống', price: 25000, stock: 35, image: 'https://picsum.photos/seed/drink2/500/350', description: 'Cam tươi ép nguyên chất, giàu vitamin C.' },
      { name: 'Khoai Tây Chiên', category: 'Ăn vặt', price: 20000, stock: 60, image: 'https://picsum.photos/seed/fries1/500/350', description: 'Khoai tây chiên giòn rụm, chấm cùng sốt tương cà.' }
    ];
    const withId = sample.map((p, i) => ({ id: i + 1, ...p }));
    writeData('products.json', withId);
  }

  // ---- Don hang (khoi tao rong) ----
  readData('orders.json'); // se tu tao file rong neu chua co
};
