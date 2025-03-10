import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5; // Smooth Speed
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      {/* 🎥 Background Video (VISIBLE & SMOOTH) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/bgVid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🚀 Soft Gradient Overlay (NOT TOO DARK) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/50 to-black/80"></div>

      {/* ⚡ Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        
        {/* 🫀 Glowing Title */}
        <h1 className="text-white text-5xl sm:text-6xl font-extrabold drop-shadow-[0_0_20px_rgba(0,200,255,0.9)] animate-pulse">
          🫀 OrganConnect
        </h1>

        {/* 🔹 Subtitle */}
        <h2 className="text-[#00C8FF] text-2xl sm:text-3xl font-semibold mt-3 drop-shadow-[0_0_15px_rgba(0,200,255,0.7)]">
          A Blockchain based organ transplant and donor matching system.
        </h2>

        {/* 📜 Description */}
        <p className="mt-6 text-white text-lg sm:text-xl max-w-3xl leading-relaxed bg-black/30 px-6 py-4 rounded-lg shadow-lg backdrop-blur-md">
          Welcome to <span className="text-[#00C8FF] font-semibold">OrganConnect</span>, a secure and transparent system needed to ensure fair donor- 
          recipient matching, eliminating fraud, and improving the allocation process. <span className="text-[#00C8FF] font-semibold">Fast and reliable organ-matching system</span>.
        </p>

        {/* ⚡ CTA Buttons */}
        <div className="mt-8 flex gap-6">
          <button className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#0077FF] to-[#00C8FF] rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            💖 Register as a Donor
          </button>
          <button
           onClick={() => navigate("/organ-search")}
           className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-[#FF0077] to-[#FF00C8] rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
          🔍 Find a Match
    </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
