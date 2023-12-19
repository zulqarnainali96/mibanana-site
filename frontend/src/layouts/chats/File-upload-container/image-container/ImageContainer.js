import MDBox from 'components/MDBox'
import React, { useEffect } from 'react'
import { Jpg, Jpeg, Svg, Png, PDF, PsdFile, Ailogo, Zip } from 'redux/global/file-formats'
import AiImage from 'assets/mi-banana-icons/ai-logo.png'
import fileImage from 'assets/mi-banana-icons/file-image.png'
import zipIcon from 'assets/mi-banana-icons/zip-icon.png'
import { PictureAsPdf } from '@mui/icons-material'

const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const ImageBox = ({ item }) => {
    if (item?.type?.startsWith(Jpg) || item?.type?.startsWith(Jpeg) || item?.type?.startsWith(Png) || item?.type?.startsWith(Svg)) {
        return <img src={item.url} width={'95%'} loading='lazy' alt={item.name} onClick={() => { }} />
    } else if (item?.type?.startsWith(PDF)) {
        return <PictureAsPdf sx={{ fontSize: '10rem !important' }} />
    } else if (item?.type?.startsWith(Ailogo)) {
        return <img src={AiImage} loading='lazy' width={'95%'} alt={item.name} />
    } else if (item?.type?.startsWith(PsdFile)) {
        return <img src={fileImage} loading='lazy' width={'95%'} alt={item.name} />
    } else if (item?.type?.startsWith(Zip)) {
        return <img src={zipIcon} loading='lazy' width="95%" alt={item.name} />
    }
}

const ImageContainer = ({ item, renderComponent }) => {
    useEffect( () => {
        console.log('Render Component')
        console.log(item)

    }, [renderComponent])

    return (
        <MDBox sx={containerStyles} p={2}>
            <ImageBox item={item} />
        </MDBox>
    )
}

export default ImageContainer
