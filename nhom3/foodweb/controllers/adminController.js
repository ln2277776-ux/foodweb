const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.dashboard = (req, res) => {
  const products = Product.getAll();
  const orders = Order.getAll();
  const users = User.getAll();
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  res.render('admin/dashboard', {
    title: 'Tổng quan',
    layout: 'admin',
    productCount: products.length,
    orderCount: orders.length,
    userCount: users.length,
    revenue
  });
};

/* ---------- Sản phẩm ---------- */
exports.products = (req, res) => {
  const products = Product.getAll();
  res.render('admin/products', { title: 'Quản lý sản phẩm', layout: 'admin', products });
};

exports.getAddProduct = (req, res) => {
  res.render('admin/product-form', { title: 'Thêm sản phẩm', layout: 'admin' });
};

exports.postAddProduct = (req, res) => {
  const { name, category, price, description, stock } = req.body;
  let image = '/images/no-image.svg';
  if (req.file) image = '/images/' + req.file.filename;

  Product.create({
    name,
    category,
    price: Number(price),
    description,
    stock: Number(stock),
    image
  });
  res.redirect('/admin/products');
};

exports.getEditProduct = (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) return res.redirect('/admin/products');
  res.render('admin/product-form', {
    title: 'Sửa sản phẩm',
    layout: 'admin',
    product,
    editMode: true
  });
};

exports.postEditProduct = (req, res) => {
  const { name, category, price, description, stock } = req.body;
  const data = { name, category, price: Number(price), description, stock: Number(stock) };
  if (req.file) data.image = '/images/' + req.file.filename;

  Product.update(req.params.id, data);
  res.redirect('/admin/products');
};

exports.deleteProduct = (req, res) => {
  Product.delete(req.params.id);
  res.redirect('/admin/products');
};

/* ---------- Đơn hàng ---------- */
exports.orders = (req, res) => {
  const orders = Order.getAll().slice().reverse();
  res.render('admin/orders', { title: 'Đơn hàng', layout: 'admin', orders });
};

exports.updateOrderStatus = (req, res) => {
  Order.updateStatus(req.params.id, req.body.status);
  res.redirect('/admin/orders');
};
