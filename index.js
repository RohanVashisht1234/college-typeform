// Refactored for semantic class names and maintainability

document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('nav');
    const siteHeader = document.querySelector('.site-header');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu-overlay');
    const navDropdownLinks = document.querySelectorAll('.nav-list-item .nav-link--dropdown');
    let activeDropdown = null;

    function openDropdown(dropdownId) {
        if (activeDropdown) activeDropdown.classList.remove('active');
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.classList.add('active');
            activeDropdown = dropdown;
        }
    }
    function closeAllDropdowns() {
        if (activeDropdown) {
            activeDropdown.classList.remove('active');
            activeDropdown = null;
        }
        document.querySelectorAll('.nav-list-item.mobile-active').forEach(item => item.classList.remove('mobile-active'));
    }
    function closeMobileMenu() {
        mainNav.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        closeAllDropdowns();
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        const isActive = mainNav.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
        if (!isActive) closeAllDropdowns();
    });

    // Dropdown open/close
    navDropdownLinks.forEach(link => {
        const navItem = link.closest('.nav-list-item');
        const targetId = link.dataset.dropdownTarget;
        if (targetId) {
            navItem.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) openDropdown(targetId);
            });
            link.addEventListener('click', (e) => {
                if (window.innerWidth > 768) return;
                e.preventDefault();
                const wasActive = navItem.classList.contains('mobile-active');
                document.querySelectorAll('.nav-list-item.mobile-active').forEach(item => item.classList.remove('mobile-active'));
                dropdownMenus.forEach(menu => {
                    if (menu.parentElement.classList.contains('nav-list-item')) document.body.appendChild(menu);
                });
                if (!wasActive && targetId) {
                    navItem.classList.add('mobile-active');
                    navItem.appendChild(document.getElementById(targetId));
                }
            });
        }
    });

    // Mouse leave closes dropdowns on desktop
    siteHeader.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) setTimeout(() => {
            if (!siteHeader.matches(':hover') && !document.querySelector('.dropdown-menu-overlay:hover')) {
                closeAllDropdowns();
            }
        }, 50);
    });
    dropdownMenus.forEach(menu => {
        menu.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) closeAllDropdowns();
        });
    });

    // Click outside closes mobile menu
    document.addEventListener('click', function (event) {
        if (
            window.innerWidth <= 768 &&
            mainNav.classList.contains('active') &&
            !siteHeader.contains(event.target) &&
            !mainNav.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    // Escape key closes dropdowns or mobile menu
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeAllDropdowns();
            if (mainNav.classList.contains('active')) closeMobileMenu();
        }
    });

    // Close button on dropdown
    document.querySelectorAll('.dropdown-close-btn')
        .forEach(btn => btn.addEventListener('click', closeAllDropdowns));

    // On resize: close menus and re-parent overlays if mobile -> desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (mainNav.classList.contains('active')) closeMobileMenu();
            dropdownMenus.forEach(menu => {
                if (menu.parentElement.classList.contains('nav-list-item')) document.body.appendChild(menu);
            });
        }
        closeAllDropdowns();
    });
});