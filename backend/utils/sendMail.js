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
        html: `<table style="width: 100%;background-color: #F6F6E8">
        <tr >
            <td align="center">
                <img src="https://storage.googleapis.com/mi-banana-401205.appspot.com/mibanana-logo/mibanana-logo.png" style="margin-block:30px;"  width='40%' />
            </td>
        </tr>
        <tr>
            <td align="center">
                <h2 style="color: #000">Your account is Approved now you can use our services</h2>
            </td>
        </tr>
        <tr>
            <td align="center">
                <h2 style="color: #000">Login Credentials</h2>
            </td>
        </tr>
        <tr>
            <td align="center">
                <h2 style="color: #000">Email: ${email}  Password : <strong>${msg?.password}</strong></h2>
            </td>
        </tr>
        <tr>
            <td align="center">
                <a style="color: #000; font-style: italic; font-size:19px; padding-bottom: 10px;" href="${msg?.url}">go to site si.mibanana.com</a>
            </td>
        </tr>
    </table>`
    })
}
module.exports = { sendMailToUser, sendConfirmAccountMail }