// {/* <Grid container className={navbarStyles.gridContainer} sx={
//     { paddingInline: !is600 ? "0.5rem" : "5rem", alignItems: !is800 && "center", paddingBlock: !islg ? "13px" : '20px', }}>

//     <Grid item xxl={6.5} xl={4} lg={4} md={5} sm={6} xs={5} display={"flex"} alignItems={"center"} textAlign={!isLarge && "center"}>
//       <img className='logo-image' src={MibananaIcon} loading='lazy' />
//     </Grid >
//     <Grid item xxl={5.5} xl={8} lg={8} md={7} sm={6} xs={7}>
//       <Grid container alignItems="center">
//         <Grid item xxl={5} xl={5.5} display={"flex"} gap="18px" lg={role?.customer ? 5 : 6} md={12} sm={12} xs={12} sx={gridItemResponsive}>
//           <img className="person-image" src={personImage} />
//           <div className='hello-text-container'>
//             <MDTypography className="hello-text" sx={responsiveStyle}>Hello {showRoles()}!</MDTypography>
//             <MDTypography className="person-role" sx={roleResponsive}>{showPersonRoles()}</MDTypography>
//           </div>
//         </Grid>
//         <Grid item xxl={7} xl={6.5} lg={6} md={6} xs={12} sx={({ breakpoints }) => ({
//           [breakpoints.down('lg')]: {
//             display: 'none'
//           }
//         })}>
//           <Grid container justifyContent={"center"}>
//             <Grid
//               item
//               xxl={12}
//               xl={12}
//               lg={12}
//               md={12}
//               sm={6}
//               xs={12}
//               display="flex"
//               alignItems={"center"}
//               gap={"8px"}
//               sx={({ breakpoints }) => ({
//                 [breakpoints.only("xs")]: { paddingBottom: "14px" },
//               })}
//             >
//               <div className="btn-container" onClick={updateAllChatMessage}>

//                 {getMessageNotification() ? (
//                   <span className={navbarStyles.notificationPoint}></span>
//                 ) : null}
//                 <RightSideDrawer list={list} />
//               </div>
//               <div className="btn-container" onClick={handleUserProfileMenu}>
//                 <AccountCircle fontSize="large" />
//               </div>
//               {/* <div className="btn-container menu-icon" onClick={handleMobileNav} >
//                 <MenuIcon fontSize="large" />
//               </div> */}
//               {renderUserMenu()}
//               {role?.customer && (
//                 <ProjectButton
//                   variant="contained"
//                   size="medium"
//                   startIcon={projectIcon}
//                   onClick={handleClickOpen}
//                 >
//                   Create Project
//                 </ProjectButton>
//               )}
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid >
//   </Grid >
//    */}