# Krishi Setu - Web Application

A dedicated, modern, and responsive web frontend for the **Krishi Setu** (Agricultural Bridge) platform built with React, Vite, and Tailwind CSS.

## Features
- **Direct Farm Marketplace**: Consumers can explore fresh crops, filter by category (Vegetables, Fruits, Grains, Pulses), and search in real-time.
- **Harvest Cart & Order Placement**: Interactive cart with quantity adjustment, free delivery tiers, and direct-to-farm checkout simulation.
- **Farmer Cultivator Portal**:
  - Government Aadhaar verification integration (`123456789012` for demo).
  - Crop listing with automatic APMC Mandi benchmark pricing calculation.
  - Crop inventory management with real-time stock and removal.
  - Live data.gov.in Mandi price checker widget.
- **Zero Modifications**: Completely independent from the mobile React Native codebase and uses the existing Express/MongoDB backend APIs.

## Getting Started

### 1. Install Dependencies
```bash
cd D:\krishi-setu\web
npm install
```

### 2. Start the Backend API (if not already running)
```bash
cd D:\krishi-setu\krishi-setu\backend
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

### 3. Run the Web Development Server
```bash
cd D:\krishi-setu\web
npm run dev
```
Access the web application at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.
