# Trackspresso Website Starter

A responsive one-page website for Trackspresso, a premium mobile coffee stand operated from a Land Rover.

## What is included

- Premium dark navy/black design
- Responsive mobile navigation
- Hero, About, Experience, Packages, Process and Booking sections
- Uploaded Trackspresso imagery
- Booking form with a 40-cup minimum
- Package selection buttons
- Local browser storage for test bookings
- Email draft creation when the form is submitted
- Placeholder for a future Yoco payment link
- Clean structure ready for GitHub

## Project structure

```text
trackspresso-website/
├── assets/
│   └── images/
│       ├── coffee-pour.png
│       ├── land-rover-coffee.png
│       └── trackspresso-profile.png
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── .gitignore
├── index.html
└── README.md
```

## Run it in VS Code

1. Open the folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

You can also double-click `index.html`, but Live Server is better while editing.

## Things to change first

### 1. Booking email

Open `js/app.js` and change:

```js
const BOOKING_EMAIL = "bookings@trackspresso.co.za";
```

### 2. Yoco payment link

When the Yoco account is ready, replace:

```js
const YOCO_PAYMENT_URL = "";
```

with the real hosted payment or checkout URL.

Do not place secret Yoco API keys in front-end JavaScript. A proper direct checkout integration should be handled by a secure back end.

### 3. Prices

Open `index.html`, search for the `packages` section and add the agreed price per cup, deposit, travel charge and full-event rate.

### 4. Instagram and contact details

Search `index.html` for:

- `@trackspresso`
- `bookings@trackspresso.co.za`
- `https://www.instagram.com/trackspresso/`

and replace anything that is not correct.

## Google Calendar booking

The current starter collects a preferred date but does not read live availability.

Recommended next build:

1. Create a Google Calendar used only for Trackspresso bookings.
2. Add a small Node.js/Express back end.
3. Use Google Calendar's Freebusy endpoint to fetch unavailable periods.
4. Display only open slots on the website.
5. Create a provisional calendar event after an enquiry.
6. Confirm the event after payment.

An easier first version is to place a Google Appointment Schedule link on the website and let Google handle the available slots.

## Yoco payment workflow

A sensible flow is:

1. Customer chooses a date and package.
2. Trackspresso verifies availability and travel details.
3. Customer receives a secure Yoco payment link.
4. Booking becomes confirmed after successful payment.
5. Confirmation email and calendar event are sent.

This avoids accepting payment before confirming that the baristas are available.

## Push to GitHub

Open the VS Code terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial Trackspresso website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/trackspresso-website.git
git push -u origin main
```

Create the empty repository on GitHub before running the last two commands.

## Important production note

This is a front-end starter. Before going live with real bookings and payments, add:

- A server/database
- Spam protection
- Server-side validation
- Secure payment handling
- A privacy policy
- Booking terms, cancellation rules and refund policy
- Live calendar availability
