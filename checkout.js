document.addEventListener("DOMContentLoaded", function () {
  const shippingAddressSection = document.getElementById(
    "shipping-address-section"
  );
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
      initAndLoadKlarnaWidget();
    }
  });

  document
    .getElementById("card-option")
    .addEventListener("change", function () {
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
    if (window.Klarna && window.Klarna.Lia) {
      initKlarna();
    } else {
      console.error("Klarna SDK not available after script load");
    }
  };

  script.onerror = function() {
    console.error("Failed to load Klarna SDK script");
  };
});

// Define the global klarnaAsyncCallback function
window.klarnaAsyncCallback = function () {
  console.log("Klarna SDK has finished loading.");
  initKlarna();
};

function initKlarna() {
  console.log("Initializing Klarna");
  try {
    Klarna.Lia.init({
      container: "#klarna-payments-container",
    });
    console.log("Klarna LIA SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Klarna LIA SDK:", error);
  }
}

function initAndLoadKlarnaWidget() {
  console.log("Initializing and loading Klarna widget");
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

  try {
    Klarna.Lia.load(klarnaRequest, function (res) {
      console.log("Klarna widget loaded successfully", res);
    });
  } catch (error) {
    console.error("Error loading Klarna widget:", error);
  }
}

function authorizeKlarnaPayment() {
  console.log("Authorizing Klarna payment");
  try {
    Klarna.Lia.authorize({}, function (res) {
      console.log("Klarna payment authorized:", res);
      if (res.approved) {
        console.log(
          "Payment approved. Authorization token:",
          res.authorization_token
        );
      } else {
        console.log("Payment not approved:", res.error);
      }
    });
  } catch (error) {
    console.error("Error authorizing Klarna payment:", error);
  }
}

// Call loadKlarnaWidget when the Klarna payment option is selected
document
  .getElementById("klarna-option")
  .addEventListener("change", function () {
    if (this.checked) {
      loadKlarnaWidget();
    }
  });

// Add a button or event listener to trigger the authorization when needed
document
  .getElementById("place-order-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    authorizeKlarnaPayment();
  });
