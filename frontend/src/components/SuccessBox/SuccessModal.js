import Modal from 'examples/ModalLayout'
import MDTypography from 'components/MDTypography'

const SuccessModal = ({ width, msg, onClose, open }) => {

    return (
        <Modal
            open={open}
            width={width}
            onClose={onClose}
            isBorder={false}
            title="SUCCESS"
            color="#288e28 !important"
        >
            <MDTypography fontSize="30px" fontWeight="medium" textAlign="center" sx={{ color: "#5cdd5c !important" }}>{msg}</MDTypography>
        </Modal>
    )
}
export default SuccessModal