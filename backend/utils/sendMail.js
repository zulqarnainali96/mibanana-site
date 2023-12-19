const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendMailToUser = async (email, url) => {
    sendgrid.send({
        to: email,
        from: process.env.SENDER,
        subject: 'Verfiy Your Account',
        html: `<h4>
            Click on link to Verfiy your account
            <a href="${url}">Verify your account</a>
        </h4>`
    })
}
const sendConfirmAccountMail = async (email, msg) => {
    sendgrid.send({
        to: email,
        from: process.env.SENDER,
        subject: 'Account Confirmation from Mibanana.com',
        html: `<div style={display:flex,flex-direction:column,gap:12px}> 
                    <h2>Your account is Approved now you can use our services</h2>
                    <br />       
                    <h4>Login Credentials :</h4>
                    <h4>Email: ${email} </h4>
                    <h4>Password : <strong>${msg?.password}</strong></h4>
                    <a href="${msg?.url}">Mibanana.com</a>
                </div>`
    })
}
module.exports = { sendMailToUser, sendConfirmAccountMail }