import apiClient from "api/apiClient";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import MDTypography from "components/MDTypography";
import { IconButton, Menu, MenuItem, useMediaQuery } from "@mui/material";
import MDBox from "components/MDBox";
import { getBrandData } from "redux/global/global-functions";
import { getCustomerBrand } from "redux/actions/actions";
import { useDispatch } from "react-redux";
import MDSnackbar from "components/MDSnackbar";
// import { openEditBrandModal } from "redux/actions/actions";
import fileImage from "assets/mi-banana-icons/file-image.png";
import { MoonLoader } from "react-spinners";
import "../../examples/new-table/table-style.css";
import { fontsFamily } from "assets/font-family";
import { mibananaColor } from "assets/new-images/colors";
import { ArrowDownward } from "@mui/icons-material";
import { currentUserRole } from "redux/global/global-functions";
import { Link } from "react-router-dom";

export const Action = ({ item, setFormValue, openEditBrandModal }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const id = useSelector((state) => state.userDetails.id);
  const reduxState = useSelector((state) => state);
  const [errorSB, setErrorSB] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [respMessage, setRespMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const role = currentUserRole(reduxState);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

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
    const filterBrand = reduxState.customerBrand?.find((brand) => brand._id === item._id);
    if (filterBrand) {
      setFormValue({ ...filterBrand });
      openEditBrandModal()
      // dispatch(openEditBrandModal(true));
    }
  };

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Error"
      content={respMessage}
      dateTime={new Date().toLocaleTimeString("pk")}
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
      dateTime={new Date().toLocaleTimeString("pk")}
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <MDBox>
      <MDBox onClick={handleMenuOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="active-svg"
          width="27"
          height="27"
          fill="none"
        >
          <path
            stroke="inherit"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10ZM21 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM6 26a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
          />
        </svg>
      </MDBox>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {role?.customer ? (
          <div>
            <MenuItem onClick={openBrandModal}>Edit</MenuItem>
            <MenuItem sx={containerStyles} onClick={deleteBrandList}>
              <h6 style={{ fontWeight: "300", color: "inherit" }}>Delete</h6>
              <IconButton>
                <MoonLoader size={20} loading={loading} />
              </IconButton>
            </MenuItem>
          </div>
        ) : role?.admin ? (
          <MenuItem sx={containerStyles} onClick={() => { }}>
            <h6 style={{ fontWeight: "300", color: "inherit" }} onClick={deleteBrandList}>Delete</h6>
            <IconButton>
              <MoonLoader size={20} loading={loading} />
            </IconButton>
          </MenuItem>
        ) : (
          <MenuItem sx={containerStyles} onClick={() => { }}>
            <h6 style={{ fontWeight: "300", color: "inherit" }}>No Options</h6>
          </MenuItem>
        )}
      </Menu>
      {renderSuccessSB}
      {renderErrorSB}
    </MDBox>
  );
};

const ShowFiles = ({ item }) => {
  const [showfiles, setShowFiles] = useState(false);
  return (
    <MDBox>
      <ArrowDownward
        onClick={() => setShowFiles((prev) => !prev)}
        sx={{
          fill: mibananaColor.yellowColor,
          width: "2.6em",
          height: "3.6em ",
        }}
      />
      {showfiles && (
        <MDTypography display="flex" flexDirection="column" variant="p" fontSize="small">
          {item.files?.map((file) => {
            const file_name = file.name?.split('.')?.shift()
            const extension = file.name?.split('.')?.pop()
            const name = file_name?.length > 14 ? file_name?.substring(0, 14) + '...' + extension : file?.name

            return <MDTypography
              sx={{ color: "#000", fontWeight: "bold" }}
              key={file.id}
              variant="p"
              fontSize="small"
            >
              {name}
            </MDTypography>
          })}
        </MDTypography>
      )}
    </MDBox>
  );
};

const BrandData = (setFormValue, openEditBrandModal) => {
  const userID = useSelector((state) => state.userDetails.id);
  const reduxState = useSelector((state) => state);
  const new_brand = useSelector((state) => state.new_brand);
  const customerBrand = useSelector((state) => state.customerBrand);
  const dispatch = useDispatch();
  const role = currentUserRole(reduxState);
  const func = useCallback((value) => dispatch(getCustomerBrand(value)), [dispatch]);
  const is768 = useMediaQuery("(max-width:768px)")

  useEffect(() => {
    getBrandData(userID, func);
  }, [new_brand, func, userID]);

  const textStyles = {
    fontFamily: fontsFamily.poppins,
    fontSize: is768 ? '12px !important' : '15px',
    fontWeight: "400 !important",
    color: mibananaColor.yellowTextColor,
  };
  const rows = customerBrand?.map((item) => {

    const arr = { url: "" };
    function getBrandLogo() {
      const result = item.files?.find((list) => list.name?.startsWith("brand-logo"));
      if (result) {
        arr.url = result?.url
      }
      else {
        const result = item.files?.find((list) => list.type?.startsWith("image/"))
        if (result) {
          arr.url = result?.url
        } else {
          arr.url = ""
        }
      }
    }
    let brandDescription = item.brand_description?.substring(0, 50) + '...'
    getBrandLogo();

    return {
      logo: (
        <>
          {role?.customer ? (
            <img
              src={arr?.url}
              style={{ maxWidth: 80, maxHeight: 80, width: 80, height: "auto" }}
              alt="brand-logo"
            />
          ) : (
            <Link to={`/brand/${item?._id}`}>
              <img
                src={arr?.url}
                style={{ maxWidth: 80, maxHeight: 80, width: 80, height: "auto" }}
              />
            </Link>
          )}
        </>
      ),
      brand_name: (
        <MDTypography variant="h4" sx={textStyles}>
          {item.brand_name}
        </MDTypography>
      ),

      brand_description: (
        <MDTypography
          variant="p"
          sx={{ ...textStyles, fontSize: "14px !important" }}
          dangerouslySetInnerHTML={{ __html: brandDescription }}
        >
          {/* {item.brand_description} */}
        </MDTypography>
      ),

      // files: <MDTypography display="flex" flexDirection="column" variant="p" fontSize="small">
      //     {item.files?.map(file => <MDTypography sx={{ color: '#000', fontWeight: 'bold' }} key={file.id} variant="p" fontSize="small">{file.name}</MDTypography>)}
      // </MDTypography>,
      files: <ShowFiles item={item} />,
      action: (
        <MDTypography component="span" href="#" variant="caption" color="text" fontWeight="medium">
          <Action item={item} setFormValue={setFormValue} openEditBrandModal={openEditBrandModal} />
        </MDTypography>
      ),
    };
  });
  const small_rows = customerBrand?.map((item) => {
    const arr = { url: "" };
    function getBrandLogo() {
      const result = item.files?.find((list) => list.name?.startsWith("brand-logo"));
      if (result) {
        arr.url = result?.url
      }
      else {
        const result = item.files?.find((list) => list.type?.startsWith("image/"))
        if (result) {
          arr.url = result?.url
        } else {
          arr.url = ""
        }
      }
    }
    let brandDescription = item.brand_description?.substring(0, 50) + '...'
    getBrandLogo();
    return {
      logo: (
        <>
          {role?.customer ? (
            <img
              src={arr?.url === "" ? "" : arr?.url}
              style={{ maxWidth: 70, maxHeight: 70, width: 50, height: "auto" }}
              alt="brand-logo"
            />
          ) : (
            <Link to={`/brand/${item?._id}`}>
              <img
                src={arr?.url}
                style={{ maxWidth: 70, maxHeight: 70, width: 50, height: "auto" }}
              />
            </Link>
          )}
        </>
      ),
      brand_name: (
        <MDTypography variant="h4" sx={textStyles}>
          {item.brand_name}
        </MDTypography>
      ),
      action: (
        <MDTypography component="span" href="#" variant="caption" color="text" fontWeight="medium">
          <Action item={item} setFormValue={setFormValue} openEditBrandModal={openEditBrandModal} />
        </MDTypography>
      ),
    };
  });
  return {
    rows: customerBrand?.length > 0 ? rows : [],
    small_rows: customerBrand?.length > 0 ? small_rows : [],
    columns: [
      { Header: "Logo", accessor: "logo", align: "left", cells: (props) => console.log('props', props) },
      { Header: "Brand name", accessor: "brand_name" },
      { Header: "Brand Description", accessor: "brand_description", align: "center" },
      { Header: "Files", accessor: "files", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    small_columns: [
      { Header: "Logo", accessor: "logo", align: "left" },
      { Header: "Brand name", accessor: "brand_name" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
  };
};
export default BrandData;

const containerStyles = {
  display: "flex",
  justifyContent: "space-between",
};
