import ArrowForward from "@mui/icons-material/ArrowForward"
import MDButton from "components/MDButton"
import MoonLoader from "react-spinners/MoonLoader"

export const MIBananaButton = ({
    loading,
    onClick,
    width,
    type,
    text
}) => {
    return (
        <MDButton
            width={width}
            type={type}
            color="warning"
            onClick={onClick && onClick}
            endIcon={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ArrowForward fontSize='large' />&nbsp;
                <MoonLoader loading={loading} size={18} color='#121212' />
            </div>}
            disabled={loading}
            circular={true}
            sx={{
                color: '#000 !important',
                fontSize: 14,
                textTransform: "capitalize",
            }}
        >
            {text} &nbsp;
        </MDButton>
    )
}
