const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('login', { title: 'Đăng nhập', layout: 'auth' });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  const user = User.verify(username, password);
  if (!user) {
    return res.render('login', {
      title: 'Đăng nhập',
      layout: 'auth',
      error: 'Sai tên đăng nhập hoặc mật khẩu',
      username
    });
  }
  req.session.user = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    phone: user.phone,
    address: user.address,
    role: user.role
  };
  res.redirect(user.role === 'admin' ? '/admin' : '/');
};

exports.getRegister = (req, res) => {
  res.render('register', { title: 'Đăng ký' , layout: 'auth' });
};

exports.postRegister = (req, res) => {
  const { username, password, confirmPassword, fullname, phone, address } = req.body;

  if (password !== confirmPassword) {
    return res.render('register', {
      title: 'Đăng ký',
      layout: 'auth',
      error: 'Mật khẩu xác nhận không khớp',
      body: req.body
    });
  }

  try {
    User.create({ username, password, fullname, phone, address });
    res.redirect('/login');
  } catch (err) {
    res.render('register', {
      title: 'Đăng ký',
      layout: 'auth',
      error: err.message,
      body: req.body
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
