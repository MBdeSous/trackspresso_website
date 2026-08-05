const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const bookingForm = document.getElementById("bookingForm");
const bookingType = document.getElementById("bookingType");
const bookingDate = document.getElementById("bookingDate");
const estimatedCups = document.getElementById("estimatedCups");
const cupsHelp = document.getElementById("cupsHelp");
const formMessage = document.getElementById("formMessage");

// Replace this with your real Yoco Checkout/payment-link URL later.
// Replace this email address with the real Trackspresso booking email.
const BOOKING_EMAIL = "jtcrossman3child@gmail.com";

document.getElementById("currentYear").textContent = new Date().getFullYear();

function setMinimumDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  bookingDate.min = `${year}-${month}-${day}`;
}

setMinimumDate();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function updateCupRequirement() {
  const isTimeSlot = bookingType.value === "Time-slot booking";

  estimatedCups.required = !isTimeSlot;
  estimatedCups.disabled = isTimeSlot;

  if (isTimeSlot) {
    estimatedCups.value = "";
    cupsHelp.textContent =
      "No cup minimum applies. An upfront deposit will secure the selected time slot.";
  } else {
    estimatedCups.disabled = false;
    estimatedCups.required = true;

    if (!estimatedCups.value || Number(estimatedCups.value) < 40) {
      estimatedCups.value = 40;
    }

    cupsHelp.textContent =
      "Minimum cup package: 40 cups. The agreed quota is paid upfront.";
  }
}

bookingType.addEventListener("change", updateCupRequirement);

document.querySelectorAll(".package-select").forEach((button) => {
  button.addEventListener("click", () => {
    bookingType.value = button.dataset.package;
    updateCupRequirement();
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  });
});

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

function buildEmailBody(data) {
  return [
    "New Trackspresso booking request",
    "",
    `Company / event: ${data.companyName}`,
    `Contact person: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Booking option: ${data.bookingType}`,
    `Estimated cups: ${data.estimatedCups}`,
    `Preferred date: ${data.bookingDate}`,
    `Start time: ${data.startTime}`,
    `Duration: ${data.duration}`,
    `Location: ${data.location}`,
    "",
    `Additional information: ${data.message || "None provided"}`
  ].join("\n");
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);
  const booking = Object.fromEntries(formData.entries());

  if (
    booking.bookingType !== "Time-slot booking" &&
    Number(booking.estimatedCups) < 40
  ) {
    showMessage("Cup-package bookings require a minimum of 40 cups.", "error");
    return;
  }

  if (booking.bookingType === "Time-slot booking") {
    booking.estimatedCups = "Not applicable — deposit booking";
  }

  // Saves a copy locally for testing/demo purposes.
  const savedBookings = JSON.parse(localStorage.getItem("trackspressoBookings") || "[]");
  savedBookings.push({
    ...booking,
    reference: `TRK-${Date.now()}`,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem("trackspressoBookings", JSON.stringify(savedBookings));

  const subject = encodeURIComponent(
    `Trackspresso booking request – ${booking.companyName}`
  );
  const body = encodeURIComponent(buildEmailBody(booking));

  showMessage(
    "Almost done! You will now be redirected to your email application. Review the completed booking details and press 'Send' to submit your request to Trackspresso.",
    "success"
  );

  setTimeout(() => {
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
  }, 500);

});
