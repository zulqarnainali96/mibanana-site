import { Button } from "@mui/material"
import Notepencil from 'assets/mi-banana-icons/NotePencil.png'
import CreateProject1 from "../Form-modal/new"
import { memo, useState } from "react"

const CreateProjectButton = ({ handleClickOpen, formValue, setFormValue, handleChange, open, setRespMessage, openSuccessSB, openErrorSB, handleClose }) => {

    function onSumbit() {
    }
    
    return (
        <>
            <CreateProject1
                formValue={formValue}
                setFormValue={setFormValue}
                open={open}
                onSumbit={onSumbit}
                handleClose={handleClose}
                handleChange={handleChange}
                openSuccessSB={openSuccessSB}
                openErrorSB={openErrorSB}
                setRespMessage={setRespMessage}
            />
            <Button
                variant="contained"
                disableFocusRipple
                onClick={handleClickOpen}
                sx={{
                    backgroundColor: "#adff2f",
                    borderRadius: 30,
                    "&:hover": { background: "#98e225" }, "&:focus ": { background: "#adff2f " + "!important" }
                }}
                disableElevation
            >
                <img src={Notepencil} alt="create project" width={24} height={22} />
                &nbsp;{" "}Create Project
            </Button>
        </>
    )
}
export default memo(CreateProjectButton)