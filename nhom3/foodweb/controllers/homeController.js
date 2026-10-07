const Product = require('../models/Product');

exports.index = (req, res) => {
  const { category, q } = req.query;
  let products = Product.getAll();

  if (q) {
    products = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  }
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  const categories = Product.getCategories();

  res.render('home', {
    title: 'Trang chủ',
    products,
    categories,
    activeCategory: category || '',
    q: q || ''
  });
};

exports.detail = (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) {
    return res.status(404).render('404', { title: 'Không tìm thấy sản phẩm' });
  }
  res.render('product-detail', { title: product.name, product });
};
