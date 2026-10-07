function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Không có quyền truy cập' });
  }
  next();
}

module.exports = { isLoggedIn, isAdmin };
