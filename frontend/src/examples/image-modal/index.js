import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import "./modal-style.css"

const ImageModalView = ({ allImages, currentImage, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(currentImage); 

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    // swiper.slideNext()
  };
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };


  return (
    <Lightbox
      mainSrc={allImages[currentIndex].image}
      nextSrc={allImages[(currentIndex + 1) % allImages.length].image}
      prevSrc={allImages[(currentIndex + allImages.length - 1) % allImages.length].image}
      imageTitle={allImages[currentIndex].name}
      reactModalStyle={{ overlay: { zIndex: 10000 } }}
      onMovePrevRequest={() => {
        goToPrevSlide();
      }}
      onMoveNextRequest={() => {
        goToNextSlide();
      }}
      onCloseRequest={onClose}
      // onImageLoadError={onClose}
      imageLoadErrorMessage={()=> <h1>Failed to load Image</h1>}
      animationDisabled={true}
      toolbarButtons={[]}
      zoomOutLabel="zoom out"
      closeLabel="close"
      backLabel="back"
      nextLabel="next"
      downloadLabel="download "
      zoomInLabel="zoom in"
    />
  )
}

export default ImageModalView;