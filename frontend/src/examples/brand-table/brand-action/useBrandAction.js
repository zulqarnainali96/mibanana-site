import apiClient from "api/apiClient";
import { useState } from "react";
import { useDispatch } from "react-redux"
import { getCustomerBrand } from "redux/actions/actions";
import { getBrandData } from "redux/global/global-functions";
import { currentUserRole } from "redux/global/global-functions";
import { handleRole } from "redux/global/global-functions";


export const useBrandAction = (
    item,
    setFormValue,
    openEditBrandModal,
    openSuccessSB,
    openErrorSB,
    setRespMessage,
    reduxState,
    reduxActions
) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const id = reduxState.userDetails?.id;
    const [loading, setLoading] = useState(false);
    const role = handleRole(currentUserRole(reduxState));
    const userId = reduxState.userDetails?.id;
    

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const func = (value) => dispatch(getCustomerBrand(value));

    async function deleteBrandList() {
        setLoading(true);
        if (!item._id) {
            setRespMessage("ID not provided");
            setLoading(false);
            setTimeout(() => {
                openErrorSB();
            }, 1000);
            return;
        }
        await apiClient.delete("/api/brand/" + item._id)
            .then(({ data }) => {
                if (data.message) setRespMessage(data.message);
                setLoading(false);
                setTimeout(() => {
                    getBrandData(id, func);
                    openSuccessSB();
                }, 1200);
            })
            .catch((err) => {
                if (err.response) {
                    const { message } = err.response.data;
                    setRespMessage(message);
                    setLoading(false);
                    setTimeout(() => {
                        openErrorSB();
                    }, 1200);
                    return;
                }
                setLoading(false);
                setRespMessage(err.message);
                setTimeout(() => {
                    openErrorSB();
                }, 1200);
            });
    }
    const openBrandModal = () => {
        reduxActions.getNew_Brand(!reduxState.new_brand)
        const filterBrand = reduxState.customerBrand?.find((brand) => brand._id === item._id);
        if (filterBrand) {
            setFormValue({ ...filterBrand });
            openEditBrandModal()
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return {
        deleteBrandList,
        openBrandModal,
        handleMenuOpen,
        handleMenuClose,
        anchorEl,
        loading,
        userId,
        role,
    }

}

