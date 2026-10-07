const Product = require('../models/Product');
const Order = require('../models/Order');

exports.view = (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  res.render('cart', { title: 'Giỏ hàng', cart, total });
};

exports.add = (req, res) => {
  const { productId, qty } = req.body;
  const product = Product.getById(productId);
  if (!product) return res.redirect('/');

  const cart = req.session.cart || [];
  const amount = Math.max(1, Number(qty) || 1);
  const existing = cart.find((i) => i.productId === product.id);

  if (existing) {
    existing.qty += amount;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: amount
    });
  }

  req.session.cart = cart;
  res.redirect('/cart');
};

exports.update = (req, res) => {
  const { productId, qty } = req.body;
  const cart = req.session.cart || [];
  const item = cart.find((i) => i.productId === Number(productId));
  if (item) item.qty = Math.max(1, Number(qty) || 1);
  req.session.cart = cart;
  res.redirect('/cart');
};

exports.remove = (req, res) => {
  let cart = req.session.cart || [];
  cart = cart.filter((i) => i.productId !== Number(req.params.productId));
  req.session.cart = cart;
  res.redirect('/cart');
};

exports.checkout = (req, res) => {
  const cart = req.session.cart || [];
  if (!cart.length) return res.redirect('/cart');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const { phone, address } = req.body;

  const order = Order.create({
    userId: req.session.user.id,
    items: cart,
    total,
    phone: phone || req.session.user.phone,
    address: address || req.session.user.address
  });

  req.session.cart = [];
  res.render('checkout-success', { title: 'Đặt hàng thành công', order });
};
