// Get the form
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
  if (!form.checkValidity()) {
    event.preventDefault();

    // Create array of invalid fields
    const invalidFields = [];

    // Validate each field and save invalid fields to array
    for (const field of form.querySelectorAll("input, select")) {
      validateField(field);
      if (!field.validity.valid) invalidFields.push(field);
    }

    // Focus on first invalid field
    invalidFields[0].focus();
  }
};

//   To do:
// - Refactor code and make it cleaner/better.
// - Focus on radios and checkboxes.
// - Fix bug when unselecting checkbox and having to click once before being able to submit.
// - Do something about hiding error on input to make it more user friendly. Something like show the error again when field again invalid.
