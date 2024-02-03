import React, { useState } from 'react'

export const useToasterHook = () => {
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const [respMessage, setRespMessage] = useState("")

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    return { respMessage, successSB, errorSB,  closeErrorSB, openErrorSB, closeSuccessSB, openSuccessSB, setRespMessage }
}
