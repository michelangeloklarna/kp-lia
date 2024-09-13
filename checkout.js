document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    var form = document.getElementById('checkout-form');
    var cardPaymentSection = document.getElementById('card-payment');
    var klarnaPaymentSection = document.getElementById('klarna-payment');
    var cardRadio = document.querySelector('input[value="card"]');
    var klarnaRadio = document.querySelector('input[value="klarna"]');

    function togglePaymentSections() {
        console.log('Toggling payment sections');
        if (cardRadio.checked) {
            console.log('Card selected');
            cardPaymentSection.style.display = 'block';
            klarnaPaymentSection.style.display = 'none';
        } else if (klarnaRadio.checked) {
            console.log('Klarna selected');
            cardPaymentSection.style.display = 'none';
            klarnaPaymentSection.style.display = 'block';
        }
    }

    cardRadio.addEventListener('change', togglePaymentSections);
    klarnaRadio.addEventListener('change', togglePaymentSections);

    // Initial toggle based on the default selection
    togglePaymentSections();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        var selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        console.log('Selected payment method:', selectedPaymentMethod);

        if (selectedPaymentMethod === 'card') {
            console.log('Processing card payment...');
            // Add your card payment processing logic here
        } else if (selectedPaymentMethod === 'klarna') {
            console.log('Processing Klarna payment...');
            // Add your Klarna payment processing logic here
        }
    });

    // Initialize Klarna Payments
    if (typeof Klarna !== 'undefined') {
        console.log('Initializing Klarna Payments');
        Klarna.Payments.init({
            client_token: 'YOUR_CLIENT_TOKEN'
        });

        Klarna.Payments.load({
            container: '#klarna-payments-container',
            payment_method_category: 'pay_later'
        }, function(result) {
            if (result.show_form) {
                console.log('Klarna Payments form loaded successfully');
            } else {
                console.error('Failed to load Klarna Payments:', result.error);
            }
        });
    } else {
        console.error('Klarna script not loaded');
    }
});