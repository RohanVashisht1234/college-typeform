document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.getElementById('nav');
    const header = document.querySelector('header');
    const dropdownOverlays = document.querySelectorAll('.dropdown-overlay');
    const navItemsWithDropdown = document.querySelectorAll('.nav-item .has-dropdown');
    let activeDropdown = null;
    function openDropdown(dropdownId) {
        if (activeDropdown) activeDropdown.classList.remove('active');
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) { dropdown.classList.add('active'); activeDropdown = dropdown; }
    }
    function closeAllDropdowns() {
        if (activeDropdown) activeDropdown.classList.remove('active'), activeDropdown = null;
        document.querySelectorAll('.nav-item.mobile-active').forEach(item => item.classList.remove('mobile-active'));
    }
    function closeMobileMenu() {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
        closeAllDropdowns();
    }
    mobileMenuToggle.addEventListener('click', function () {
        const isNavActive = nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = isNavActive ? 'hidden' : '';
        if (!isNavActive) closeAllDropdowns();
    });
    navItemsWithDropdown.forEach(link => {
        const navItem = link.parentElement;
        const targetId = link.dataset.dropdownTarget;
        if (targetId) {
            navItem.addEventListener('mouseenter', () => { if (window.innerWidth > 768) openDropdown(targetId); });
            link.addEventListener('click', (e) => {
                if (window.innerWidth > 768) return;
                e.preventDefault();
                const wasActive = navItem.classList.contains('mobile-active');
                document.querySelectorAll('.nav-item.mobile-active').forEach(item => item.classList.remove('mobile-active'));
                dropdownOverlays.forEach(overlay => {
                    if (overlay.parentElement.classList.contains('nav-item')) document.body.appendChild(overlay);
                });
                if (!wasActive && targetId) {
                    navItem.classList.add('mobile-active');
                    navItem.appendChild(document.getElementById(targetId));
                }
            });
        }
    });
    header.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) setTimeout(() => {
            if (!header.matches(':hover') && !document.querySelector('.dropdown-overlay:hover')) closeAllDropdowns();
        }, 50);
    });
    dropdownOverlays.forEach(overlay => {
        overlay.addEventListener('mouseleave', () => { if (window.innerWidth > 768) closeAllDropdowns(); });
    });
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 768 && nav.classList.contains('active') && !header.contains(event.target) && !nav.contains(event.target)) closeMobileMenu();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAllDropdowns();
            if (nav.classList.contains('active')) closeMobileMenu();
        }
    });
    document.querySelectorAll('.dropdown-close').forEach(btn => btn.addEventListener('click', closeAllDropdowns));
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (nav.classList.contains('active')) closeMobileMenu();
            dropdownOverlays.forEach(overlay => {
                if (overlay.parentElement.classList.contains('nav-item')) document.body.appendChild(overlay);
            });
        }
        closeAllDropdowns();
    });
});