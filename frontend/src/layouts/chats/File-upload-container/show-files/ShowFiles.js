import React from 'react'

const ImageBox = ({ item, index, openImage, files }) => {
    const { pdffile, ai_logo, xls, eps, psdfile } = files
    const file_type = item?.type?.split('/').pop()
    let currentImage = ''
    if (file_type === "pdf") {
        currentImage = pdffile
    } else if (file_type === "ai") {
        currentImage = ai_logo
    } else if (file_type === "xlsx" || file_type === "xls") {
        currentImage = xls
    } else if (file_type === "postscript") {
        const checkExt = item?.url?.split(".")?.pop()
        if(checkExt === "eps") {
            currentImage = eps
        }
    } else if (file_type === "psd") {
        currentImage = psdfile
    } else {
        currentImage = item?.url
    }
    return <img className="fileImg1" src={currentImage} onClick={() => openImage(index)} />
}

const ShowFiles = ({ item, index, openImage, files }) => {
    return (
        <ImageBox key={index} item={item} index={index} openImage={openImage} files={files} />
    )
}

export default ShowFiles

