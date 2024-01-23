import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import React from 'react'

const ImageViewModal = ({open, previewimg, onClose }) => {
  return (
    <Dialog open={open} sx={viewStyles}>
      <IconButton sx={closeButton} onClick={onClose}>
        <Close sx={{fill:'#fff'}} fontSize='medium' />
      </IconButton>
      <img src={previewimg} loading='lazy' style={imagestyle} />
    </Dialog>
  )
}

const viewStyles = {
  "& .MuiDialog-container" : {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position : 'relative',
  },
  "& .MuiDialog-paper": {
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent !important',
    margin : 0,
    borderRadius : 0,
  }
}
const closeButton = {
  position : 'absolute',
  top : 1,
  right : 20,
}
const imagestyle = {
  width : '100%',
  objectFit : 'contain',
  aspectRatio : '3',
}

export default ImageViewModal


{/* <ReactSimpleImageViewer
  src={[previewimg]}
  disableScroll={false}
  closeOnClickOutside={true}
  onClose={onClose}
  style={{ width: "100%", height: "100px" }}
/> */}