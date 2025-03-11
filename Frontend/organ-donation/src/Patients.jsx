import { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function Patients() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5; // Smooth Speed
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {/* 🎥 Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bgVid3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🚀 Soft Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>

      {/* ⚡ Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        
        {/* 🏥 Title */}
        <h1 className="text-white text-5xl sm:text-6xl font-extrabold drop-shadow-[0_0_20px_rgba(255,100,100,0.9)] animate-pulse">
          🏥 Patient Portal
        </h1>

        {/* 🔹 Subtitle */}
        <h2 className="text-[#FF6464] text-2xl sm:text-3xl font-semibold mt-3 drop-shadow-[0_0_15px_rgba(255,100,100,0.7)]">
          Secure and Reliable Organ Matching System.
        </h2>

        {/* 📜 Description */}
        <p className="mt-6 text-white text-lg sm:text-xl max-w-3xl leading-relaxed bg-black/30 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md">
          Welcome to the <span className="text-[#FF6464] font-semibold">Patient Portal</span>. Here, you can search for organ donors, 
          track your application, and ensure a safe transplant process with our blockchain-backed system.
        </p>

        {/* ⚡ Action Buttons */}
        <div className="mt-8 flex flex-col space-y-4">
          <Link to="/add-patient">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              ➕ Add Patient
            </button>
          </Link>

          <Link to="/view-patients">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              📋 View Patients
            </button>
          </Link>

          <Link to="/next-patient">
            <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-red-400 to-red-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              ⏩ Next Patient
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Patients;
