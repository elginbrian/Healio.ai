import cron from "node-cron";
import connectToDatabase from "../lib/db";
import Facility from "../models/facility";
import { findAndStructureNewFacilities, enrichFacilityDataWithGemini } from "@/lib/gemini";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

cron.schedule("0 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Running hourly database update job...`);

  try {
    await connectToDatabase();
    console.log("Database connected for cron job.");

    console.log('[PHASE 1] Starting discovery of new facilities in "Malang"...');
    const newStructuredFacilities = await findAndStructureNewFacilities("Malang");

    if (newStructuredFacilities.length > 0) {
      const discoveryPromises = newStructuredFacilities.map(async (facilityData) => {
        if (!facilityData.name || !facilityData.address) {
          return { status: "skipped", name: "Unnamed Facility", reason: "Missing name or address from Gemini" };
        }

        const existingFacility = await Facility.findOne({ name: facilityData.name });

        if (existingFacility) {
          return { status: "skipped", name: facilityData.name };
        } else {
          await Facility.create(facilityData);
          return { status: "created", name: facilityData.name };
        }
      });

      const results = await Promise.allSettled(discoveryPromises);

      let createdCount = 0;
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.status === "created") {
          createdCount++;
          console.log(`New facility added with full data: ${result.value.name}`);
        } else if (result.status === "rejected") {
          console.error("A discovery promise failed:", result.reason);
        }
      });
      console.log(`[PHASE 1] Discovery finished. Processed ${results.length} potential facilities. Added ${createdCount} new facilities.`);
    } else {
      console.log("[PHASE 1] No new facilities discovered in this run.");
    }

    console.log("[PHASE 2] Starting maintenance check for old data...");
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldFacilities = await Facility.find({ updatedAt: { $lt: thirtyDaysAgo } }).limit(5);

    if (oldFacilities.length > 0) {
      console.log(`[PHASE 2] Found ${oldFacilities.length} old facilities to refresh.`);
      const maintenancePromises = oldFacilities.map(async (facility) => {
        await sleep(1000);
        const enrichedData = await enrichFacilityDataWithGemini(facility);

        if (enrichedData && Object.keys(enrichedData).length > 0) {
          await Facility.updateOne({ _id: facility._id }, { $set: enrichedData });
          return { status: "updated", name: facility.name };
        }
        return { status: "no_change", name: facility.name };
      });

      const maintenanceResults = await Promise.allSettled(maintenancePromises);
      let updatedCount = 0;
      maintenanceResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value.status === "updated") {
          updatedCount++;
          console.log(`Refreshed data for: ${result.value.name}`);
        } else if (result.status === "rejected") {
          console.error("A maintenance promise failed:", result.reason);
        }
      });
      console.log(`[PHASE 2] Maintenance finished. Refreshed ${updatedCount} facilities.`);
    } else {
      console.log("[PHASE 2] All facility data is up to date.");
    }

    console.log("Database update job finished successfully.");
  } catch (error) {
    console.error("A critical error occurred during the cron job:", error);
  }
});
