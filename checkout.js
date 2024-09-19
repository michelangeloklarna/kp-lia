let logEntries = [];

function logToConsole(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${message}`;
  console.log(logEntry);
  
  logEntries.unshift(logEntry); // Add new entry to the beginning of the array
  
  const consoleLog = document.getElementById('console-log');
  if (consoleLog) {
    consoleLog.innerHTML = logEntries.join('\n');
  }
}

logToConsole("Script started");

document.addEventListener("DOMContentLoaded", function () {
  logToConsole("DOM content loaded");

  const shippingAddressSection = document.getElementById("shipping-address-section");
  const klarnaOption = document.getElementById("klarna-option");
  const klarnaPayment = document.getElementById("klarna-payment");
  const cardPayment = document.getElementById("card-payment");

  if (!shippingAddressSection || !klarnaOption || !klarnaPayment || !cardPayment) {
    logToConsole("One or more elements not found");
    return;
  }

  logToConsole("All elements found");

  // Hide shipping address section by default
  shippingAddressSection.style.display = "none";

  // Add event listener for payment method selection
  klarnaOption.addEventListener("change", function () {
    if (this.checked) {
      logToConsole("Klarna option selected");
      klarnaPayment.style.display = "block";
      cardPayment.style.display = "none";
      loadKlarnaWidget();
    }
  });

  document.getElementById("card-option").addEventListener("change", function () {
    if (this.checked) {
      logToConsole("Card option selected");
      klarnaPayment.style.display = "none";
      cardPayment.style.display = "block";
    }
  });

  // Start checking for Klarna SDK
  checkKlarnaSDKLoaded();
});

window.klarnaAsyncCallback = function () {
  logToConsole("klarnaAsyncCallback called");
  if (window.Klarna && window.Klarna.Lia) {
    logToConsole("Klarna SDK has finished loading.");
    const container = document.getElementById("klarna-payments-container");
    if (container) {
      logToConsole("Klarna container found: " + container.id);
    } else {
      logToConsole("Klarna container not found");
    }
    try {
      Klarna.Lia.api().init({
        container: "#klarna-payments-container"
      });
      logToConsole("Klarna.Lia.api().init called successfully");
    } catch (error) {
      logToConsole("Error initializing Klarna Lia: " + error.message);
    }
  } else {
    logToConsole("Klarna.Lia not available in klarnaAsyncCallback");
  }
};

function loadKlarnaWidget() {
  logToConsole("loadKlarnaWidget called");
  if (!window.Klarna || !window.Klarna.Lia) {
    logToConsole("Klarna.Lia not available in loadKlarnaWidget");
    return;
  }

  const klarnaRequest = {
    locale: "en-GB",
    purchase_country: "GB",
    purchase_currency: "GBP",
    order_amount: 38900,
    order_tax_amount: 0,
    order_lines: [
      {
        type: "physical",
        name: "LG 43UR78006LK 2023",
        quantity: 1,
        unit_price: 29900,
        tax_rate: 0,
        total_amount: 29900,
        total_tax_amount: 0,
        reference: "11d609c0-0609-4b3b-a472-40175828ebe1"
      },
      {
        type: "physical",
        name: "adidas Supernova Stride Men's Sports Trainers",
        quantity: 1,
        unit_price: 9000,
        tax_rate: 0,
        total_amount: 9000,
        total_tax_amount: 0,
        reference: "11d609c0-0609-4b3b-a472-40175828ebe2"
      }
    ]
  };

  try {
    Klarna.Lia.api().load({
      container: "#klarna-payments-container"
    }, klarnaRequest, function (res) {
      logToConsole("Klarna widget loaded: " + JSON.stringify(res));
    });
  } catch (error) {
    logToConsole("Error loading Klarna widget: " + error.message);
  }
}

function checkKlarnaSDKLoaded() {
  if (window.Klarna && window.Klarna.Lia) {
    logToConsole("Klarna SDK is loaded");
    klarnaAsyncCallback();
  } else {
    setTimeout(checkKlarnaSDKLoaded, 500);
  }
}

