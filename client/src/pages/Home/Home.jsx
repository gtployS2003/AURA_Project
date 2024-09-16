import React, { useState } from "react";
import "./Home.scss";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import StartStyling from "../../components/StartStyling/StartStyling";


const Home = ({ response, setResponse, style, setStyle }) => {
  const [images, setImages] = useState([]);

  return (
    <div className="home">
      <h1 className="home__heading">Ask the AI stylist</h1>


      {/* Section for image uploading */}
      <section className="home__image-uploader">
        <ImageUploader images={images} setImages={setImages} />
      </section>
      
      {/* Section for starting styling */}
      <section className="home__start-styling">
        <StartStyling
          style={style}
          setStyle={setStyle}
          images={images}
          response={response}
          setResponse={setResponse}
  
        />
      </section>
    </div>
  );
};

export default Home;
