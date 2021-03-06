// Get the form
const form = document.querySelector("form");

// Add with JS so native validation still works if JS is not available
form.noValidate = true;

//  Get error for the field
const getError = field => {
  // Get validity object
  const validity = field.validity;

  // If field is required and empty
  // prettier-ignore
  if (validity.valueMissing) {
    if (field.name === "name") return "Please enter your name.";
    if (field.name === "email") return "Please enter your email.";
    if (field.name === "country") return "Please choose the country of purchase.";
    if (field.name === "tel") return "Please enter your phone number.";
    if (field.name === "date") return "Please enter the date of purchase.";
    if (field.name === "product") return "Please select your product.";
    if (field.name === "serial") return "Please enter the serial number of your product.";
    if (field.name === "extra") return "Please select the 3 extra options.";
    if (field.name === "terms") return "You must agree to the Terms & Conditions.";
    return "Please fill out this field.";
  }

  // If pattern doesn't match
  if (validity.patternMismatch) return field.getAttribute("title");

  // If name is too short
  if (validity.tooShort) return "Name should be longer than 1 character.";

  // If name is too long
  if (validity.tooLong) return "Name should be less than 100 characters.";

  // If less than 3 extra options are selected
  if (validity.customError) return field.validationMessage;
};

// Validate current field
const validateField = field => {
  // Toggles the invalid class as needed
  field.classList.toggle("invalid", !field.validity.valid);

  // Get message if one is present
  const message = field.closest("div").querySelector(".error-msg");

  // Check if field is valid or not
  if (field.validity.valid) {
    if (message) {
      // If valid and still has error message, then remove it
      message.remove();
    }
    // If valid and no error message, then do nothing
    return;
  } else {
    // Get error message
    const error = getError(field);

    if (message) {
      // If invalid and still has old message, then remove old message
      message.remove();
    }
    // Insert new message
    field
      .closest("div")
      .insertAdjacentHTML("beforeend", `<div class="error-msg">${error}</div>`);
  }
};

// Listen to all blur events
document.addEventListener(
  "blur",
  function(event) {
    const field = event.target;
    if (field.type === "submit") return;
    validateField(field);
  },
  true
);

// Remove error message if correct input when typing
// WARNING: This may not be best practice
document.addEventListener("input", function(event) {
  const field = event.target;
  const message = field.closest("div").querySelector(".error-msg");
  if (field.validity.valid && message) {
    message.remove();
  }
});

// Validate on submit
form.onsubmit = event => {
  event.preventDefault();

  if (!form.checkValidity()) {
    // Create array of invalid fields
    const invalidFields = [];

    // Validate each field and save invalid fields to array
    for (const field of form.querySelectorAll("input, select")) {
      validateField(field);
      if (!field.validity.valid) invalidFields.push(field);
    }

    // Focus on first invalid field
    invalidFields[0].focus();
  } else {
    // Show success message
    form.innerHTML = `
      <h1>Product Registration Form</h1>
      <hr />
      <div class="success">Your product has been registered successfully!</div>
    `;
  }
};

// Add dashes automatically and restrict to numbers and letters for Serial Number
document.getElementById("serial").addEventListener("input", function() {
  this.value = this.value
    .match(/[a-zA-Z0-9]*/g)
    .join("")
    .match(
      /([a-zA-Z0-9]{0,4})([a-zA-Z0-9]{0,4})([a-zA-Z0-9]{0,4})([a-zA-Z0-9]{0,4})/
    )
    .slice(1)
    .join("-")
    .replace(/-*$/g, "")
    .toUpperCase();
});

// Set phone input attributes depending on selected country
const tel = document.getElementById("tel");

// prettier-ignore
document.querySelectorAll('input[name="country"]').forEach(radio => {
  radio.addEventListener("click", function() {
    if (this.value === "usa") {
      tel.setAttribute("placeholder", "123 456 7890");
      tel.setAttribute("pattern", "(?:\\d{1}\\s)?\\(?(\\d{3})\\)?-?\\s?(\\d{3})-?\\s?(\\d{4})");
      tel.setAttribute("title", "A valid US 10 digit phone number is required.");
    } 
    if (this.value === "int") {
      tel.setAttribute("placeholder", "+1234567890");
      tel.setAttribute("pattern", "(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\\s*[)]?[-\\s\\.]?[(]?[0-9]{1,3}[)]?([-\\s\\.]?[0-9]{3})([-\\s\\.]?[0-9]{3,4})");
      tel.setAttribute("title", "A valid international phone number is required."
      );
    }
  });
});

const product = document.getElementById("product");
const extra = document.getElementById("extra");

// Hide div for extra options with JS so it will be visible if JS is not available
extra.closest("div").style.display = "none";

// Show extra and make it required only when modelZ is selected
product.addEventListener("change", function() {
  if (product.value === "modelZ") {
    extra.closest("div").style.display = "block";
    extra.required = true;
  } else {
    extra.closest("div").style.display = "none";
    extra.required = false;
  }
});

// Require that exactly 3 extra options are selected
extra.addEventListener("change", function() {
  const selected = document.querySelectorAll("#extra option:checked");
  const notSelected = document.querySelectorAll("#extra option:not(:checked)");
  if (selected.length > 3) {
    selected.forEach(option => {
      option.selected = false;
    });
  } else if (selected.length >= 3) {
    notSelected.forEach(option => {
      option.disabled = true;
    });
    this.setCustomValidity("");
  } else {
    notSelected.forEach(option => {
      option.disabled = false;
    });
    this.setCustomValidity("All 3 extra options are required.");
  }
});

// Dates of products release
const dateX = new Date("January 1, 2005");
const dateY = new Date("January 1, 2010");
const dateZ = new Date("January 1, 2015");
// Today's date
const today = new Date();
// Get entire date picker
const date = document.getElementById("date");

const validateDate = () => {
  const datePurchased = new Date(date.value);
  // Adjust for time zone offsetting the date one day off.
  datePurchased.setMinutes(
    datePurchased.getMinutes() + datePurchased.getTimezoneOffset()
  );

  if (datePurchased > today) {
    date.setCustomValidity("Purchase date cannot be in the future.");
  } else if (product.value === "modelX" && datePurchased < dateX) {
    date.setCustomValidity("Model X had not yet been released on this date.");
  } else if (product.value === "modelY" && datePurchased < dateY) {
    date.setCustomValidity("Model Y had not yet been released on this date.");
  } else if (product.value === "modelZ" && datePurchased < dateZ) {
    date.setCustomValidity("Model Z had not yet been released on this date.");
  } else {
    date.setCustomValidity("");
  }
};

date.addEventListener("change", validateDate);
