// Define the global klarnaAsyncCallback function
window.klarnaAsyncCallback = function() {
    console.log('LIA: Klarna SDK loaded');
    
    // Initialize Klarna LIA
    Klarna.Lia.api().init({
        container: "#klarna-payments-container"
    }).then(function() {
        console.log('LIA: Klarna LIA initialized successfully');
        loadKlarnaPaymentMethods();
    }).catch(function(error) {
        console.error('LIA: Failed to initialize Klarna LIA:', error);
    });
};

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

    // Function to pre-fill shipping address with a random GB address
    function prefillShippingAddress() {
        console.log('Prefilling shipping address');
        const gbAddresses = [
            {
                email: 'john.smith@example.com',
                given_name: 'John',
                family_name: 'Smith',
                phone: '07700 900123',
                country: 'United Kingdom',
                street_address: '10 Downing Street',
                postal_code: 'SW1A 2AA',
                city: 'London'
            },
            {
                email: 'emma.watson@example.com',
                given_name: 'Emma',
                family_name: 'Watson',
                phone: '07700 900456',
                country: 'United Kingdom',
                street_address: '221B Baker Street',
                postal_code: 'NW1 6XE',
                city: 'London'
            },
            {
                email: 'david.jones@example.com',
                given_name: 'David',
                family_name: 'Jones',
                phone: '07700 900789',
                country: 'United Kingdom',
                street_address: '1 Princes Street',
                postal_code: 'EH2 2EQ',
                city: 'Edinburgh'
            }
        ];

        const randomAddress = gbAddresses[Math.floor(Math.random() * gbAddresses.length)];
        console.log('Selected random address:', randomAddress);

        const idMapping = {
            email: 'shipping-email',
            given_name: 'shipping-given-name',
            family_name: 'shipping-family-name',
            phone: 'shipping-phone',
            country: 'shipping-country',
            street_address: 'shipping-street-address',
            postal_code: 'shipping-postal-code',
            city: 'shipping-city'
        };

        Object.keys(randomAddress).forEach(key => {
            const inputId = idMapping[key];
            const inputField = document.getElementById(inputId);
            if (inputField) {
                inputField.value = randomAddress[key];
                console.log(`Set ${inputId} to ${randomAddress[key]}`);
            } else {
                console.warn(`Input field for ${inputId} not found`);
            }
        });
    }

    // Call the function to pre-fill the shipping address
    prefillShippingAddress();

    function togglePaymentSections() {
        console.log('LIA: Toggling payment sections');
        if (cardRadio.checked) {
            console.log('LIA: Card payment selected');
            cardPaymentSection.style.display = 'block';
            klarnaPaymentSection.style.display = 'none';
            toggleCardFieldsRequired(true);
        } else if (klarnaRadio.checked) {
            console.log('LIA: Klarna payment selected');
            cardPaymentSection.style.display = 'none';
            klarnaPaymentSection.style.display = 'block';
            toggleCardFieldsRequired(false);
        }
    }

    function toggleCardFieldsRequired(required) {
        const cardFields = cardPaymentSection.querySelectorAll('input');
        cardFields.forEach(field => {
            if (required) {
                field.setAttribute('required', '');
            } else {
                field.removeAttribute('required');
            }
        });
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

    function loadKlarnaPaymentMethods() {
        var orderData = getOrderData();
        Klarna.Lia.api().load({
            order: orderData
        }).then(function(result) {
            console.log('LIA: Klarna payment methods loaded successfully');
        }).catch(function(error) {
            console.error('LIA: Failed to load Klarna payment methods:', error);
        });
    }

    function getOrderData() {
        var { shippingAddress, billingAddress } = getAddressData();
        return {
            locale: "en-GB",
            purchase_country: "GB",
            purchase_currency: "GBP",
            order_amount: 38900,
            merchant_reference1: "11d609c0-0609-4b3b-a472-40175828ebe2",
            merchant_reference2: "11d609c0-0609-4b3b-a472-40175828ebe2",
            order_lines: [
                {
                    name: "LG 43UR78006LK 2023",
                    image_url: "https://johnlewis.scene7.com/is/image/JohnLewis/110217231?wid=640&hei=853",
                    product_url: "https://www.johnlewis.com/lg-43ur78006lk-2023-led-hdr-4k-ultra-hd-smart-tv-43-inch-with-freeview-play-freesat-hd-dark-iron-grey/p110258583",
                    quantity: 1,
                    total_amount: 29900,
                    unit_price: 29900
                },
                {
                    name: "adidas Supernova Stride Men's Sports Trainers",
                    image_url: "https://johnlewis.scene7.com/is/image/JohnLewis/006884883alt1?$rsp-pdp-port-640$",
                    product_url: "https://www.johnlewis.com/adidas-supernova-stride-mens-sports-trainers/p111295105",
                    quantity: 1,
                    total_amount: 9000,
                    unit_price: 9000
                }
            ],
            billing_address: {
                email: billingAddress.email,
                given_name: billingAddress.given_name,
                family_name: billingAddress.family_name,
                phone: billingAddress.phone,
                country: billingAddress.country,
                street_address: billingAddress.street_address,
                postal_code: billingAddress.postal_code,
                city: billingAddress.city
            },
            shipping_address: {
                email: shippingAddress.email,
                given_name: shippingAddress.given_name,
                family_name: shippingAddress.family_name,
                phone: shippingAddress.phone,
                country: shippingAddress.country,
                street_address: shippingAddress.street_address,
                postal_code: shippingAddress.postal_code,
                city: shippingAddress.city
            }
        };
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('LIA: Form submitted');
        var selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        console.log('LIA: Selected payment method:', selectedPaymentMethod);

        if (selectedPaymentMethod === 'card') {
            console.log('LIA: Processing card payment...');
            // Add your card payment processing logic here
        } else if (selectedPaymentMethod === 'klarna') {
            console.log('LIA: Processing Klarna payment...');
            var orderData = getOrderData();
            Klarna.Lia.api().authorize(orderData, function(res) {
                if (res.approved) {
                    console.log('LIA: Klarna payment authorized successfully', res);
                    // Handle successful authorization (e.g., redirect to confirmation page)
                    // You can use res.credit_card to process the payment with your existing credit card system
                } else {
                    console.error('LIA: Klarna payment authorization failed:', res.error);
                    // Handle failed authorization
                }
            });
        }
    });

    // Function to update Klarna session
    function updateKlarnaSession() {
        var orderData = getOrderData();
        Klarna.Lia.api().load({
            order: orderData
        }).then(function(result) {
            console.log('LIA: Klarna session updated successfully');
        }).catch(function(error) {
            console.error('LIA: Failed to update Klarna session:', error);
        });
    }

    // Add event listeners to address fields
    var addressFields = document.querySelectorAll('.address-section input');
    addressFields.forEach(function(field) {
        field.addEventListener('change', updateKlarnaSession);
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
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">£${(item.unit_price / 100).toFixed(2)}</div>
                    <div class="cart-item-quantity">Qty: ${item.quantity}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalAmount.textContent = `£${(orderData.order_amount / 100).toFixed(2)}`;
    }

    // Populate cart summary
    var orderData = getOrderData();
    populateCartSummary(orderData);

    sameAsShippingCheckbox.addEventListener('change', function() {
        billingAddressFields.style.display = this.checked ? 'none' : 'block';
        
        // Toggle required attribute for billing fields
        const billingInputs = billingAddressFields.querySelectorAll('input');
        billingInputs.forEach(input => {
            input.required = !this.checked;
        });
    });

    // Add event listeners to shipping address fields to update Klarna session on change
    const shippingFields = document.querySelectorAll('.address-section input[id^="shipping-"]');
    shippingFields.forEach(field => {
        field.addEventListener('change', updateKlarnaSession);
    });

    // Add this at the end of the DOMContentLoaded event listener
    console.log('Checking if shipping address was prefilled:');
    ['email', 'given-name', 'family-name', 'phone', 'country', 'street-address', 'postal-code', 'city'].forEach(key => {
        const inputField = document.getElementById(`shipping-${key}`);
        if (inputField) {
            console.log(`${key}: ${inputField.value}`);
        } else {
            console.warn(`Input field for ${key} not found`);
        }
    });
});