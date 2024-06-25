import MDBox from 'components/MDBox'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import React from 'react'
import noPageFound from 'assets/new-images/mibanana-team/no-page.png'
import { Grid, useMediaQuery } from '@mui/material'
import MDTypography from 'components/MDTypography'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import TeamMemberChat from 'layouts/team-member-chat'
import useMibananaTeam from './useMibananaTeam'
import ChatIcon from '@mui/icons-material/Chat';
import SingleChat from 'layouts/team-member-chat/components/singleChat'
import reduxContainer from 'redux/containers/containers'

const MibananTeam = ({ reduxState }) => {
    const is768 = useMediaQuery("(min-width:768px)")
    const {
        mobileDevList,
        graphicDesignerList,
        copyWriterList,
        webDeveloperList,
        socialMediaManagerList,
        openSingleChat,
        handleSingleChat,
        closeSingleChat,
        user_avatar,
        username,
        singleChat,
        user_id,
    } = useMibananaTeam(reduxState)



    return (
        <DashboardLayout>
            <Grid container spacing={2} py={2} px={4} flexDirection={"column"} alignItems={"center"}>
                <Grid item xxl={4} xl={4} alignSelf={"flex-start"} lg={12} md={12}>
                    <MDTypography sx={titleStyles}>Mibanana Team</MDTypography>
                </Grid>
                {openSingleChat ? <SingleChat handleSingleChat={closeSingleChat} userId={user_id} item={singleChat} user_avatar={user_avatar} username={username} /> :
                    (<React.Fragment>
                        <Grid item width={'100%'} alignSelf={"flex-start"}>
                            <MDTypography sx={titleStyles2}>Graphic-Designer</MDTypography>
                            <Grid container display={"flex"} spacing={1} py={2} px={2} mt={0} width={'100%'}>
                                {graphicDesignerList?.map((item, i) => <TeamMemberChat key={i} item={item} handleSingleChat={() => handleSingleChat(item)} />)}
                            </Grid>
                        </Grid>
                        <Grid item width={'100%'} alignSelf={"flex-start"}>
                            <MDTypography sx={titleStyles2}>Social-Media-Manager</MDTypography>
                            {socialMediaManagerList?.map((item, i) => <TeamMemberChat key={i} item={item} handleSingleChat={() => handleSingleChat(item)} />)}
                        </Grid>
                        <Grid item width={'100%'} alignSelf={"flex-start"}>
                            <MDTypography sx={titleStyles2}>Mobile App Developer</MDTypography>
                            {mobileDevList?.map((item, i) => <TeamMemberChat key={i} item={item} handleSingleChat={() => handleSingleChat(item)} />)}
                        </Grid>
                        <Grid item width={'100%'} alignSelf={"flex-start"}>
                            <MDTypography sx={titleStyles2}>CopyWriter</MDTypography>
                            {copyWriterList?.map((item, i) => <TeamMemberChat key={i} item={item} handleSingleChat={() => handleSingleChat(item)} />)}
                        </Grid>
                        <Grid item width={'100%'} alignSelf={"flex-start"}>
                            <MDTypography sx={titleStyles2}>Web Developer</MDTypography>
                            {webDeveloperList?.map((item, i) => <TeamMemberChat key={i} item={item} handleSingleChat={() => handleSingleChat(item)} />)}
                        </Grid>

                        <Grid item xxl={8} xl={8} textAlign={"center"}>
                            {/* <img src={noPageFound} width={"60%"} alt="no-page-found" /> */}
                        </Grid>
                    </React.Fragment>
                    )}
            </Grid>
        </DashboardLayout>
    )
}

const titleStyles = {
    fontSize: '2.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}
const titleStyles2 = {
    fontSize: '1.5rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}

export default reduxContainer(MibananTeam)
