import Modal from 'examples/ModalLayout'
import MDTypography from 'components/MDTypography'
import { fontsFamily } from 'assets/font-family'

const SuccessModal = ({ children, width, msg, onClose, open, sideRadius, color, title, bgColor }) => {

    return (
        <Modal
            open={open}
            width={width}
            onClose={onClose}
            sideRadius={sideRadius}
            isBorder={false}
            // title={title && title}
            color={`${color} !important`}
        // bgColor={bgColor}
        >
            {children ? children : (
                <MDTypography
                    fontSize="30px"
                    fontWeight="medium"
                    textAlign="center"
                    sx={{ color: `${color} !important`, fontFamily: fontsFamily.poppins, fontWeight: 'bold !important' }}>
                    {msg}
                </MDTypography>)}
        </Modal>
    )
}
export default SuccessModal