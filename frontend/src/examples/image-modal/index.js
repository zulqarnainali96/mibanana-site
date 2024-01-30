import { ArrowBack, ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material'
import { IconButton, useMediaQuery } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import MDBox from 'components/MDBox'
import "./image-modal.css"
import React, { useEffect, useState } from 'react'

const ImageViewModal = ({ open, previewimg, onClose, allImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };
  useEffect( () => {
  }, [currentIndex])
  
  useEffect( () => {
    setCurrentIndex(previewimg)
  }, [])


  return (
    <Dialog open={open} sx={viewStyles}>
      <IconButton className="close-btn" onClick={onClose}>
        <Close className="icon-btn-color" fontSize='medium' />
      </IconButton>
      <MDBox className="handle-container">
        <IconButton className="icon-btn" title='prev' onClick={goToPrevSlide} disabled={currentIndex === 0} >
          <ArrowBackIos className="icon-btn-color" fontSize='large' />
        </IconButton>
        <IconButton className="icon-btn" title='next' onClick={goToNextSlide} disabled={currentIndex === allImages?.length - 1}>
          <ArrowForwardIos className="icon-btn-color" fontSize='large' />
        </IconButton> 
      </MDBox>
      <div className="image-slider">
        <img src={allImages[currentIndex].image} alt={`Slide ${currentIndex + 1}`} loading="eager"  />
      </div>
    </Dialog>
  )
}

const viewStyles = {
  "& .MuiDialog-container": {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
  },
  "& .MuiDialog-paper": {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent !important',
    margin: 0,
    borderRadius: 0,
  }
}



export default ImageViewModal


{/* <ReactSimpleImageViewer
  src={[previewimg]}
  disableScroll={false}
  closeOnClickOutside={true}
  onClose={onClose}
  style={{ width: "100%", height: "100px" }}
/> */}

// const openImageViewer = useCallback((img) => {
//   // console.log("image", img, pdffile);
//   const fileExtension = img.split(".").pop();
//   // console.log("File extension:", fileExtension);
//   if (fileExtension === "pdf") {
//     setpreviewimg(pdffile);
//     setIsViewerOpen(true);
//   } else if (fileExtension === "ai") {
//     setpreviewimg(img);
//     setIsViewerOpen(true);
//   } else if (fileExtension === "xlsx" || fileExtension === "xls") {
//     setpreviewimg(xls);
//     setIsViewerOpen(true);
//   } else if (fileExtension === "eps") {
//     setpreviewimg(eps);
//     setIsViewerOpen(true);
//   } else if (fileExtension === "psd") {
//     setpreviewimg(psdfile);
//     setIsViewerOpen(true);
//   } else {
//     setpreviewimg(img);
//     setIsViewerOpen(true);
//   }
// }, []);