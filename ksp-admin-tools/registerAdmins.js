// registerAdmins.js
const admin = require("firebase-admin");
const fs = require("fs");

// 🔐 Load service account credentials
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const auth = admin.auth();

// 📖 Load and validate registry
let registry;
try {
  registry = JSON.parse(fs.readFileSync("adminRegistry.json", "utf8"));
  if (!registry.admins || !Array.isArray(registry.admins)) {
    console.error("❌ Invalid registry format. Expected 'admins' array.");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Failed to read adminRegistry.json:", err.message);
  process.exit(1);
}

// 🚀 Register admins sequentially
(async () => {
  for (const adminData of registry.admins) {
    try {
      // 🛡️ Check if user already exists
      const existingUser = await auth.getUserByEmail(adminData.email).catch(() => null);
      if (existingUser) {
        console.log(`⚠️ Admin already exists: ${adminData.email}`);
        continue;
      }

      // 👤 Create Firebase Auth user
      const user = await auth.createUser({
        email: adminData.email,
        password: adminData.defaultPassword,
      });

      // 🗂️ Assign role in Firestore
      await db.collection("users").doc(user.uid).set({
        email: adminData.email,
        role: "admin",
        name: adminData.name || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        addedBy: adminData.addedBy || "System",
      });

      console.log(`[${new Date().toISOString()}] ✅ Registered admin: ${adminData.email}`);
    } catch (error) {
      console.error(`❌ Failed to register ${adminData.email}:`, error.message);
    }
  }
})();