let logEntries = [];

function logToConsole(message, object = null) {
  const timestamp = new Date().toISOString();
  let logEntry = `${timestamp}: ${message}`;
  
  if (object) {
    console.log(logEntry, object);
    logEntry += '\n' + JSON.stringify(object, null, 2);
  } else {
    console.log(logEntry);
  }
  
  logEntries.unshift(logEntry);
  
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

  const placeOrderBtn = document.getElementById("place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function(event) {
      event.preventDefault();
      logToConsole("Place order button clicked");
      authorizeKlarnaPayment();
    });
    logToConsole("Place order button event listener added");
  } else {
    logToConsole("Error: Place order button not found");
  }

  // Start checking for Klarna SDK
  checkKlarnaSDKLoaded();
});

window.klarnaAsyncCallback = function () {
  logToConsole("Klarna.Lia.api().klarnaAsyncCallback called");
  if (window.Klarna && window.Klarna.Lia) {
    logToConsole("Klarna.Lia SDK has finished loading");
    const container = document.getElementById("klarna-payments-container");
    if (container) {
      logToConsole("Klarna.Lia container found: " + container.id);
    } else {
      logToConsole("Klarna.Lia container not found");
    }
    try {
      const initOptions = {
        container: "#klarna-payments-container"
      };
      logToConsole("Klarna.Lia.api().init called with options:", initOptions);
      Klarna.Lia.api().init(initOptions);
      logToConsole("Klarna.Lia.api().init completed successfully");
    } catch (error) {
      logToConsole("Klarna.Lia.api().init error: " + error.message);
    }
  } else {
    logToConsole("Klarna.Lia not available in klarnaAsyncCallback");
  }
};

function loadKlarnaWidget() {
  logToConsole("Klarna.Lia.api().load called");
  if (!window.Klarna || !window.Klarna.Lia) {
    logToConsole("Klarna.Lia not available for Klarna.Lia.api().load");
    return;
  }

  const UpdateObject = {
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

  const loadOptions = {
    container: "#klarna-payments-container"
  };

  const fullKlarnaRequest = {
    loadOptions: loadOptions,
    UpdateObject: UpdateObject
  };

  logToConsole("Klarna.Lia.api().load full request:", fullKlarnaRequest);

  try {
    Klarna.Lia.api().load(loadOptions, UpdateObject, function (res) {
      logToConsole("Klarna.Lia.api().load response:", res);
    });
  } catch (error) {
    logToConsole("Klarna.Lia.api().load error: " + error.message);
  }
}

function checkKlarnaSDKLoaded() {
  if (window.Klarna && window.Klarna.Lia) {
    logToConsole("Klarna.Lia SDK loaded");
    klarnaAsyncCallback();
  } else {
    setTimeout(checkKlarnaSDKLoaded, 500);
  }
}

function authorizeKlarnaPayment() {
  logToConsole("Authorizing Klarna payment");

  const orderData = {
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
      email: "john.doe@example.com",
      given_name: "John",
      family_name: "Doe",
      phone: "+447700900123",
      country: "GB",
      street_address: "221B Baker Street",
      postal_code: "NW1 6XE",
      region: "Greater London",
      city: "London"
    },
    shipping_address: {
      email: "jane.smith@example.com",
      given_name: "Jane",
      family_name: "Smith",
      phone: "+447700900456",
      country: "GB",
      street_address: "10 Downing Street",
      postal_code: "SW1A 2AA",
      region: "Greater London",
      city: "London"
    }
  };

  logToConsole("Klarna.Lia.api().authorize called with order data:", orderData);

  Klarna.Lia.api().authorize(orderData, function(vcn) {
    logToConsole("Klarna.Lia.api().authorize callback received:", vcn);
    
    if (vcn.approved) {
      logToConsole("Payment authorized successfully");
      // Handle successful authorization (e.g., redirect to confirmation page)
    } else {
      logToConsole("Payment authorization failed");
      // Handle failed authorization (e.g., show error message to user)
    }
  });
}

