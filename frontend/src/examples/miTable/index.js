import { Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Card from '@mui/material/Card'
import MDBox from 'components/MDBox'
import MDTypography from 'components/MDTypography'
import DataTable from 'examples/Tables/DataTable'
import React from 'react'
import Palette from '@mui/icons-material/Palette'
import Description from '@mui/icons-material/Description'
import VideocamIcon from '@mui/icons-material/Videocam';
import "./table.css"

const MITable = ({ header, data }) => {
    const columns = [
        { Header: "Project Name", accessor: "project_name", align: "left" },
        { Header: "Category", accessor: "category", align: "left" },
        { Header: "Active on", accessor: "active_on", align: "left" },
    ]
    const rows = [
        {
            id: 1,
            author: "Social Media Marketing",
            category: "Graphic Designs",
            status: `${new Date().toDateString()}`
        },
        {
            id: 2,
            author: "Blog",
            category: "Copy Writing",
            status: `${new Date().toDateString()}`
        },
        {
            id: 3,
            author: "Instagram Reel",
            category: "Video Editing",
            status: `${new Date().toDateString()}`
        },
        {
            id: 4,
            author: "Instagram Reel",
            category: "Video Editing",
            status: `${new Date().toDateString()}`
        }
    ]
    return (
        <div className='mi-table'>
            <div className='border'>
                <ul>
                    <li>Project Name</li>
                    <li>Category</li>
                    <li>Active on</li>
                </ul>
            </div>
            <ul className='category-list'>
                <li>
                    <Palette sx={{ color: 'gray', verticalAlign: "middle" }} fontSize='medium' />
                    &nbsp;&nbsp;Social Media Marketing
                </li>
                <li>Graphic Design</li>
                <li>{new Date().toDateString()}</li>
            </ul>
            <ul className='category-list'>
                <li>
                    <Description sx={{ color: 'gray', verticalAlign: "middle" }} fontSize='medium' />
                    &nbsp;&nbsp;Social Media Marketing
                </li>
                <li>Graphic Design</li>
                <li>{new Date().toDateString()}</li>
            </ul>
            <ul className='category-list'>
                <li>
                    <MDBox >
                        <VideocamIcon sx={{ color: 'gray', verticalAlign: "middle" }} fontSize='medium' />
                        &nbsp;&nbsp;Social Media Marketing
                    </MDBox>
                </li>
                <li>Graphic Design</li>
                <li>{new Date().toDateString()}</li>
            </ul>
        </div>

    )
}

export default MITable

{/* <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell  scope='col' colSpan={5}>Project Name</TableCell>
                            <TableCell scope='row'>Category</TableCell>
                            <TableCell scope='row'>Active on</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.author}
                                </TableCell>
                                <TableCell >{row.category}</TableCell>
                                <TableCell >{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}