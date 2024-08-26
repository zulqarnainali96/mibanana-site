import { fontsFamily } from "assets/font-family"

export const FieldsError = ({ error }) => {
    console.log(error)
    return (
        <div style={errorStyle}>
            {error}
        </div>
    )
}


const errorStyle = {
    top : '77px',
    left: '17px',
    position: 'absolute',
    color: 'red',
    fontFamily: fontsFamily.poppins,
    fontSize: '1rem',
    textTransfrom : 'capitalize',
    fontWeight : '300'
}