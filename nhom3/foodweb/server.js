const path = require('path');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');

const seed = require('./utils/seed');
seed(); // tao du lieu mau (admin + san pham) neu chua co

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

/* ==== Cau hinh view engine: express-handlebars ==== */
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
      formatCurrency: (num) => {
        const n = Number(num) || 0;
        return n.toLocaleString('vi-VN') + 'đ';
      },
      multiply: (a, b) => {
        const n = (Number(a) || 0) * (Number(b) || 0);
        return n.toLocaleString('vi-VN') + 'đ';
      },
      ifEquals: function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
      },
      json: (ctx) => JSON.stringify(ctx)
    }
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

/* ==== Middleware chung ==== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'foodweb_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngay
  })
);

// Bien dung chung cho moi view (navbar, gio hang...)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = (req.session.cart || []).reduce((s, i) => s + i.qty, 0);
  next();
});

/* ==== Routes (theo MVC: routes goi controller, controller goi model) ==== */
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);

/* ==== 404 ==== */
app.use((req, res) => {
  res.status(404).render('404', { title: 'Khong tim thay trang' });
});

app.listen(PORT, () => {
  console.log(`✅ Server dang chay tai http://localhost:${PORT}`);
  console.log(`👉 Tai khoan quan tri mau: admin / admin123`);
});
