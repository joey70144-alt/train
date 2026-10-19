# 《道岔》(The Switch) — 3D Ethics Decision Web Game

[![Three.js](https://img.shields.io/badge/Three.js-r186-black?logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An immersive first-person, low-poly 3D ethics decision web game built around the **Trolley Problem** and related moral dilemmas.

Players observe real-time railway emergencies from a signal observation post, examine verified facts versus unconfirmed hazards in a tactical case dossier, make high-stakes choices against a ticking countdown, and witness the physical consequences and philosophical reflections of their decisions.

> **Design Philosophy**: The game never reduces players to "good" or "evil" with simplistic moral scoring, nor does it preach a single correct answer. Instead, it invites thoughtful introspection into moral luck, utilitarianism, deontology, and personal responsibility under authority.

---

## 🛠️ Tech Stack

This project is built with modern, production-grade web technologies:

- **[Three.js](https://threejs.org/)**: 3D scene graph, perspective camera, custom PBR materials, shadows, atmospheric fog (`FogExp2`), RoomEnvironment reflections, and procedural low-poly models (locomotive, tracks, levers, signals, figures).
- **[React](https://react.dev/) (v19)**: Component-based UI, reactive state management, modal dialogs, and HUD overlays.
- **[Vite](https://vitejs.dev/) (v8)**: Fast development server and optimized production bundler.
- **[TypeScript](https://www.typescriptlang.org/)**: Full end-to-end type safety for scenarios, choices, kinematics, and audio states.
- **[Tailwind CSS](https://tailwindcss.com/) (v4)**: Responsive layout, glassmorphic styling, and UI typography.
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)**: 100% procedural sound synthesizer for locomotive chugging, Eb triad diesel horns, mechanical lever throws, emergency pneumatic brakes, and countdown tension tones (zero external 404 audio assets).

---

## 🚀 Getting Started & Installation

### Prerequisites
- Node.js (version 18.0 or higher recommended)
- npm (version 9.0 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/the-switch-3d-ethics-game.git
cd the-switch-3d-ethics-game
```

### 2. Install dependencies
Run the following command in the root directory to install all required packages:
```bash
npm install
```

### 3. Run the development server
Start the local Vite development server:
```bash
npm run dev
```
Once started, open your browser and navigate to:
```text
http://localhost:3000
```

### 4. Build the project for production
To compile TypeScript and bundle optimized static assets for production deployment:
```bash
npm run build
```
The production-ready output will be generated inside the `dist/` directory.

You can preview the production build locally with:
```bash
npm run preview
```

---

## 🚂 The 4 Ethical Scenarios

| Code | Title (繁體中文) | Ethical Theme | Core Dilemma |
| :--- | :--- | :--- | :--- |
| **SCN-01** | **經典岔道**<br>*(The Classic Switch)* | Outcome vs. Responsibility (結果與責任) | A runaway heavy train is hurtling towards 5 workers on the main track. Pull the switch lever to divert to a siding with 1 inspector, or refrain from action? (Consequentialism vs. Deontology) |
| **SCN-02** | **緊急制動**<br>*(Emergency Brake)* | Uncertainty & Risk (不確定性與風險) | Unverified rockfall vibration inside a tunnel (55% historical false alarm). Emergency braking fractures bones of 30+ passengers; telemetry verification takes 8 critical seconds; maintaining speed risks catastrophic derailment. |
| **SCN-03** | **誰的責任**<br>*(Whose Responsibility)* | Obedience to Authority vs. Conscience (服從命令與個人責任) | Central dispatch orders you to clear an express train despite a flashing red interlocking signal and a jammed switch point blade. Follow official orders, refuse and halt, or divert to a relief siding? |
| **SCN-04** | **無法兼顧**<br>*(Tragedy of Allocation)* | Resource Allocation & Ethics (資源分配與倫理原則) | Blizzard night: North Line has 3 stranded trackworkers freezing to death (100% certainty); South Line has a runaway freight train threatening a suburban town (30% probability). You possess only one rescue diesel engine. |

---

## 🎮 Controls

### Desktop (Keyboard & Mouse)
- **W / A / S / D** or **Arrow Keys**: Walk around the signal observation deck.
- **Mouse Look**: Rotate camera view (click to engage pointer lock).
- **Bottom Options Bar**: Click to select your moral decision action.
- **Esc Key**: Pause game and freeze countdown timer.

### Mobile & Tablet (Touch)
- **Touch Screen Swipe**: Swipe to look around in full 3D space and inspect tracks.
- **Bottom Options Bar**: Instantly tap choices to execute actions.

---

## 📂 Project Structure

```text
├── index.html                     # HTML5 entry point with metadata
├── package.json                   # Project dependencies and npm scripts
├── tsconfig.json                  # TypeScript compiler options
├── vite.config.ts                 # Vite bundler configuration
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── index.css                  # Tailwind CSS import and viewport styling
│   ├── App.tsx                    # Main game orchestrator & state machine
│   ├── types/
│   │   └── game.ts                # TypeScript interfaces for scenarios & outcomes
│   ├── data/
│   │   └── scenarios.ts           # 4 detailed scenario datasets & reflection inquiries
│   ├── audio/
│   │   └── soundSystem.ts         # Procedural Web Audio API sound synthesizer
│   ├── game3d/
│   │   ├── ProceduralModels.ts    # Low-poly locomotive, tracks, levers, and figures
│   │   ├── TrainSystem.ts         # Spline movement, braking deceleration & derail physics
│   │   ├── SceneManager.ts        # Three.js renderer, PBR lighting, and fog weather
│   │   ├── PlayerController.ts    # First-person WASD / touch joystick controller
│   │   └── InteractionSystem.ts   # Raycaster reticle hover detection
│   └── components/
│       ├── HUD.tsx                # Reticle, countdown timer bar, and mobile controls
│       ├── InfoPanel.tsx          # Dossier with verified vs. unconfirmed facts
│       ├── ResultScreen.tsx       # Post-choice consequences & philosophical reflection
│       ├── MainMenu.tsx           # Title screen with atmospheric 3D camera pan
│       ├── ScenarioSelect.tsx     # Scenario picker with completion history badges
│       ├── SettingsModal.tsx      # Audio volume, mouse sensitivity & invert Y toggles
│       ├── GuideModal.tsx         # Comprehensive controls guide
│       └── PauseModal.tsx         # Pause overlay with resume and restart options
```

---

## 🚢 Production Deployment

Because this project is a pure client-side SPA (Single Page Application), it can be deployed to any static host:

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project on [Vercel](https://vercel.com/).
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**.

### Deploy to GitHub Pages
1. In `vite.config.ts`, set `base: './'`.
2. Run `npm run build`.
3. Push the generated `dist/` directory to the `gh-pages` branch.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
