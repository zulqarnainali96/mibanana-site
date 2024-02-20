import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import MDBox from 'components/MDBox'
import "./image-modal.css"
import React, { useState, useRef } from 'react'
import { styled } from '@mui/styles'

const ImageViewModal = ({ open, onClose, allImages, currentImage }) => {
  const [currentIndex, setCurrentIndex] = useState(currentImage);
  const modalRef = useRef();

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    // swiper.slideNext()
  };
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '&. MuiDialog-paper': {
      backgroundColor: 'transparent'
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <BootstrapDialog open={open}>
      <IconButton className="close-btn" onClick={onClose}>
        <Close className="icon-btn-color" fontSize='medium' />
      </IconButton>
      <BootstrapDialog className="image-slider" open={open} onClose={onClose} >
        <MDBox className="handle-container">
          <IconButton className="icon-btn" title='prev' onClick={goToPrevSlide} >
            <ArrowBackIos className="icon-btn-color" fontSize='large' />
          </IconButton>
          <IconButton className="icon-btn" title='next' onClick={goToNextSlide} >
            <ArrowForwardIos className="icon-btn-color" fontSize='large' />
          </IconButton>
        </MDBox>
        <DialogContent>
          <img src={allImages[currentIndex]?.image} alt={`Slide ${currentIndex + 1}`} loading="lazy" />
        </DialogContent>
      </BootstrapDialog>
    </BootstrapDialog>
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


import { ArrowBackIos, ArrowForwardIos, Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import MDBox from 'components/MDBox'
import "./image-modal.css"
import React, { useState, useRef } from 'react'

const ImageViewModal = ({ open, onClose, allImages, currentImage }) => {
  const [currentIndex, setCurrentIndex] = useState(currentImage);
  const modalRef = useRef();

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    // swiper.slideNext()
  };
  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const handleClose = (event) => {
    console.log(event,' happen')
    // Check if the click occurred inside the image container
    if (!event.target.closest('.image-setting')) {
      onClose();
      console.log(event,' close')
    }
  };

  return (
    <Dialog open={open} sx={viewStyles} onClose={handleClose}>
      <IconButton className="close-btn" onClick={onClose}>
        <Close className="icon-btn-color" fontSize='medium' />
      </IconButton>
      <MDBox className="handle-container">
        <IconButton className="icon-btn" title='prev' onClick={goToPrevSlide} >
          <ArrowBackIos className="icon-btn-color" fontSize='large' />
        </IconButton>
        <IconButton className="icon-btn" title='next' onClick={goToNextSlide} >
          <ArrowForwardIos className="icon-btn-color" fontSize='large' />
        </IconButton>
      </MDBox>
      <div className="image-slider" >
        <img src={allImages[currentIndex]?.image} className='image-setting' alt={`Slide ${currentIndex + 1}`} loading="lazy" />
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