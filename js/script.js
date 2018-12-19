// Get form to validate
const form = document.querySelector("form");

// Add with JS so native validation still works if JS is not available
form.noValidate = true;

//  Get error for the field
const getError = field => {
  // Get validity object
  const validity = field.validity;

  // If field is required and empty
  if (validity.valueMissing) return "Please fill out this field.";

  // If pattern doesn't match
  if (validity.patternMismatch) return field.getAttribute("title");

  // If name is too short
  if (validity.tooShort) return "Name should be longer than 1 character.";

  // If name is too long
  if (validity.tooLong) return "Name should be less than 100 characters.";
};

// Validate current field
const validateField = field => {
  // Get message if present
  const message = field.parentElement.querySelector(".error-msg");
  if (field.validity.valid) {
    if (message) {
      // If valid and still has error message, then remove it.
      message.remove();
    }
    // If valid and no error message, then do nothing.
    return;
  } else {
    // field.focus();
    // Get error message
    const error = getError(field);

    if (message) {
      // If invalid and still has old message, then remove old message
      message.remove();
    }
    // Insert new message
    field.parentElement.insertAdjacentHTML(
      "beforeend",
      `<div class="error-msg">${error}</div>`
    );
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
document.addEventListener("input", function(event) {
  const field = event.target;
  const message = field.parentElement.querySelector(".error-msg");
  if (field.validity.valid && message) {
    message.remove();
  }
});

// Validate on submit
form.onsubmit = event => {
  if (!form.checkValidity()) {
    event.preventDefault();

    // Create array of invalid fields
    const haveError = [];

    for (const field of form.querySelectorAll("input, select")) {
      validateField(field);
      if (!field.validity.valid) haveError.push(field);
    }

    // Focus on first invalid field
    haveError[0].focus();
  }
};
