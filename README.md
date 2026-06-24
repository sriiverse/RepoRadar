# RepoRadar — GitHub Repository Intelligence Platform

> **An immersive, open-source repository intelligence platform.** RepoRadar analyzes any public GitHub codebase to generate composite health scores, bus factor risk indexes, commit velocity trends, and download-ready PDF reports inside a cinematic, cyberpunk glassmorphic interface.

Designed in the spirit of premium, high-end engineering platforms (like Linear, Vercel, and Apple Vision Pro), RepoRadar departs from traditional flat SaaS layouts, presenting code analytics as an interactive AI operating system.

---

## 🌌 Immersive Experience & Visual Design
RepoRadar's user interface is built to demonstrate intelligence through motion:
*   **3D Holographic AI Core:** Powered by **React Three Fiber**, featuring a pulsating inner point-light core, a suspended rotating GitHub logo, three concentric holographic rings rotating on separate axes, and a data-orbit particle system. The core dynamically accelerates its spin when ingesting codebases.
*   **Living Data Streams:** Curved Bezier curves connect the core to floating glassmorphic modules. Glowing energy packets travel periodically from the modules into the core, triggering a visual scale pulse.
*   **Canvas Particle System:** A lightweight, high-performance HTML5 `<canvas>` particle emitter drifts in the background over deep radial glows, avoiding flat black areas and creating cinematic depth.
*   **Seamless Ingestion Sequence:** Clicking scan triggers a coordinated visual pipeline (input glow ➔ URL packet travel ➔ core acceleration ➔ module scanlines ➔ dashboard transition) in under 30 seconds.

---

## 📊 Key Features
1.  **Automated Health Scoring:** A composite index (0–100) assessing project vitality based on commit cadence, active workdays, and PR velocity.
2.  **Bus Factor Risk Assessment:** Evaluates commit concentration among contributors to identify single points of failure and maintainer dependencies.
3.  **Simulated Dashboard Preview:** An interactive live preview of weekly commit frequency charts (using Recharts), an active 52-week contribution heatmap, and language byte compositions.
4.  **Executive PDF Reports:** Generates clean, download-ready executive summaries compiling code metrics and compliance risk profiles.
5.  **Bento Grid Capabilities:** A premium, bouncy Bento-styled capabilities overview showcasing system modules.

---

## 🛠️ Tech Stack
*   **Framework:** [Next.js 14 (App Router)](https://nextjs.org/) & [React 18](https://react.dev/)
*   **3D Engine:** [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), & [@react-three/drei](https://github.com/pmndrs/drei)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
*   **Styling:** [TailwindCSS](https://tailwindcss.com/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18.x or later) installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sriiverse/RepoRadar.git
cd RepoRadar
npm install
```

### 2. Configure GitHub Access Token (Optional but Recommended)
To prevent GitHub API rate limits, set up a Personal Access Token:
1. Go to your GitHub account **Settings ➔ Developer Settings ➔ Personal Access Tokens (classic)**.
2. Generate a new token (classic). Check only the **`public_repo`** scope (read-only access).
3. Create a `.env.local` file in the root of the project:
   ```env
   GITHUB_TOKEN=your_personal_access_token_here
   ```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in your console) to view the application live.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
