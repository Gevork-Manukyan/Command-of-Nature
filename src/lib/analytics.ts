// lib/analytics.ts
import { getAnalytics, logEvent } from "firebase/analytics";
import { app } from './firebase';

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Example: Log an event
export const logGameEvent = (eventName: string, eventParams: { [key: string]: any }) => {
  logEvent(analytics, eventName, eventParams);
};
