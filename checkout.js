document.addEventListener("DOMContentLoaded", function () {
  const shippingAddressSection = document.getElementById("shipping-address-section");
  const klarnaOption = document.getElementById("klarna-option");
  const klarnaPayment = document.getElementById("klarna-payment");
  const cardPayment = document.getElementById("card-payment");

  // Hide shipping address section by default
  shippingAddressSection.style.display = "none";

  // Add event listener for payment method selection
  klarnaOption.addEventListener("change", function () {
    if (this.checked) {
      klarnaPayment.style.display = "block";
      cardPayment.style.display = "none";
      loadKlarnaWidget();
    }
  });

  document.getElementById("card-option").addEventListener("change", function () {
    if (this.checked) {
      klarnaPayment.style.display = "none";
      cardPayment.style.display = "block";
    }
  });

  // Load Klarna SDK
  const script = document.createElement('script');
  script.src = 'https://x.klarnacdn.net/lia/lib/v1/api.js';
  script.async = true;
  document.body.appendChild(script);

  script.onload = function() {
    console.log("Klarna SDK script loaded");
    window.klarnaAsyncCallback();
  };

  script.onerror = function() {
    console.error("Failed to load Klarna SDK script");
  };
});

// Define the global klarnaAsyncCallback function
window.klarnaAsyncCallback = function () {
  console.log("Klarna SDK has finished loading.");
  Klarna.Lia.init({
    container: "#klarna-payments-container",
  });
};

function loadKlarnaWidget() {
  console.log("Loading Klarna widget");
  const klarnaRequest = {
    locale: "en-GB",
    purchase_country: "GB",
    purchase_currency: "GBP",
    order_amount: 38900,
    order_lines: [
      {
        name: "LG 43UR78006LK 2023",
        unit_price: 29900,
        total_amount: 29900,
        quantity: 1,
        reference: "11d609c0-0609-4b3b-a472-40175828ebe1",
      },
      {
        name: "adidas Supernova Stride Men's Sports Trainers",
        unit_price: 9000,
        total_amount: 9000,
        quantity: 1,
        reference: "11d609c0-0609-4b3b-a472-40175828ebe2",
      },
    ],
  };

  Klarna.Lia.load(klarnaRequest, function (res) {
    console.log("Klarna widget loaded", res);
  });
}

function authorizeKlarnaPayment() {
  console.log("Authorizing Klarna payment");
  Klarna.Lia.authorize({}, function (res) {
    console.log("Klarna payment authorization response:", res);
    if (res.approved) {
      console.log("Payment approved. Authorization token:", res.authorization_token);
    } else {
      console.log("Payment not approved:", res.error);
    }
  });
}

document.getElementById("place-order-button").addEventListener("click", function (event) {
  event.preventDefault();
  authorizeKlarnaPayment();
});
