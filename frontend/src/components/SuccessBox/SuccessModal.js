import Modal from 'examples/ModalLayout'
import MDTypography from 'components/MDTypography'
import { fontsFamily } from 'assets/font-family'

const SuccessModal = ({ width, msg, onClose, open, sideRadius, color, title }) => {

    return (
        <Modal
            open={open}
            width={width}
            onClose={onClose}
            sideRadius={sideRadius}
            isBorder={false}
            title={title}
            color={`${color} !important`}
        >
            <MDTypography
                fontSize="30px"
                fontWeight="medium"
                textAlign="center"
                sx={{ color: `${color} !important`, fontFamily: fontsFamily.poppins, fontWeight: 'bold !important' }}>
                {msg}
            </MDTypography>
        </Modal>
    )
}
export default SuccessModal