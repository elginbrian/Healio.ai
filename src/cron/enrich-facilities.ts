import cron from "node-cron";
import connectToDatabase from "../lib/db";
import Facility from "../models/facility";
import { findAndStructureNewFacilities } from "@/lib/gemini";

console.log("Database updater cron job started. Waiting for schedule...");

cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running hourly database update job...`);

  try {
    await connectToDatabase();
    console.log("Database connected for cron job.");

    console.log('[PHASE 1] Starting discovery of new facilities in "Malang"...');

    const newStructuredFacilities = await findAndStructureNewFacilities("Malang");

    let newFacilitiesAdded = 0;
    for (const facilityData of newStructuredFacilities) {
      if (!facilityData.name || !facilityData.address) {
        console.warn("Skipping facility from Gemini due to missing name/address.");
        continue;
      }

      const existingFacility = await Facility.findOne({ name: facilityData.name });

      if (!existingFacility) {
        await Facility.create(facilityData);
        newFacilitiesAdded++;
        console.log(`New facility added with full data: ${facilityData.name}`);
      }
    }
    console.log(`[PHASE 1] Discovery finished. Added ${newFacilitiesAdded} new facilities.`);
    console.log("[PHASE 2] Maintenance check for old data is currently paused.");

    console.log("Database update job finished successfully.");
  } catch (error) {
    console.error("An error occurred during the cron job:", error);
  }
});
