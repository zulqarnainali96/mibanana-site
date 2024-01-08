import React, { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import defaultAvatar from "assets/mi-banana-icons/default-profile.png";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import theme from "assets/theme";
import CloseSharp from "@mui/icons-material/CloseSharp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSelector } from "react-redux";
import apiClient from "api/apiClient";
import { InputLabel } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};
const SelectMembers = ({
  handleChange,
  memberName,
  setMemberName,
  manager,
  setDesignerObj,
  existTeamList,
  is_member,
}) => {
  const [designerList, setDesignerList] = useState([]);
  const id = useSelector((state) => state.userDetails?.id);

  // console.log('exist =>', existTeamList)
  useEffect(() => {
    if (manager) {
      apiClient
        .get("/api/get-designer-list/" + id)
        .then(({ data }) => {
          setDesignerObj(data?.designerlist);
          if (existTeamList?.length > 0) {
            let currentTeam = data?.designerlist.filter(
              (item, i) => item._id !== existTeamList[i]._id
            );
            setDesignerList(currentTeam);
          } else {
            setDesignerList(data?.designerlist);
          }
        })
        .catch((e) => {
          // console.log('Getting designer list ', e?.response?.data?.message)
        });
    }
  }, [is_member]);
  return (
    <>
      <FormControl
        sx={{
          m: 1,
          height: "65px",
          "& .MuiOutlinedInput-root": {
            minWidth: "272px",
            backgroundColor: "white !important",
            height: "52px !important",
            marginLeft: "-10px",
          },
        }}
      >
        <InputLabel id="select-team-members">Select Team members</InputLabel>
        <Select
          labelId="select-team-members"
          id="demo-simple-select-helper"
          label="Select Team members"
          // input={<OutlinedInput value={memberName} label="Select Team members" onChange={handleChange} name='members' sx={{ paddingBlock: '18px' }} />}
          onChange={handleChange}
          value={memberName}
          name="members"
          sx={{ width: "50%" }}
          IconComponent={() =>
            memberName?.length ? (
              <CloseSharp
                fontSize="small"
                sx={{ marginRight: 1, cursor: "pointer" }}
                onClick={() => setMemberName([])}
              />
            ) : (
              <KeyboardArrowDownIcon fontSize="medium" sx={{ marginRight: 1, cursor: "pointer" }} />
            )
          }
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {designerList?.length
            ? designerList.map((item) => (
                <MenuItem key={item._id} value={item}>
                  {item.name}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
    </>
    // <FormControl sx={formcontrolSx}>
    //     <Select
    //         placeholder='Select members to assign project'
    //         input={<OutlinedInput value={memberName} onChange={handleChange} name='members' sx={{ paddingBlock: '18px' }} />}
    //         MenuProps={MenuProps}
    //         IconComponent={() => memberName !== null ?
    //             <CloseSharp
    //                 fontSize='small'
    //                 sx={{ marginRight: 1, cursor: "pointer" }}
    //                 onClick={() => setMemberName(null)} />
    //             :
    //             <KeyboardArrowDownIcon fontSize='medium'
    //                 sx={{ marginRight: 1, cursor: "pointer" }} />}
    //     >
    //         {designerList?.length ? designerList.map((item =>
    //             <MenuItem
    //                 key={item._id}
    //                 sx={selectSX}
    //                 value={item}
    //             >
    //                 {item.name}
    //             </MenuItem>
    //         )) : null}
    //     </Select>
    // </FormControl>
  );
};

export default SelectMembers;

const formcontrolSx = {
  m: 1,
  width: 180,
  height: 60,
  background: "white",
  marginBottom: 1.7,
};

const selectSX = {
  // "& .MuiInputBase-root": {
  //     minWidth : '257px',
  //     backgroundColor: 'white',
  //     // height: '65px !important'
  // },
  // paddingBlock: "14px",
  // // border: "2px solid #000",
  // "& .MuiInputBase-root": {
  //     paddingBlock: '12px',
  //     backgroundColor: 'red',
  // },
  // "&:hover": {
  //     borderColor: 'transparent',
  // },
  // "& fieldset": {
  //     borderColor: '#000' + ' !important',
  //     borderWidth: 0 + " !important",
  //     "&:focus": {
  //         borderWidth: 0,
  //         borderColor: `transparent` + " !important",
  //     }
  // },
  // "& .MuiMenu-paper": {
  //     backgroundColor: "red",
  // }
};
