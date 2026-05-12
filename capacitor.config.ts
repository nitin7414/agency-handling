import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shri_shyam_gas_agency",
  appName: "Shri Shyam Gas Agency",
  webDir: "out",
  server: {
    // Replace with your Vercel URL once deployed
    // Example: "https://shri-shyam-gas.vercel.app"
    url: "https://your-agency-name.vercel.app", 
    androidScheme: "https",
    allowNavigation: ["*.vercel.app"]
  },
  backgroundColor: "#ffffff"
};

export default config;
