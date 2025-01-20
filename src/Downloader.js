import React, { useState } from "react";
import axios from "axios";

function Downloader() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVideo = async () => {
    if (!videoUrl) {
      setError("Please enter a valid Instagram video URL.");
      return;
    }

    setError("");
    setIsLoading(true);

    const options = {
      method: "POST",
      url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": "YOUR_API_KEY", // Replace with your API key
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
      },
      data: { url: videoUrl },
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.medias) {
        setVideoData(response.data);
      } else {
        setError("No video found. Please check the URL.");
      }
    } catch (err) {
      setError("Error fetching video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-center text-2xl font-bold mb-4">
        Instagram Video Downloader
      </h1>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter Instagram video URL"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={fetchVideo}
        disabled={isLoading}
        className={`w-full p-2 rounded ${
          isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {isLoading ? "Fetching..." : "Download Video"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {videoData && (
        <div className="mt-6">
          <img
            src={videoData.thumbnail || ""}
            alt="Video Thumbnail"
            className="w-full h-40 object-cover rounded mb-4"
          />
          <div className="space-y-4">
            {videoData.medias.map((media, index) => (
              <div key={index} className="p-2 border rounded">
                <h3 className="text-gray-700">{media.quality}</h3>
                <a
                  href={media.url}
                  download
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Downloader;
