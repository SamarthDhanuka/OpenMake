fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;

        // Highlight the active link based on the current page
        const currentPage = window.location.pathname.split("/").pop();
        const navItems = {
            'products.html': 'Products',
            'upload.html': 'Upload',
            'licenses.html': 'Licenses',
            'dsource.html': 'D\'source',
            'signin.html': 'Sign in',
        };

        // Highlight the current nav item
        const navLinks = document.querySelectorAll('#navlist a');
        navLinks.forEach(link => {
            if (link.textContent.trim() === navItems[currentPage]) {
                link.style.fontWeight = 'bold';
            }
        });

        // Toggle visibility for burger menu
        document.getElementById('navburger').addEventListener('click', function () {
            this.classList.toggle('active');  // Toggle the parent class for visibility control
        });
    })
    .catch(error => console.error('Error loading the navbar:', error));