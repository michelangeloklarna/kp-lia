document.addEventListener('DOMContentLoaded', function() {
    const shippingAddressSection = document.getElementById('shipping-address-section');
    const klarnaOption = document.getElementById('klarna-option');
    const klarnaPayment = document.getElementById('klarna-payment');
    const cardPayment = document.getElementById('card-payment');

    // Hide shipping address section by default
    shippingAddressSection.style.display = 'none';

    // Add event listener for payment method selection
    klarnaOption.addEventListener('change', function() {
        if (this.checked) {
            klarnaPayment.style.display = 'block';
            cardPayment.style.display = 'none';
            loadKlarnaWidget();
        }
    });

    document.getElementById('card-option').addEventListener('change', function() {
        if (this.checked) {
            klarnaPayment.style.display = 'none';
            cardPayment.style.display = 'block';
        }
    });
});

// Define the global klarnaAsyncCallback function
window.klarnaAsyncCallback = function() {
    console.log("Klarna SDK has finished loading. It's now safe to use the window.Klarna object.");
    document.getElementById('console-log').textContent += "Klarna SDK has finished loading. It's now safe to use the window.Klarna object.\n";

    // Initialize Klarna LIA SDK
    try {
        Klarna.Lia.api().init({
            container: "#klarna-payments-container"
        });
        console.log("Klarna LIA SDK initialized successfully");
        document.getElementById('console-log').textContent += "Klarna LIA SDK initialized successfully\n";
    } catch (error) {
        console.error("Error initializing Klarna LIA SDK:", error);
        document.getElementById('console-log').textContent += "Error initializing Klarna LIA SDK: " + error + "\n";
    }
};

function loadKlarnaWidget() {
    try {
        Klarna.Lia.api().load(
            {
                container: "#klarna-payments-container",
            },
            {
                "locale": "en-GB",
                "purchase_country": "GB",
                "purchase_currency": "GBP",
                "order_amount": 38900,
                "order_lines": [
                    {
                        "name": "LG 43UR78006LK 2023",
                        "unit_price": 29900,
                        "total_amount": 29900,
                        "quantity": 1,
                        "reference": "11d609c0-0609-4b3b-a472-40175828ebe2"
                    },
                    {
                        "name": "adidas Supernova Stride Men's Sports Trainers",
                        "unit_price": 9000,
                        "total_amount": 9000,
                        "quantity": 1,
                        "reference": "11d609c0-0609-4b3b-a472-40175828ebe2"
                    }
                ]
            },
            function(res) {
                // load~callback
                console.log("Klarna widget loaded successfully");
                document.getElementById('console-log').textContent += "Klarna widget loaded successfully\n";
            }
        );
    } catch (error) {
        console.error("Error loading Klarna widget:", error);
        document.getElementById('console-log').textContent += "Error loading Klarna widget: " + error + "\n";
    }
}

// ... existing code ...