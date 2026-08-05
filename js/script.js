/* ==========================================================================
   Medikit Healthcare Supplier - Primary JavaScript File (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // ----------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle menu icon between bars and close icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (event) => {
            if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. Product Category Filtering (products.html)
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and add to clicked button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. Inquiry List / Cart Management (localStorage based)
    // ----------------------------------------------------------------------
    let inquiryList = JSON.parse(localStorage.getItem('medikitInquiryList')) || [];

    // Helper to update local storage
    const saveInquiryList = () => {
        localStorage.setItem('medikitInquiryList', JSON.stringify(inquiryList));
    };

    // Attach click events to "Add to Inquiry" buttons
    const addInquiryButtons = document.querySelectorAll('.add-to-inquiry-btn');
    addInquiryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-product-name') || 'Healthcare Product';
            
            if (!inquiryList.includes(productName)) {
                inquiryList.push(productName);
                saveInquiryList();
                alert(`"${productName}" has been added to your bulk inquiry list.`);
            } else {
                alert(`"${productName}" is already in your bulk inquiry list.`);
            }
            updateInquiryDisplay();
        });
    });

    // Populate selected products on bulk-order.html
    const updateInquiryDisplay = () => {
        const selectedProductsContainer = document.getElementById('selectedProductsList');
        const hiddenProductsInput = document.getElementById('selectedProductsInput');

        if (selectedProductsContainer) {
            selectedProductsContainer.innerHTML = '';

            if (inquiryList.length === 0) {
                selectedProductsContainer.innerHTML = '<p class="text-muted">No products selected yet. Browse our catalog to add items.</p>';
                if (hiddenProductsInput) hiddenProductsInput.value = '';
            } else {
                const listUl = document.createElement('ul');
                listUl.className = 'inquiry-item-list';

                inquiryList.forEach((product, index) => {
                    const li = document.createElement('li');
                    li.className = 'flex-between margin-bottom-sm';
                    li.innerHTML = `
                        <span><i class="fa-solid fa-check-circle text-success"></i> ${product}</span>
                        <button class="btn btn-sm btn-outline remove-inquiry-btn" data-index="${index}" style="padding: 2px 8px; font-size: 0.75rem;">Remove</button>
                    `;
                    listUl.appendChild(li);
                });

                selectedProductsContainer.appendChild(listUl);

                // Update hidden input field for form submission
                if (hiddenProductsInput) {
                    hiddenProductsInput.value = inquiryList.join(', ');
                }

                // Add remove listeners
                const removeButtons = selectedProductsContainer.querySelectorAll('.remove-inquiry-btn');
                removeButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = parseInt(e.target.getAttribute('data-index'));
                        inquiryList.splice(index, 1);
                        saveInquiryList();
                        updateInquiryDisplay();
                    });
                });
            }
        }
    };

    // Initial call to display items on load
    updateInquiryDisplay();

    // ----------------------------------------------------------------------
    // 4. Form Submission Handling (bulk-order.html & contact.html)
    // ----------------------------------------------------------------------
    const bulkOrderForm = document.getElementById('bulkOrderForm');
    if (bulkOrderForm) {
        bulkOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            alert('Thank you! Your bulk procurement inquiry has been submitted successfully. Our sales team will contact you shortly.');
            
            // Clear inquiry cart after successful submission
            inquiryList = [];
            saveInquiryList();
            bulkOrderForm.reset();
            updateInquiryDisplay();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for reaching out! Your message has been received, and we will get back to you within 24 business hours.');
            contactForm.reset();
        });
    }

});