import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shri_shyam_gas_agency",
  appName: "Shri Shyam Gas Agency",
  webDir: "out",
  server: {
    url: "https://agency-handling.vercel.app/", 
    androidScheme: "https",
    allowNavigation: ["*.vercel.app"]
  },
  backgroundColor: "#ffffff"
};

export default config;
