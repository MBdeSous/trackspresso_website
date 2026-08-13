const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const bookingForm = document.getElementById("bookingForm");
const bookingType = document.getElementById("bookingType");
const bookingDate = document.getElementById("bookingDate");
const duration = document.getElementById("duration");

const bookingPrice = document.getElementById("bookingPrice");
const priceBreakdown = document.getElementById("priceBreakdown");

const formMessage = document.getElementById("formMessage");

const packageButtons = document.querySelectorAll(".package-select");
const estimatedGuests = document.getElementById("estimatedGuests");
const guestEstimateValue = document.getElementById("guestEstimateValue");

const BOOKING_EMAIL = "jtcrossman3child@gmail.com";


// =====================================================
// CURRENT YEAR
// =====================================================

document.getElementById("currentYear").textContent =
    new Date().getFullYear();


// =====================================================
// MINIMUM BOOKING DATE
// =====================================================

function setMinimumDate() {

    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();

    const month = String(
        tomorrow.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        tomorrow.getDate()
    ).padStart(2, "0");

    bookingDate.min = `${year}-${month}-${day}`;
}

setMinimumDate();


// =====================================================
// MOBILE MENU
// =====================================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("open");

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            document.body.classList.remove(
                "menu-open"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


// =====================================================
// BOOKING PRICE CALCULATOR
// =====================================================

function updateBookingPrice() {

    const hours = Number(duration.value);


    // Nothing selected
    if (!hours) {

        bookingPrice.textContent =
            "Select a package";

        priceBreakdown.textContent =
            "Your estimated booking price will appear here.";

        return;
    }


    // =========================
    // HOURLY 1 - 5 HOURS
    // =========================

    if (hours >= 1 && hours <= 5) {

        const price = hours * 100;

        bookingType.value =
            "Hourly booking";

        bookingPrice.textContent =
            `R${price}`;

        priceBreakdown.textContent =
            `${hours} hour${hours > 1 ? "s" : ""} × R100 per hour`;

        return;
    }


    // =========================
    // HALF DAY
    // =========================

    if (hours === 6) {

        bookingType.value =
            "Half-day booking";

        bookingPrice.textContent =
            "R550";

        priceBreakdown.textContent =
            "Half-day package · 6 hours";

        return;
    }


    // =========================
    // FULL DAY
    // =========================

    if (hours === 12) {

        bookingType.value =
            "Full-day booking";

        bookingPrice.textContent =
            "R1,000";

        priceBreakdown.textContent =
            "Full-day package · 12 hours";

        return;
    }

}


// =====================================================
// PACKAGE CARD BUTTONS
// =====================================================

packageButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedPackage =
            button.dataset.package;

        const selectedDuration =
            button.dataset.duration;


        bookingType.value =
            selectedPackage;

        duration.value =
            selectedDuration;


        updateBookingPrice();


        document
            .getElementById("booking")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


// =====================================================
// CHANGE DURATION MANUALLY
// =====================================================

duration.addEventListener(
    "change",
    updateBookingPrice
);


// =====================================================
// CHANGE PACKAGE MANUALLY
// =====================================================

bookingType.addEventListener("change", () => {

    if (bookingType.value === "Hourly booking") {

        duration.value = "1";

    }

    else if (
        bookingType.value ===
        "Half-day booking"
    ) {

        duration.value = "6";

    }

    else if (
        bookingType.value ===
        "Full-day booking"
    ) {

        duration.value = "12";

    }

    else {

        duration.value = "";

    }


    updateBookingPrice();

});


// =====================================================
// FORM MESSAGE
// =====================================================

function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className =
        `form-message ${type}`;

}


// =====================================================
// GET PRICE FOR EMAIL
// =====================================================

function getBookingPrice() {

    const hours =
        Number(duration.value);


    if (hours >= 1 && hours <= 5) {

        return `R${hours * 100}`;

    }


    if (hours === 6) {

        return "R550";

    }


    if (hours === 12) {

        return "R1,000";

    }


    return "Not calculated";

}


// =====================================================
// BUILD EMAIL
// =====================================================

function buildEmailBody(data) {

    return [

        "New Trackspresso booking request",

        "",

        `Company / event: ${data.companyName}`,

        `Contact person: ${data.contactName}`,

        `Email: ${data.email}`,

        `Phone: ${data.phone}`,

        `Booking option: ${data.bookingType}`,

        `Preferred date: ${data.bookingDate}`,

        `Start time: ${data.startTime}`,

        `Duration: ${data.duration} hour(s)`,

        `Booking price: ${getBookingPrice()}`,

        `Estimated cups / guests: ${data.estimatedGuests}`,
        
        `Location: ${data.location}`,

        "",

        `Additional information: ${
            data.message || "None provided"
        }`

    ].join("\n");

}


// =====================================================
// SUBMIT BOOKING
// =====================================================

bookingForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        if (!bookingForm.checkValidity()) {

            bookingForm.reportValidity();

            return;

        }


        const formData =
            new FormData(bookingForm);

        const booking =
            Object.fromEntries(
                formData.entries()
            );


        // Save locally for testing/demo
        const savedBookings =
            JSON.parse(
                localStorage.getItem(
                    "trackspressoBookings"
                ) || "[]"
            );


        savedBookings.push({

            ...booking,

            price: getBookingPrice(),

            reference:
                `TRK-${Date.now()}`,

            submittedAt:
                new Date().toISOString()

        });


        localStorage.setItem(
            "trackspressoBookings",
            JSON.stringify(savedBookings)
        );


        const subject =
            encodeURIComponent(
                `Trackspresso booking request – ${booking.companyName}`
            );


        const body =
            encodeURIComponent(
                buildEmailBody(booking)
            );


        showMessage(
            "Almost done! Your email application will open with the booking details completed.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;

        }, 500);

    }
);

estimatedGuests.addEventListener("input", () => {
    guestEstimateValue.textContent = estimatedGuests.value;
});

function updateGuestEstimate() {
    guestEstimateValue.textContent =
        `${estimatedGuests.value} cups`;
}

estimatedGuests.addEventListener(
    "input",
    updateGuestEstimate
);

updateGuestEstimate();
