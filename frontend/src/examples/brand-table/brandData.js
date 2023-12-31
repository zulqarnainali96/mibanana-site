import apiClient from "api/apiClient"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import nikeLogo from '../../assets/mi-banana-icons/nike.webp'
import MDTypography from "components/MDTypography"
import { IconButton, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MDBox from "components/MDBox"
import { getBrandData } from "redux/global/global-functions"
import { getCustomerBrand } from "redux/actions/actions"
import { getNew_Brand } from 'redux/actions/actions'
import { useDispatch } from "react-redux"
import MDSnackbar from "components/MDSnackbar"
import { openEditBrandModal } from "redux/actions/actions"
import { getCurrentBrandID } from "redux/actions/actions"
import fileImage from 'assets/mi-banana-icons/file-image.png'
import { MoonLoader } from "react-spinners"
import "../../examples/new-table/table-style.css"
import { fontsFamily } from "assets/font-family"
import { mibananaColor } from "assets/new-images/colors"
import { ArrowDownward } from "@mui/icons-material"

export const Action = ({ item }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const dispatch = useDispatch()
    const id = useSelector(state => state.userDetails.id)
    const iseditBrand = useSelector(state => state.iseditBrand)
    const [errorSB, setErrorSB] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const [respMessage, setRespMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const func = (value) => dispatch(getCustomerBrand(value))
    async function deleteBrandList() {
        setLoading(true)
        console.log(item)
        if (!item._id) {
            setRespMessage('ID not provided')
            setLoading(false)
            setTimeout(() => {
                openErrorSB()
            }, 1000)
            return
        }
        await apiClient.delete('/api/brand/' + item._id)
            .then(({ data }) => {
                if (data.message) setRespMessage(data.message)
                setLoading(false)
                setTimeout(() => {
                    getBrandData(id, func)
                    openSuccessSB()
                }, 1200)
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data
                    setRespMessage(message)
                    setLoading(false)
                    setTimeout(() => {
                        openErrorSB()
                    }, 1200)
                    return
                }
                setLoading(false)
                setRespMessage(err.message)
                setTimeout(() => {
                    openErrorSB()
                }, 1200)
            })

    }
    const openBrandModal = () => {
        dispatch(getCurrentBrandID(item._id))
        dispatch(openEditBrandModal(true))
    }

    const renderErrorSB = (
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
    );

    const renderSuccessSB = (
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
    );

    const bbDetails = {
        brand_name: 'Nike',
        brand_description: 'Nike',
        logo: 'logo',
        web_url: 'site url',
        facebook_url: 'facebook url',
        instagram_url: 'instagram url',
        twitter_url: 'twitter url',
        linkedin_url: 'linkedin',
        tiktok_url: 'tiktok url'
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    return (
        <MDBox>
            <MDBox onClick={handleMenuOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="active-svg" width="27" height="27" fill="none"><path stroke="inherit" stroke-linecap="round" stroke-linejoin="round" d="M21 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10ZM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                </svg>
                {/* <MoreVertIcon onClick={handleMenuOpen} sx={{ height: "2em", fontSize: '27px !important', fill: anchorEl ? "white" : "black" }} /> */}
            </MDBox>
            <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <MenuItem onClick={openBrandModal}>
                    Edit
                </MenuItem>
                <MenuItem sx={containerStyles} onClick={deleteBrandList}>
                    <h6 style={{ fontWeight: '300', color: 'inherit' }}>Delete</h6>
                    <IconButton>
                        <MoonLoader size={20} loading={loading} />
                    </IconButton>
                </MenuItem>
            </Menu>
            {renderSuccessSB}
            {renderErrorSB}
        </MDBox >
    )
}

const ShowFiles = ({ item }) => {
    const [showfiles, setShowFiles] = useState(false)
    return (
        <MDBox>
            <ArrowDownward
                onClick={() => setShowFiles(prev => !prev)}
                sx={{
                    fill: mibananaColor.yellowColor,
                    width: '2.6em', height: '3.6em '
                }} />
            {showfiles && <MDTypography display="flex" flexDirection="column" variant="p" fontSize="small">
                {item.files?.map(file => <MDTypography sx={{ color: '#000', fontWeight: 'bold' }} key={file.id} variant="p" fontSize="small">{file.name}</MDTypography>)}
            </MDTypography>}
        </MDBox>
    )
}

const BrandData = () => {
    const userID = useSelector(state => state.userDetails.id)
    const new_brand = useSelector(state => state.new_brand)
    const customerBrand = useSelector(state => state.customerBrand)
    const dispatch = useDispatch()
    const func = (value) => dispatch(getCustomerBrand(value))

    useEffect(() => {
        getBrandData(userID, func)
    }, [new_brand])

    const textStyles = {
        fontFamily: fontsFamily.poppins,
        fontWeight: '400 !important',
        color: mibananaColor.yellowTextColor
    }
    const rows = customerBrand?.map((item) => {
        const arr = { url: '' }
        function getBrandLogo() {
            if (item.files?.length > 0) {
                const result = item.files?.find(list => list.type?.startsWith('image/'))
                arr.url = result ? result?.url : fileImage
            }
        }
        getBrandLogo()
        return {
            logo: <>{arr.url ? <img src={arr.url} width={50} height={50} /> : null}</>,

            brand_name: <MDTypography variant="h4" sx={textStyles}>
                {item.brand_name}
            </MDTypography>,

            brand_description: <MDTypography variant="p" sx={{ ...textStyles, fontSize: '14px !important' }}>
                {item.brand_description}
            </MDTypography>,

            // files: <MDTypography display="flex" flexDirection="column" variant="p" fontSize="small">
            //     {item.files?.map(file => <MDTypography sx={{ color: '#000', fontWeight: 'bold' }} key={file.id} variant="p" fontSize="small">{file.name}</MDTypography>)}
            // </MDTypography>,
            files: <ShowFiles item={item} />,
            action: <MDTypography component="span" href="#" variant="caption" color="text" fontWeight="medium">
                <Action item={item} />
            </MDTypography>
        }
    })
    // const rows = [
    //     {
    //         logo: 'Logo', brand_name: 'Nike', brand_description: 'brand_description', files: 'files',
    //         action: <MDTypography component="span" href="#" variant="caption" color="text" fontWeight="medium">
    //             <Action />
    //         </MDTypography>
    //     }
    // ]
    return {
        rows: customerBrand?.length > 0 ? rows : [],
        columns: [
            { Header: "Logo", accessor: 'logo', align: 'left' },
            { Header: "Company Name", accessor: 'brand_name', },
            { Header: "Company Description", accessor: 'brand_description', align: 'center' },
            { Header: "Files", accessor: 'files', align: 'center' },
            { Header: "Action", accessor: 'action', align: 'center' },
        ]
    }
}
export default BrandData


const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between'
}