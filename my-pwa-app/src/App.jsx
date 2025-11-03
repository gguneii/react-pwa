import { CiMenuBurger } from "react-icons/ci";
import "./index.css";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

function App() {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          console.log("Service Worker Registered: ", registration);
        })
        .catch((error) => {
          console.log("Service Worker Registration Failed: ", error);
        });
    }
  }, []);
  // State to manage modal visibility and posts
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [posts, setPosts] = useState([]);

  const webcamRef = useRef(null);

  // Function to capture the image from the webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Save the captured image in state
  };

  // Function to handle the button click to open the modal
  const handleUploadClick = () => {
    setShowModal(true); // Show the modal to capture an image
  };

  // Function to handle post submission
  const handlePostSubmit = () => {
    if (capturedImage && postTitle) {
      setPosts([
        ...posts,
        {
          image: capturedImage,
          title: postTitle,
        },
      ]);
      setShowModal(false); // Close the modal after post creation
      setCapturedImage(null); // Reset the image
      setPostTitle(""); // Reset the title
    }
  };

  return (
    <>
      <nav>
        <a className="nav-logo" href="/">
          Postgram
        </a>
        <CiMenuBurger className="nav-menu" />
      </nav>

      <main>
        <h1>Share your moments</h1>

        {/* Displaying posts as cards */}
        {posts.length > 0 && (
          <div className="posts">
            {posts.map((post, index) => (
              <div key={index} className="post-card">
                <img src={post.image} alt="Post" className="post-image" />
                <p>{post.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Button to trigger modal */}
        <button onClick={handleUploadClick} className="upload-btn">
          Add Post
        </button>
      </main>

      {/* Modal for capturing image and adding title */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Take a Picture and Add a Title</h2>

            <div className="webcam-container">
              {!capturedImage ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={{
                    facingMode: "environment", // Use rear camera
                  }}
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              )}
            </div>

            {!capturedImage && (
              <button onClick={captureImage} className="capture-btn">
                Capture
              </button>
            )}

            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter title for your post"
              className="title-input"
            />
            <div className="modal-actions">
              <button onClick={handlePostSubmit} className="ok-btn">
                OK
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
