# Snatch - Interactive VC Demo Prototype

Snatch is a gamified, real-world sponsored hunt platform built as a premium browser-based product demo. This interactive prototype simulates the user experience of discovering local hunts, approaching coordinates, snatching holographic prizes in AR, and upgrading profile abilities, combined with a brand campaign SaaS dashboard.

---

## 🌟 Key Product Surfaces

1. **Brand Campaign Studio (SaaS Dashboard)**:
   - Brands customize, test, and launch geo-targeted drops in real-time.
   - Interactive Soho, NYC map showing geofences, scan radius, target indicators, and coordinates.
   - Real-time Drops database table displaying active drops and draft campaigns.
2. **iPhone 15 Mobile App Simulator**:
   - **Discover (Hunts View)**: Snapchat-style camera viewfinder with radar scan sweep, proximity compass, distance pills, and unlocked interactive AR rewards. Includes the Quick Hunt launcher.
   - **Approach Screen**: Simulated GPS walk with proximity tracking. Slide the ranges down to <25m to activate the **SNATCH IT** button.
   - **Wallet View**: Keeps track of snatched coupon codes, dynamic countdown tickers, and status badges.
   - **Quick Hunt (Lobby & Social Play)**: A social lobby flow enabling users to create, invite, and drop custom Starbucks coordinates for their friends.
   - **Snatch Mode Scanner**: An immersive scanner utilizing custom overlays, grid lines, and active camera updates to gain experience (XP) and level up.
   - **Abilities Upgrade & Profile**: High-density statistics dashboard and interactive ability point upgrades (e.g., Scan Range, Radar Power).
   - **Ambassador Leaderboard**: Visual ranking tracking Soho top players and ambassador campaign assistance.
3. **VC Demo Story Mode**:
   - Guided presentation layers detailing pre-seed metrics, compound defensibility, and market beachheads.

---

## 🛠️ Tech Stack & Architecture

- **Core Structure**: Semantic HTML5 and premium dark mode Vanilla CSS.
- **Visuals & Design**: Custom SVG vector graphics, HSL color palettes, neon accents, rotating concentric 3D orbit rings, and 3D floating animation wrappers.
- **Interactions**: Pure Vanilla JavaScript (`app.js`) driving mock state sync, map geofencing calculations, tab switching, and simulator synchronization.
- **Local Server**: A lightweight, native Node.js static files server (`server.js`) designed to bypass local system dependencies.

---

## 🚀 Running the Project Locally

To run the VC demo locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to:
   **[http://localhost:8000/](http://localhost:8000/)**

---

## 🔍 Interactive Demo Guide

- **Flow A: Studio to Mobile Sync**: Go to **Campaign Studio**, adjust the geofence slider, and click **LAUNCH HUNT >>**. The simulator will trigger a camera flash overlay, unlock the Nike Air Max sneaker, and update the drops table in real-time.
- **Flow B: Sponsored Nike Hunt**: Tap the unlocked Nike sneaker, slide the proximity indicator down to <25m, click **SNATCH IT**, and review the voucher in your **Wallet**.
- **Flow C: Quick Hunt Creator**: Tap the lightning trigger button on the Hunts screen, complete the creation stepper, view the crew join QR code, and snatch the Starbucks cup in player mode.
- **Flow D: Upgrades & Leaderboards**: Open **Profile**, click the **Hunter Abilities** shortcut card, upgrade your Scan Range, and then click **ENTER SNATCH MODE** to scan and trigger level-ups.
