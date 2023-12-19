import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { useNavigate } from "react-router-dom/";

const StatusModal = ({ open, onClose, project_id }) => {
    const navigate = useNavigate()

    const ProceedToChat = () => {
        onClose()
        if(project_id){
            navigate("/chat/"+project_id)
        }
    }
    return (
        <Dialog open={open}>
            <DialogTitle color={"error"} component={"h3"}>Alert</DialogTitle>
            <CloseRounded fontSize="medium" sx={closeStyles} onClick={onClose} />
            <DialogContent>
                <MDTypography variant="h4" fontSize="medium" fontWeight="regular">This project is currently not active. Project manager will review this project, Once it active you can see all team member, for now you can only chat with <b>Project Manager</b></MDTypography>
                <DialogActions>
                    <MDButton color="success" variant="gradient" onClick={ProceedToChat}>Proceed to chat</MDButton>
                </DialogActions>
            </DialogContent>

        </Dialog>
    )
}

const closeStyles = {
    position: "absolute",
    top: 17,
    right: 10,
    cursor: 'pointer',
    "&:hover": {
        backgroundColor: '#333',
        transition: 'fill all .2s ease-out',
        borderRadius: '30px',
        fill: '#fff'
    }
}
export default StatusModal