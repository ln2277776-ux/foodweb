// FoodWeb - client-side script
document.addEventListener('DOMContentLoaded', () => {
  // Tự động ẩn thông báo lỗi sau vài giây (nếu có)
  const errorBox = document.querySelector('.error');
  if (errorBox) {
    setTimeout(() => {
      errorBox.style.transition = 'opacity .5s';
      errorBox.style.opacity = '0';
    }, 4000);
  }
});
