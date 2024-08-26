import { Card, CardContent, Typography } from "@mui/material"
import DialogContent from "@mui/material/DialogContent"
import "./group-details.css"
import { formatMessageDate } from "redux/global/table-date"

export const GroupDetails = ({ data }) => {
    console.log(data)
    return (
        <DialogContent sx={{}}>
            <div className="main-container">
                <div className="inner-container">
                    <h5>Group Name</h5>
                    <div>
                        <Card sx={{ padding: '.8em', marginBottom: '.4rem' }}>
                            <div>{data.group_name}</div>
                        </Card>
                    </div>
                    <h5>Group Admin</h5>
                    <div>
                        <Card sx={{ padding: '.8em', marginBottom: '.4rem' }}>
                            <div>{data.group_admin}</div>
                        </Card>
                    </div>
                    <h5>Creation date</h5>
                    <div>
                        <Card sx={{ padding: '.8em', marginBottom: '.4rem' }}>
                            <div>{formatMessageDate(data.createdAt)}</div>
                        </Card>
                    </div>
                </div>
                <div className="inner-container">
                    <h5>Group Participant</h5>
                    <div >
                        {data.participant?.map(item => {
                            return (
                                <Card sx={{ padding: '.8em', width: '100%', marginBottom: '.4rem' }}>
                                    <div>{item.name}</div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}