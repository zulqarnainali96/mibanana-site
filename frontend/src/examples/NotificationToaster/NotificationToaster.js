import MDSnackbar from 'components/MDSnackbar'
import { useToasterHook } from 'hooks/useToasterHook'
import React from 'react'

export const NotificationToaster = () => {
    const {respMessage, errorSB, successSB, closeSuccessSB, closeErrorSB} = useToasterHook()
    return (
        <React.Fragment>
            <MDSnackbar
                color="error"
                icon="warning"
                title="Error"
                content={respMessage}
                dateTime={new Date().toLocaleTimeString('pk')}
                open={errorSB}
                onClose={closeErrorSB}
                close={closeErrorSB}
                bgWhite
            />
            <MDSnackbar
                color="success"
                icon="check"
                title="SUCCESS"
                content={respMessage}
                dateTime={new Date().toLocaleTimeString('pk')}
                open={successSB}
                onClose={closeSuccessSB}
                close={closeSuccessSB}
                bgWhite
            />
        </React.Fragment>
    )
}

