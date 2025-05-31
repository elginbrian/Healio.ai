# Healio.ai - Integrated Healthcare Solutions For You 💖

Healio.ai is an innovative, AI-powered digital platform designed to help Indonesians intelligently plan, track, and finance their healthcare needs with transparency and inclusivity. This project was developed by **RAION GO GO** from the Faculty of Computer Science (FILKOM), Universitas Brawijaya, for the TECHNOSCAPE 8.0 Bina Nusantara hackathon. 🏆

## 😟 The Problem We're Solving

Healio.ai aims to address key challenges within Indonesia's healthcare system:

- High Out-of-Pocket (OOP) Healthcare Costs: Despite broad National Health Insurance (JKN) coverage, OOP expenses remain a significant burden, especially for low and middle-income groups.
- Disparities in JKN Effectiveness: The benefits of JKN are not evenly distributed, with rural areas often facing higher healthcare spending.
- Limited & Fragmented Healthcare Information: Difficulty in finding standardized and personalized healthcare facility recommendations.
- Fragmented Health Microfunding: Existing community funding initiatives are often individual-focused and lack coordination.
- Need for Transparency & Trust: Concerns about unclear treatment costs and the management of donated funds.

## ✨ Core Features

Healio.ai offers a comprehensive suite of AI-driven features:

1.  **🤖 AI-Personalized Facility Recommendation:**

    - Recommends suitable health centers (puskesmas), clinics, or hospitals based on user profiles (age, chronic conditions, doctor preferences, budget) and facility data (tariffs, ratings from sources like Google Reviews & JKN Care).
    - Allows filtering by maximum distance and facility type (BPJS, public, private).
    - A cron job (`enrich-facilities.ts`) periodically updates facility data using Gemini AI for discovery and enrichment.

2.  **🤝 Community-Based Microfunding Pool System (Dana Komunal):**

    - A peer-to-peer platform for communities to support each other's medical needs.
    - Users can create funding "pools" with specific claim conditions.
    - AI analyzes member profiles to recommend fair monthly contributions.
    - A real-time dashboard displays funding goals, progress, contributor lists, and a transparent disbursement feed.
    - Integrated with **Midtrans** for secure contribution payments.
    - KTP-based identity verification (KYC) for enhanced security and trust.
    - Features a voting system for approving fund disbursement requests.

3.  **🧾 AI-Assisted Personal Healthcare Expense Tracker:**
    - Utilizes OCR (via Gemini AI) to automatically track and analyze healthcare expenses from uploaded receipts.
    - Displays an expense timeline and spending pattern analysis.
    - Provides personalized recommendations for cost-saving (e.g., generic drug alternatives, budget-friendly consultation packages).

## 🧠 Intelligent Approaches

The platform extensively leverages **Google Gemini AI** through several innovative methods:

- **AI-Assisted Database Query Scripting (AID-QS):** Gemini dynamically generates MongoDB queries for relevant facility recommendations based on user profiles.
- **Search-Grounded Data Enrichment (SGDE):** Gemini enriches facility data in MongoDB by performing web searches for missing or incomplete information.
- **Anti-Prompt Exploitation Mechanism (APEX):** A security layer that injects strict safety policies into Gemini's context to prevent destructive database commands.
- **Graceful Degradation and Fallback (GDF):** The system defaults to rule-based queries if AI processing fails, ensuring service continuity.

## 🛠️ Technology Stack

- **Frontend:** Next.js (React) with TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **AI:** Google Gemini
- **Payment Gateway:** Midtrans
- **Containerization:** Docker (for MongoDB deployment)
- **Deployment:**
  - MongoDB: Dedicated Server (managed via `docker-compose` in CI/CD pipeline)
  - Web App: Vercel
- **Key Libraries:** Axios, Bcryptjs, JWT (Jose & JsonWebToken), Lucide Icons, React Hot Toast, Recharts.

## 🚀 Getting Started (Local Development)

Follow these steps to set up and run the Healio.ai project locally:

**1. Prerequisites:**

- **Node.js:** Make sure you have Node.js installed (preferably LTS version).
- **npm/yarn/pnpm/bun:** A Node.js package manager.
- **Docker & Docker Compose:** Required for running the MongoDB service locally.
- **Git:** For cloning the repository.

**2. Clone the Repository:**

```bash
git clone [https://github.com/elginbrian/Healio.ai.git](https://github.com/elginbrian/Healio.ai.git)
cd Healio.ai
```

**3. Install Dependencies:**
Install the project dependencies using your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

**4. Set Up Environment Variables:**
Create a `.env.local` file in the root of the project and add the following environment variables. Replace the placeholder values with your actual keys and configurations:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/healio_db_dev # Or your MongoDB connection string

# JWT
JWT_SECRET=your_very_strong_jwt_secret_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Midtrans (Sandbox for local development)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX=your_midtrans_client_key_here
MIDTRANS_SERVER_KEY_SANDBOX=your_midtrans_server_key_here

# Next.js API URL (usually for client-side fetching if different from Next.js host)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**5. Run MongoDB using Docker Compose:**
The project includes a `docker-compose.yml` file to easily run a MongoDB instance.
Open a new terminal window in the project root and run:

```bash
docker-compose up -d mongodb
```

**6. Run the Development Server:**
Once the environment variables are set and MongoDB is running, start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 👥 The Team (RAION GO GO)

Meet the developers behind Healio.ai:

- Andreas Bagasgoro
- Elgin Brian Wahyu Bramadhika
- Johan Arizona
- M. Rizqi Aditya Firmansyah

This project is a proud creation of the **RAION COMMUNITY**, Faculty of Computer Science (FILKOM), Universitas Brawijaya.

## 🎨 Figma Prototype

Explore the interactive prototype of Healio.ai to get a feel for the user experience:
[View Prototype on Clips.id](https://clips.id/PrototypeHealioai)

## 🌐 Web Deployment

The Healio.ai web application is deployed and accessible at [https://healio-ai.site](https://healio-ai.site)
