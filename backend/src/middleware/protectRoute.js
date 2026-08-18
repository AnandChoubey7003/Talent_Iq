import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = async (req, res, next) => {
  try {
    let auth = null;
    try {
      auth = typeof req.auth === "function" ? req.auth() : (req.auth || getAuth(req));
    } catch {
      auth = null;
    }

    const clerkId = auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - please sign in" });
    }

    // find user in db by clerk ID
    let user = await User.findOne({ clerkId });

    if (!user) {
      const claims = auth?.sessionClaims || {};
      user = await User.create({
        clerkId,
        email: claims.email || `${clerkId}@user.com`,
        name: claims.name || claims.first_name || "Developer",
        profileImage: claims.picture || "",
      });

      // Upsert to Stream so chat/video call initialization succeeds
      try {
        await upsertStreamUser({
          id: clerkId,
          name: user.name,
          image: user.profileImage,
        });
      } catch (streamErr) {
        console.warn("Stream upsert warning in protectRoute:", streamErr.message);
      }
    }

    // attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

