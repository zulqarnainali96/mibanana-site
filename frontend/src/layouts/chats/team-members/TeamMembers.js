import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText';
import profileAvatar from 'assets/mi-banana-icons/Profile.png'
import { ListItemIcon } from '@mui/material';
import { Close } from '@mui/icons-material';
import apiClient from 'api/apiClient';
import { useParams } from 'react-router-dom';
import { getProjectData } from 'redux/global/global-functions';
import { getCustomerProject } from 'redux/actions/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';


const TeamMembers = ({ team_member, setIsMember, setRespMessage, openErrorSB, openSuccessSB, isManager }) => {
    const { name, email, avatar } = team_member
    const { id } = useParams()
    const dispatch = useDispatch()
    const project_id = useSelector(state => state.userDetails.id)
    const func = (val) => dispatch(getCustomerProject(val))

    async function deleteMember() {
        // console.log(team_member)
        const data = {
            user: team_member?._id,
            project_id: id
        }
        await apiClient.post(`/delete-designer`, data)
            .then(({ data }) => {
                setRespMessage(data?.message)
                setIsMember(prev => !prev)
                getProjectData(project_id, func)
                setTimeout(() => {
                    openSuccessSB()
                }, 800)
            })
            .catch(error => {
                if (error.response) {
                    const { message } = error.response.data
                    setRespMessage(message)
                    setTimeout(() => {
                        openErrorSB()
                    }, 800)
                    return
                }
                setRespMessage(error.message)
                setTimeout(() => {
                    openErrorSB()
                }, 800)
            })
    }
    return (
        <List sx={{ border: '1px solid #ccc', width: '270px', marginBottom: '10px', borderRadius: '10px', padding: '5px' }}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        {/* <ImageIcon /> */}
                        <img src={profileAvatar} width={60} height={60} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} />
                {isManager && <ListItemIcon onClick={deleteMember}>
                    <Close fontSize='medium' sx={styles} />
                </ListItemIcon>}
            </ListItem>
        </List>
    )
}

export default TeamMembers

const styles = {
    cursor: 'pointer',
    backgroundColor: '#ddd',
    borderRadius: '20px'
}