import MDBox from "components/MDBox";
import useCustomerTable from "./customer-table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import ProjectDataTable from "examples/projectsTable";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { currentUserRole } from "redux/global/global-functions";
import apiClient from "api/apiClient";
import reduxContainer from "redux/containers/containers";
import NewProjectsTable from "examples/new-table";
import { mibananaColor } from "assets/new-images/colors";
import { fontsFamily } from "assets/font-family";
import MDButton from "components/MDButton";

const CreateCustomer = ({ reduxState, reduxActions }) => {
    const nonActiveCustomer = reduxState.non_active_customer_data
    const role = currentUserRole(reduxState)
    const user = useSelector(state => state.userDetails)
    const [customerList, setCustomerList] = useState([])
    const { rows, columns } = useCustomerTable(customerList)
    const [showChangeTable, setShowChangeTable] = useState(false)

    useEffect(() => {
        const getCustomerAccounts = async () => {
            try {
                if (role?.admin) {
                    const formdata = { role: user?.roles }
                    const { data } = await apiClient.post('/api/get-all-customer', formdata)
                    setCustomerList(data?.user)
                    reduxActions.getNonActiveCustomerData(data?.user)
                }
            } catch (error) {
                console.error(error.message)
            }
        }
        getCustomerAccounts()
    }, [])

    return (
        <DashboardLayout>
            <MDBox px={4} py={6}>
                <MDTypography sx={titleStyles}>
                    All Accounts
                </MDTypography>
                <MDBox display="flex" pb={1} justifyContent="flex-start" gap={1}>
                    <MDButton size="small" color="warning" sx={{ color: "#333" }}>User accounts</MDButton>
                    <MDButton size="small" color="warning" sx={{ color: "#333" }}>Team members accounts</MDButton>
                </MDBox>
                {showChangeTable ? (
                    <Card>
                        <MDBox pt={3}>
                            <NewProjectsTable
                                table={{ columns, rows }}
                                entriesPerPage={{ defaultValue: 6 }}
                                showTotalEntries={true}
                                pagination={{ variant: 'contained', color: "warning" }}
                                noEndBorder={false}
                                canSearch={false}
                                isSorted={false}
                            />
                            {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Customers Found</MDTypography> : null}
                        </MDBox>
                    </Card>

                ) : (
                    <Card>
                        <MDBox pt={3}>
                            <NewProjectsTable
                                table={{ columns, rows }}
                                entriesPerPage={{ defaultValue: 6 }}
                                showTotalEntries={true}
                                pagination={{ variant: 'contained', color: "warning" }}
                                noEndBorder={false}
                                canSearch={false}
                                isSorted={false}
                            />
                            {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Customers Found</MDTypography> : null}
                        </MDBox>
                    </Card>
                )}
            </MDBox>
        </DashboardLayout>
    )
}
export default reduxContainer(CreateCustomer)

const titleStyles = {
    fontSize: '3rem',
    width: '100%',
    color: mibananaColor.yellowColor,
    fontFamily: fontsFamily.poppins,
    fontWeight: 'bold !important',
    userSelect: 'none'
}