self.addEventListener("install", (event) => {
  console.log("Ascend AI Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Ascend AI Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
  // Pass through all fetch requests, relying on browser caching or Next.js cache.
  // This satisfies the PWA installability requirement.
});
