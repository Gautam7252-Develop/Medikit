/* ==========================================================================
   Medikit Healthcare Supplier - WhatsApp Integration Script (whatsapp.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Configuration Settings
    // ----------------------------------------------------------------------
    const config = {
        // Replace with your actual WhatsApp business phone number (with country code, no + or spaces)
        whatsappNumber: '6204117623', 
        defaultMessage: 'Hello Medikit Team! I am interested in procuring healthcare supplies for my organization. Please share more details.'
    };

    // ----------------------------------------------------------------------
    // 2. Helper: Open WhatsApp Web / App
    // ----------------------------------------------------------------------
    const sendWhatsAppMessage = (customText) => {
        const encodedText = encodeURIComponent(customText || config.defaultMessage);
        const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };

    // ----------------------------------------------------------------------
    // 3. Generic WhatsApp Buttons Trigger Handling
    // ----------------------------------------------------------------------
    const whatsappTriggers = document.querySelectorAll('.whatsapp-trigger, .btn-whatsapp');
    whatsappTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if button specifies a specific product name
            const productName = btn.getAttribute('data-product-name');
            let message = config.defaultMessage;

            if (productName) {
                message = `Hello Medikit Team! I would like to inquire about bulk availability and pricing for: ${productName}.`;
            }

            sendWhatsAppMessage(message);
        });
    });

    // ----------------------------------------------------------------------
    // 4. Bulk Inquiry Form Direct WhatsApp Integration (bulk-order.html)
    // ----------------------------------------------------------------------
    const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');
    if (whatsappSubmitBtn) {
        whatsappSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Collect form inputs
            const orgName = document.getElementById('orgName')?.value || 'N/A';
            const contactPerson = document.getElementById('contactName')?.value || 'N/A';
            const phone = document.getElementById('phone')?.value || 'N/A';
            const email = document.getElementById('email')?.value || 'N/A';
            const industry = document.getElementById('industryType')?.value || 'N/A';
            const notes = document.getElementById('inquiryNotes')?.value || 'None';
            
            // Fetch selected items from localStorage
            const inquiryList = JSON.parse(localStorage.getItem('medikitInquiryList')) || [];
            const selectedItemsStr = inquiryList.length > 0 ? inquiryList.join(', ') : 'General Procurement Inquiry';

            // Construct formatted WhatsApp message
            const formattedMessage = 
`*New Bulk Procurement Request - Medikit*
----------------------------------------
*Organization:* ${orgName}
*Contact Person:* ${contactPerson}
*Phone:* ${phone}
*Email:* ${email}
*Industry:* ${industry}

*Requested Products:*
${selectedItemsStr}

*Additional Notes:*
${notes}
----------------------------------------
Please provide a customized bulk quotation for this request.`;

            sendWhatsAppMessage(formattedMessage);
        });
    }

    // ----------------------------------------------------------------------
    // 5. Dynamic Floating WhatsApp Widget
    // ----------------------------------------------------------------------
    const createFloatingWidget = () => {
        // Prevent duplicate creation
        if (document.getElementById('whatsappFloatingBtn')) return;

        const floatBtn = document.createElement('a');
        floatBtn.id = 'whatsappFloatingBtn';
        floatBtn.href = '#';
        floatBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
        floatBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
        
        // Inline styles for the floating widget (can also be included in CSS)
        Object.assign(floatBtn.style, {
            position: 'fixed',
            bottom: '25px',
            right: '25px',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            zIndex: '9999',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            textDecoration: 'none'
        });

        // Hover animation listeners
        floatBtn.addEventListener('mouseenter', () => {
            floatBtn.style.transform = 'scale(1.1)';
            floatBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.35)';
        });

        floatBtn.addEventListener('mouseleave', () => {