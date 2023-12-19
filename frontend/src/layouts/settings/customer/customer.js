import MDBox from "components/MDBox";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
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

const CreateCustomer = ({ reduxState, reduxActions }) => {
    const nonActiveCustomer = reduxState.non_active_customer_data
    const role = currentUserRole(reduxState)
    const user = useSelector(state => state.userDetails)
    const [customerList, setCustomerList] = useState([])
    const { rows, columns } = useCustomerTable(customerList)

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
                console.log(error.message)
            }
        }
        getCustomerAccounts()
    }, [])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox px={4} py={6}>
                <Card>
                    <MDBox
                        mx={2}
                        mt={3}
                        sx={({ palette: { light, grey } }) => ({
                            // backgroundColor : light.cream,
                        })}
                    >
                        <MDTypography variant="h4" color="dark">
                            New Customer Accounts
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <ProjectDataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            pagination={{ variant: 'contained', color: 'success' }}
                            // isfunc={true}
                            noEndBorder
                        />
                        {!rows.length ? <MDTypography textAlign="center" p={1} component="h4">No Customers Found</MDTypography> : null}
                    </MDBox>
                </Card>
            </MDBox>
        </DashboardLayout>
    )
}
export default reduxContainer(CreateCustomer)