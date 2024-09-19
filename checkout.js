console.log("Script started");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");

  const shippingAddressSection = document.getElementById("shipping-address-section");
  const klarnaOption = document.getElementById("klarna-option");
  const klarnaPayment = document.getElementById("klarna-payment");
  const cardPayment = document.getElementById("card-payment");

  if (!shippingAddressSection || !klarnaOption || !klarnaPayment || !cardPayment) {
    console.error("One or more elements not found");
    return;
  }

  console.log("All elements found");

  // Hide shipping address section by default
  shippingAddressSection.style.display = "none";

  // Add event listener for payment method selection
  klarnaOption.addEventListener("change", function () {
    console.log("Klarna option changed");
    if (this.checked) {
      klarnaPayment.style.display = "block";
      cardPayment.style.display = "none";
      loadKlarnaWidget();
    }
  });

  document.getElementById("card-option").addEventListener("change", function () {
    console.log("Card option changed");
    if (this.checked) {
      klarnaPayment.style.display = "none";
      cardPayment.style.display = "block";
    }
  });

  // Load Klarna LIA SDK
  const script = document.createElement('script');
  script.src = 'https://cdn.cs.playground.klarna.com/lia/sdk/lia-sdk_eu.js';
  script.async = true;
  document.body.appendChild(script);

  console.log("Script added to body");
});

// Define the global klarnaAsyncCallback function
window.klarnaAsyncCallback = function () {
  console.log("klarnaAsyncCallback called");
  if (window.Klarna && window.Klarna.Lia) {
    console.log("Klarna SDK has finished loading.");
    const container = document.getElementById("klarna-payments-container");
    if (container) {
      console.log("Klarna container found:", container);
    } else {
      console.error("Klarna container not found");
    }
    try {
      Klarna.Lia.api().init({
        container: "#klarna-payments-container"
      });
      console.log("Klarna.Lia.api().init called successfully");
    } catch (error) {
      console.error("Error initializing Klarna Lia:", error);
    }
  } else {
    console.error("Klarna.Lia not available in klarnaAsyncCallback");
  }
};

function loadKlarnaWidget() {
  console.log("loadKlarnaWidget called");
  if (!window.Klarna || !window.Klarna.Lia) {
    console.error("Klarna.Lia not available in loadKlarnaWidget");
    return;
  }

  const container = document.getElementById("klarna-payments-container");
  if (container) {
    console.log("Klarna container found for loading:", container);
    // Ensure the container is visible
    container.style.display = "block";
  } else {
    console.error("Klarna container not found for loading");
    return;
  }

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
    Klarna.Lia.api().load(klarnaRequest, function (res) {
      console.log("Klarna widget loaded", res);
    });
  } catch (error) {
    console.error("Error loading Klarna widget:", error);
  }
}

// Add this function to check if the Klarna SDK has loaded
function checkKlarnaSDKLoaded() {
  console.log("Checking if Klarna SDK is loaded");
  if (window.Klarna && window.Klarna.Lia) {
    console.log("Klarna SDK is loaded");
    klarnaAsyncCallback();
  } else {
    console.log("Klarna SDK not loaded yet, retrying in 500ms");
    setTimeout(checkKlarnaSDKLoaded, 500);
  }
}

// Call this function when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");
  // ... (keep the existing code)

  // Add this line to start checking for Klarna SDK
  checkKlarnaSDKLoaded();
});

