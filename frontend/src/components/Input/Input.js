import React from 'react'
import "./Style.css"


const myStyle = {
    width: "100%",
    height: "52.13px",
    padding: "15px",
    border: "none",
    border: "1px solid #ccc",
    borderRadius: "0.375rem",
    fontSize: "14px",
    outline: "none",
    fontWeight: "400"
};



const Input = (props) => {
    const { placeholder, name, id, type, values, onChange, touched, onBlur, errors, disabled } = props;
    const borderColorRed = touched && errors ? 'border-color-red' : '';
    return (
        <>
            <input
                placeholder={placeholder}
                type={type}
                name={name}
                id={id}
                style={myStyle}
                value={values}
                onChange={onChange}
                onBlur={onBlur}
                className={borderColorRed}
                disabled={disabled}
                autoComplete='off'
                {...props}
            />
        </>
    )
}

export default Input