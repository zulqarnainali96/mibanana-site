// import fileIcon from 'assets/mi-banana-icons/Photo.png'
import MDBox from 'components/MDBox'
import React, { useEffect } from 'react'
import Cancel from '@mui/icons-material/Cancel'
import AiImage from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import { PictureAsPdf } from '@mui/icons-material'
import { Jpg, Jpeg, Svg, Png, PDF, PsdFile, Ailogo } from 'redux/global/file-formats'
const closeBtnStyle = {
    fill: 'red',
    position: 'absolute',
    right: -6,
    top: -12,
}

const ImageBox = ({ item }) => {
    if (item?.type?.startsWith(Jpg) || item?.type.startsWith(Jpeg) || item?.type.startsWith(Png) || item?.type.startsWith(Svg)) {
        return <img src={item.url} width={'95%'} loading='lazy' alt={item.name} onClick={() => { }} />
    } else if (item?.type.startsWith(PDF)) {
        return <PictureAsPdf sx={{ fontSize: '10rem !important' }} />
    } else if (item?.type?.startsWith(Ailogo)) {
        return <img src={AiImage} loading='lazy' width={'95%'} alt={item.name} />
    } else if (item?.type?.startsWith(PsdFile)) {
        return <img src={fileImage} loading='lazy' width={'95%'} alt={item.name} />
    }
}

const ShowFiles = ({ item, showImageOnContainer, deleteFile, currentImage,  }) => {
    const boxStyles = {
        cursor: 'pointer',
        position: 'relative',
        border: currentImage === item?.name ? '2px solid #98e225' : '',
        padding: currentImage === item?.name ? '3px' : '',
    }

    return (
        <MDBox sx={boxStyles} onClick={() => showImageOnContainer(item)}>
            <Cancel fontSize='medium' sx={closeBtnStyle} onClick={() => deleteFile(item?.name)} />
            <span style={imageNameStyle}>{item.name}</span>
            <ImageBox item={item} />
        </MDBox>
    )
}

export default ShowFiles

const imageNameStyle = {
    fontSize: '12px',
    paddingBottom: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: '80px'
}
