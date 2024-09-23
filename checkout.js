let logEntries = [];

function logToConsole(message, object = null) {
  const timestamp = new Date().toISOString();
  let logEntry = `${timestamp}: ${message}`;
  
  if (object) {
    console.log(logEntry, object);
    try {
      logEntry += '\n' + JSON.stringify(object, null, 2);
    } catch (error) {
      logEntry += '\n[Object could not be stringified]';
    }
  } else {
    console.log(logEntry);
  }
  
  logEntries.unshift(logEntry);
  
  // Store log entries in sessionStorage
  sessionStorage.setItem('logEntries', JSON.stringify(logEntries));
  
  const consoleLog = document.getElementById('console-log');
  if (consoleLog) {
    consoleLog.innerHTML = logEntries.join('\n').replace(/\n/g, '<br>');
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
    order_lines: [
      {
        type: "physical",
        name: "LG 43UR78006LK 2023",
        image_url: "https://www.lg.com/content/dam/channel/wcms/uk/2024-promotions/euro-screenfills/uhd/ur78/65/original/450x450_studio_resized.jpg",
        product_url: "https://www.lg.com/uk/tvs-soundbars/smart-tvs/43ur78006lk/?srsltid=AfmBOopSsq31bnONf81xbWMxmUg_l8v0caUDy9PHd-RBAnB3htifREPa",
        quantity: 1,
        unit_price: 29900,
        total_amount: 29900,
        reference: "11d609c0-0609-4b3b-a472-40175828ebe1"
      },
      {
        type: "physical",
        name: "adidas Supernova Stride Men's Sports Trainers",
        image_url: "https://johnlewis.scene7.com/is/image/JohnLewis/006884883alt1?$rsp-pdp-port-640$",
        product_url: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/50caa37b0b204101abe679004a7eddba_9366/Supernova_Stride_Running_Shoes_Black_IG8321_HM1.jpg",
        quantity: 1,
        unit_price: 9000,
        total_amount: 9000,
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

  if (!window.Klarna || !window.Klarna.Lia) {
    logToConsole("Error: Klarna.Lia is not available");
    return;
  }

  const orderData = {
    locale: "en-GB",
    purchase_country: "GB",
    purchase_currency: "GBP",
    order_amount: 38900,
    order_tax_amount: 0,
    merchant_reference1: "11d609c0-0609-4b3b-a472-40175828ebe2",
    merchant_reference2: "11d609c0-0609-4b3b-a472-40175828ebe2",
    order_lines: [
      {
        name: "LG 43UR78006LK 2023",
        quantity: 1,
        total_amount: 29900,
        unit_price: 29900
      },
      {
        name: "adidas Supernova Stride Men's Sports Trainers",
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
      city: "London"
    }
  };

  logToConsole("Klarna.Lia.api().authorize about to be called with order data:", orderData);

  try {
    Klarna.Lia.api().authorize(orderData, function(response) {
      logToConsole("Klarna.Lia.api().authorize callback received. Full response:", response);

      if (response.approved && !response.show_form) {
        logToConsole("Payment approved, redirecting to confirmation page");

        // Store the response in sessionStorage to pass it to the confirmation page
        sessionStorage.setItem('klarnaResponse', JSON.stringify(response));

        // Redirect to the order confirmation page
        window.location.href = 'order-confirmation.html';
      } else {
        logToConsole("Payment not approved or additional form required");
      }
    });
    logToConsole("Klarna.Lia.api().authorize call completed");
  } catch (error) {
    logToConsole("Error calling Klarna.Lia.api().authorize:", error);
  }
}

