import { Card, CardContent, Typography } from "@mui/material"
import DialogContent from "@mui/material/DialogContent"
import "./group-details.css"

export const GroupDetails = ({ data }) => {
    console.log(data)
    return (
        <DialogContent sx={{}}>
            <div className="group-details-container">
                {data.participant?.map(item => {
                    return (
                        <Card sx={{ maxWidth: 345, marginBottom: '.4rem' }}>
                            <div>{item.name}</div>
                        </Card>
                    )
                })}
            </div>
        </DialogContent>
    )
}