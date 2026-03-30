import HomePage from "../page";

// This file simply "borrows" the main home page 
// and makes it available at /en, /ja, etc.
export default function LocalizedHomePage() {
  return <HomePage />;
}