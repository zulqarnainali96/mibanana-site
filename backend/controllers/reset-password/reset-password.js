const User = require('../../models/UsersLogin')
const AuthCode = require('../../models/reset-password/reset-password-model');
const { authCode } = require('../../utils/sendMail');
const sendEmail = require('../../utils/sendEmail');
const bcrypt = require('bcrypt');

const sendAuthenticationCode = async (req, res) => {
    const { email } = req.body;
    console.log(req.body)
    if (!email) return res.status(400).send({ message: "Email is required" })

    try {
        const findUser = await User.findOne({ email })
        if (findUser) {
            const findPrevCode = await AuthCode.findOne({ email })
            if (findPrevCode) {
                await AuthCode.findByIdAndDelete(findPrevCode._id)
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const save = await AuthCode.create({ email, code })
            if (save) {
                // const subject = 'Authentication Code from mibanana'
                // await sendEmail(email, subject, code).then(response => {
                //     return res.status(200).send({ message: 'Authentication Code has been sent to your email' })
                // }).catch(e => {
                //     return res.status(400).send({ message: 'Failed to send email Try again!' })
                // })
                await authCode(email, code).then(response => {
                    return res.status(200).send({ message: 'Authentication Code has been sent to your email' })
                }).catch(e => {
                    return res.status(400).send({ message: 'Failed to send email Try again!' })
                })
            }
        } else {
            return res.status(400).send({ message: 'User not found' })
        }

    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}

const verifyAuthenticationCode = async (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).send({ message: "Authentication code is required" });

    try {
        const authCode = await AuthCode.findOne({ code });

        if (authCode) {
            // Code is valid
            await AuthCode.deleteOne({ code }); // Remove the used code
            return res.status(200).send({ message: 'Authentication code verified successfully' });
        } else {
            // Code is invalid or expired
            return res.status(400).send({ message: 'Invalid or expired authentication code try again' });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};

const resetPassword = async (req, res) => {
    const { password, email } = req.body;
    if (!password) return res.status(400).send({ message: "Password is required" });
    if (!email) return res.status(400).send({ message: "Email is required" });

    try {
        const user = await User.findOne({ email });
        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            return res.status(200).send({ message: 'Password changed successfully' });
        } else {
            return res.status(400).send({ message: 'User not found' });
        }
    } catch (error) {

    }
}

module.exports = { sendAuthenticationCode, verifyAuthenticationCode, resetPassword }