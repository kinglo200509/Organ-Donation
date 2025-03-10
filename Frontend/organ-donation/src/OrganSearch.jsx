import { useEffect, useRef } from "react";
import "./OrganSearch.css"; // Import styles

function OrganSearch() {
  const videoRef = useRef(null);

  return (
    <div className="organ-search-container">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/bgVid2.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Content on top of the video */}
      <div className="form-overlay">
        <h1 className="title">Find a Matching Organ</h1>
        <form className="organ-search-form">
          {/* Organ Name */}
          <div className="input-group">
            <label>Organ Name</label>
            <input type="text" placeholder="Enter organ name" required />
          </div>

          {/* HLA */}
          <div className="input-group">
            <label>HLA</label>
            <input type="text" placeholder="Enter HLA type" required />
          </div>

          {/* Blood Group */}
          <div className="input-group">
            <label>Blood Group</label>
            <select required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Age */}
          <div className="input-group">
            <label>Age</label>
            <input type="number" placeholder="Enter age" required />
          </div>

          {/* Submit Button */}
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrganSearch;
