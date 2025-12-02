// گرفتن المنت‌ها
const sideMenuToggle = document.getElementById('side-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const backdrop = document.querySelector('.backdrop');

// باز کردن منو
sideMenuToggle.addEventListener('click', () => {
    mobileNav.classList.add('open');
    backdrop.classList.add('show');
});

// بستن منو با کلیک روی بک‌دراپ
backdrop.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    backdrop.classList.remove('show');
});
