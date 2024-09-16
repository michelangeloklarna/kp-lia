document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    var form = document.getElementById('checkout-form');
    var cardPaymentSection = document.getElementById('card-payment');
    var klarnaPaymentSection = document.getElementById('klarna-payment');
    var cardRadio = document.querySelector('input[value="card"]');
    var klarnaRadio = document.querySelector('input[value="klarna"]');
    var cartItemsContainer = document.querySelector('.cart-items');
    var cartTotalAmount = document.getElementById('cart-total-amount');
    var sameAsShippingCheckbox = document.getElementById('same-as-shipping');
    var billingAddressFields = document.getElementById('billing-address-fields');

    function togglePaymentSections() {
        console.log('LIA: Toggling payment sections');
        if (cardRadio.checked) {
            console.log('LIA: Card payment selected');
            cardPaymentSection.style.display = 'block';
            klarnaPaymentSection.style.display = 'none';
        } else if (klarnaRadio.checked) {
            console.log('LIA: Klarna payment selected');
            cardPaymentSection.style.display = 'none';
            klarnaPaymentSection.style.display = 'block';
        }
    }

    cardRadio.addEventListener('change', togglePaymentSections);
    klarnaRadio.addEventListener('change', togglePaymentSections);

    // Initial toggle based on the default selection
    togglePaymentSections();

    function toggleBillingFields() {
        console.log('LIA: Toggling billing address fields');
        billingAddressFields.style.display = sameAsShippingCheckbox.checked ? 'none' : 'block';
    }

    // Set initial state of billing fields
    toggleBillingFields();

    // Add event listener for checkbox changes
    sameAsShippingCheckbox.addEventListener('change', toggleBillingFields);

    function getAddressData() {
        console.log('LIA: Getting address data');
        var shippingAddress = {
            email: document.getElementById('shipping-email').value,
            given_name: document.getElementById('shipping-given-name').value,
            family_name: document.getElementById('shipping-family-name').value,
            phone: document.getElementById('shipping-phone').value,
            country: document.getElementById('shipping-country').value,
            street_address: document.getElementById('shipping-street-address').value,
            postal_code: document.getElementById('shipping-postal-code').value,
            city: document.getElementById('shipping-city').value
        };

        var billingAddress = sameAsShippingCheckbox.checked ? shippingAddress : {
            email: document.getElementById('billing-email').value,
            given_name: document.getElementById('billing-given-name').value,
            family_name: document.getElementById('billing-family-name').value,
            phone: document.getElementById('billing-phone').value,
            country: document.getElementById('billing-country').value,
            street_address: document.getElementById('billing-street-address').value,
            postal_code: document.getElementById('billing-postal-code').value,
            city: document.getElementById('billing-city').value
        };

        return { shippingAddress, billingAddress };
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('LIA: Form submitted');
        var selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        console.log('LIA: Selected payment method:', selectedPaymentMethod);

        var { shippingAddress, billingAddress } = getAddressData();
        console.log('LIA: Shipping Address:', shippingAddress);
        console.log('LIA: Billing Address:', billingAddress);

        if (selectedPaymentMethod === 'card') {
            console.log('LIA: Processing card payment...');
            // Add your card payment processing logic here
        } else if (selectedPaymentMethod === 'klarna') {
            console.log('LIA: Processing Klarna payment...');
            console.log('LIA: Calling Klarna.Payments.authorize()');
            Klarna.Payments.authorize({
                shipping_address: shippingAddress,
                billing_address: billingAddress
                // Add other required parameters here
            }, function(res) {
                console.log('LIA: Klarna.Payments.authorize() response:', res);
                // Handle the Klarna authorization response
            });
        }
    });

    // Sample order data (replace this with actual data from Klarna.Lia.api().load)
    var orderData = {
        order_amount: 104900,
        order_lines: [
            {
                name: "Dune Dune Wide Fit Beko Perforated Leather Gibson Shoes, Tan, 6",
                image_url: "https://johnlewis.scene7.com/is/image/JohnLewis/009050089",
                product_url: "https://www.johnlewis.com/dune-wide-fit-beko-perforated-leather-gibson-shoes-tan/p112423950",
                quantity: 1,
                total_amount: 10000,
                unit_price: 10000
            },
            {
                name: "2024 Apple MacBook Air 13.6 M3 Processor 8GB RAM 256GB SSD Midnight",
                image_url: "https://johnlewis.scene7.com/is/image/JohnLewis/241230500",
                product_url: "https://www.johnlewis.com/2024-apple-macbook-air-13-6-inch-m3-processor-8gb-ram-256gb-ssd",
                quantity: 1,
                total_amount: 94900,
                unit_price: 94900
            }
        ]
    };

    function populateCartSummary(orderData) {
        console.log('LIA: Populating cart summary');
        cartItemsContainer.innerHTML = '';
        orderData.order_lines.forEach(item => {
            var itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">£${(item.unit_price / 100).toFixed(2)}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalAmount.textContent = `£${(orderData.order_amount / 100).toFixed(2)}`;
    }

    // Populate cart summary
    populateCartSummary(orderData);

    // Initialize Klarna Payments
    if (typeof Klarna !== 'undefined') {
        console.log('LIA: Initializing Klarna Payments');
        Klarna.Payments.init({
            client_token: 'YOUR_CLIENT_TOKEN'
        });

        console.log('LIA: Loading Klarna Payments');
        Klarna.Payments.load({
            container: '#klarna-payments-container',
            payment_method_category: 'pay_later'
        }, function(result) {
            if (result.show_form) {
                console.log('LIA: Klarna Payments form loaded successfully');
            } else {
                console.error('LIA: Failed to load Klarna Payments:', result.error);
            }
        });
    } else {
        console.error('LIA: Klarna script not loaded');
    }
});