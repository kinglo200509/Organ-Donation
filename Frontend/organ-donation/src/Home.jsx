function Home() {
  return (
    <div className="relative w-screen h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/bgVid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional for readability) */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-white text-4xl font-bold">Welcome to the Home Page</h1>
      </div>
    </div>
  );
}

export default Home;
