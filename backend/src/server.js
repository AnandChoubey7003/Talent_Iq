import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();
const __dirname = path.resolve();
const frontendDistPath = path.join(__dirname, "../frontend/dist");

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL && ENV.CLIENT_URL !== "http://localhost:5173"
      ? [ENV.CLIENT_URL, "http://localhost:5173"]
      : true,
    credentials: true,
  })
);
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

if (ENV.NODE_ENV === "production" || fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });

  app.get("/{*any}", (req, res) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: "API route not found" });
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "TalentIQ API is running. Start the frontend with npm run dev --prefix frontend or build it first.",
      health: "/health",
    });
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
