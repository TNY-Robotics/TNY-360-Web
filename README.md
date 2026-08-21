<div align="center">

# TNY-360 Web Interface

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Framework](https://img.shields.io/badge/Framework-Nuxt_4-00DC82.svg?logo=nuxt.js)](https://nuxt.com/)
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)

**The official, all-in-one web companion app for the TNY-360 quadruped robot.**

[🌐 Website](https://tny-robotics.com/tny-360) • [🤖 TNY-360 Repo](https://github.com/TNY-Robotics/TNY-360) • [💬 Discord](https://discord.gg/XGABkx5A4y) • [📖 Documentation](https://tny-robotics.com/docs/tny-360/) • [☕ Support Us](https://ko-fi.com/tnyrobotics)

</div>

---

## 🌟 Overview

As the **TNY-360** project grew, we decided to extract its user interface into a dedicated repository. Built with **Nuxt 4** and powered by the official **TNY-360 JS/TS SDK**, this modern web application is the ultimate control center for your robot dog. 

Whether you want to drive it around, create custom animations, teach kids how to code, or debug low-level PID values, everything is packed into this single, sleek interface.

## ✨ Core Modules

This application is divided into four main workspaces:

* 🎮 **Teleoperation (Drive):** A responsive, low-latency control interface. Drive your TNY-360, trigger actions, and view the live camera feed right from your browser.
* 🎬 **TNY-Animator:** A complete animation studio. Create, edit, and fine-tune custom movements and poses for your robot through an intuitive timeline.
* 🧩 **TNY-Coder:** The evolution of our block-based programming tool (now directly integrated). Drag and drop logical blocks to create complex behaviors without writing a single line of C++. Perfect for STEM and education!
* ⚙️ **TNY-Dash:** The mechanic's toolkit. Monitor live telemetry, battery health, calibrate offsets, and tweak the robot configurations on the fly.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. Clone this repository:
```bash
git clone [https://github.com/TNY-Robotics/TNY-360-Web.git](https://github.com/TNY-Robotics/TNY-360-Web.git)
cd TNY-360-Web

```

2. Install the dependencies using `npm`:

```bash
npm install

```

3. Start the development server:

```bash
npm run dev

```

4. Open your browser and navigate to `http://localhost:3000`.

> **💡 Note on connection:** You don't need to manually configure IP addresses or mess with `.env` files. The app uses automatic discovery to find and connect to your TNY-360 on the local network!

## 🛠️ Tech Stack

* **Framework:** [Nuxt 4](https://nuxt.com/) (Vue.js)
* **Language:** TypeScript
* **Integration:** Official TNY-360 JS/TS SDK for robust WebSocket communication and state management.

## 🤝 Contributing

Just like the robot itself, this interface is open-source and thrives on community contributions.

* Feel free to submit Pull Requests to add new features, improve UI/UX, or fix bugs.
* If you have an idea for a new module or block for TNY-Coder, [Open an Issue](https://github.com/TNY-Robotics/TNY-360-Web/issues) to discuss it!

## ☕ Support the Project

The TNY-360 ecosystem is 100% free and open-source. If this interface helps you, consider supporting our R&D! Your tips help us buy prototyping materials and keep the servers running.

## 📄 License & Authors

**TNY-360-Web** is maintained by the [TNY Robotics Team](https://tny-robotics.com).

Licensed under **CC BY-NC-SA 4.0**.

*You are free to share and adapt this material for non-commercial purposes, as long as you provide attribution and share alike.*
