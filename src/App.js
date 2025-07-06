// src/App.jsx
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCA6JytaDY5OXB33cPNt289dbcM7-_Gsi4",
  authDomain: "booking-308aa.firebaseapp.com",
  projectId: "booking-308aa",
  storageBucket: "booking-308aa.firebasestorage.app",
  messagingSenderId: "283696104033",
  appId: "1:283696104033:web:c75d8708aab12f0ae5e020",
  measurementId: "G-V4CXLQQT6K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [status, setStatus] = useState("Checking login...");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          const result = await signInWithPopup(auth, provider);
          const email = result.user.email;

          if (!email.endsWith("@greycourt.org.uk")) {
            setStatus("Access denied: You must use a greycourt.org.uk account.");
            return;
          }

          checkBan(email);
        } catch (err) {
          console.error(err);
          setStatus("Login failed.");
        }
      } else {
        const email = user.email;
        if (!email.endsWith("@greycourt.org.uk")) {
          setStatus("Access denied: You must use a greycourt.org.uk account.");
          return;
        }

        checkBan(email);
      }
    });
  }, []);

  const checkBan = async (email) => {
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycby-SjLK7_OEQrx5hlGWN706lh1ZV5roIgqKt3Nv1P7G6GMOn1DDApHSPR6QAiwKxrlP/exec?email=${encodeURIComponent(email)}`
      );
      const text = await response.text();

      if (text === "BANNED") {
        setStatus("Access Denied: You are banned.");
      } else {
        window.location.href = "https://sites.google.com/view/bookingrooms/booking";
      }
    } catch (err) {
      console.error(err);
      setStatus("Error checking ban status.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-xl">
      {status}
    </div>
  );
}
