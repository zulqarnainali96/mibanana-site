const User = require('../models/UsersLogin')
const { CompanyDetaitls } = require('../models/profile-settings')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const Token = require('../models/email-verification/emailVerify')
const sendEmail = require('../utils/sendEmail')
const Joi = require('joi')
const { sendMailToUser, sendConfirmAccountMail } = require('../utils/sendMail')

// Currently Not Using this API for creating customer
const createUsers = asyncHandler(async (req, res) => {
    const { email, password, name, roles, company_profile } = req.body
    if (!email || !password || !roles) {
        return res.status(400).json({
            message: 'All fields are required (email, password, roles, company_profile)'
        })
    }
    const duplicate = await User.findOne({ email }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'email already exists' })
    }
    const hashPassword = await bcrypt.hash(password, 10) // Salt Rounds
    const created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()
    const userObject = { email, 'password': hashPassword, name, created_at, is_active: true, roles, avatar: '', phone_no: '', company_profile }
    const user = await User.create(userObject)
    if (user) {
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()
        const url = `${process.env.FRONT_BASE_URL}/auth/user/${user._id}/verify/${token.token}`
        await sendMailToUser(user.email, url).then((response) => {
            return res.status(200).json({ message: 'An Email has been sent Please verify account at ' + email })

        }).catch((error) => {
            return res.status(400).json({ message: 'Found Error while sending email try again!' })
        })

    } else {
        return res.status(400).json({ message: 'Invalid user data' })
    }
})

const LoginUser = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: "Invalid Email not found" });
        }
        const validPassword = await bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            if (!user?.is_active) {
                return res.status(402).send({ showModal: true, message: "Your Account Status is on Pending. Once your account is verified you will get email from Mibanana.com " })
            } else {
                return res.status(401).send({ message: "Invalid Email or Password" });
            }
        }
        if (user.roles?.includes("Admin")) {
            console.log(user)
            const { name, email, _id, is_active, created_at, roles, verified, phone_no, avatar, } = await User.findById(user._id)
            return res.status(200).send({ userDetails: { name, email, id: _id, is_active, created_at, roles, verified, phone_no, avatar }, message: "logged in successfully" })
        }
        // if (!user?.verified) {
        //     let token = await Token.findOne({ userId: user._id });
        //     if (!token) {
        //         const token = await new Token({
        //             userId: user._id,
        //             token: crypto.randomBytes(32).toString("hex"),
        //         }).save();
        //         const url = `${process.env.FRONT_BASE_URL}/auth/user/${user._id}/verify/${token.token}`
        //         await sendMailToUser(user.email, url).then(() => {
        //             return res.status(400).send({ message: 'An Email has been sent Please verify your account at ' + user.email })

        //         }).catch((error) => {
        //             console.log('error')
        //             return res.status(400).send({ message: 'Found Error while sending email try again!' })
        //         })
        //     } else {
        //         //await Token.findByIdAndRemove(token._id)
        //         //await User.findByIdAndUpdate(user.id, { verified: true })
        //         return res.status(404).send({ message: 'Please Verify your account first' })
        //     }
        // }
        // if (!user?.is_active) {
        //     return res.status(402).send({ showModal: true, message: "Your Account Status is on Pending. Once your account is verified you will get email from Mibanana.com " })
        // }
        const { name, email, _id, is_active, created_at, roles, verified, phone_no, avatar, company_profile } = await User.findById(user._id)
        const findUser = await User.findById(user._id).lean()
        return res.status(200).json({ userDetails: { name, email, id: _id, is_active, created_at, roles, verified, phone_no, avatar, company_profile, notifications: findUser.notifications }, message: "logged in successfully" });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const getAllRequiredFields = async (req, res) => {
    const user = req.params.id
    if (!user) {
        return res.status(401).send({ message: "Invalid Id try again" });
    }
    const users = await User.findById({ _id: user })
    if (users) {
        const companyDetails = await CompanyDetaitls.findOne({ user })
        if (companyDetails) {
            const userData = {
                phone: users.phone_no ? users.phone_no : '',
                primary_email: companyDetails.primary_email ? companyDetails.primary_email : '',
                contact_person: companyDetails.contact_person ? companyDetails.contact_person : '',
                primary_phone: companyDetails.primary_phone ? companyDetails.primary_phone : '',
            }
            return res.status(200).send({ message: 'Found Data', userData })
        } else if (companyDetails === null) {
            const userData = { phone: '', primary_email: '', contact_person: '', primary_phone: '' }
            return res.status(200).send({ message: 'No Data found!', userData })
        }
    } else {
        return res.status(404).send({ message: 'User not Found' })
    }
}

const getNewCustomerDetails = async (req, res) => {
    const { phone, name, email, password, confirm_password, company_name, primary_email, contact_person, primary_phone } = req.body
    if (!phone || !name || !email || !password || !confirm_password || !company_name || !primary_email || !contact_person || !primary_phone) {
        return res.status(401).send({ message: "Provide All Required fields" });
    }
    try {
        const duplicate = await User.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'email already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 10) // Salt Rounds
        const created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()

        const userObject = { email, password, name, created_at, is_active: false, roles: ['Customer'], avatar: '', phone_no: phone, company_profile: company_name }

        const user = await User.create(userObject)
        if (user) {
            const companyDetails = await CompanyDetaitls.create({ user: user?._id, primary_email, contact_person, primary_phone })
            if (companyDetails) {
                const token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
                const url = `${process.env.FRONT_BASE_URL}/auth/user/${user._id}/verify/${token.token}`

                await sendMailToUser(user.email, url).then((response) => {
                    return res.status(200).json({ message: 'An Email has been sent Please verify account at ' + user.email })

                }).catch((error) => {
                    return res.status(400).json({ message: 'Found Error while sending email try again!' })
                })
            } else {
                return res.status(500).send({ message: 'Internal Server Error' })
            }
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })

    }
}
// Project Manager Routes for getting all non Active Customer
const updateNewCustomerDetails = async (req, res) => {
    const { roles, customer_details } = req.body
    if (!customer_details && typeof customer_details !== 'object') {
        return res.status(402).send({ message: 'Please provide all customer details' })
    }
    if (roles?.includes("Customer") || roles?.includes("Graphic-Designer")) {
        return res.status(402).send({ message: 'Your are not authorized' })
    }
    try {
        const { _id, password, is_active, email } = customer_details
        const hashPassword = await bcrypt.hash(password, 10) // Salt Rounds
        const findUser = await User.findByIdAndUpdate(_id, { is_active, 'password': hashPassword })
        if (findUser) {
            const msg = {
                password,
                url: 'https://si.mibanana.com'
            }
            await sendConfirmAccountMail(email, msg).then(() => {
                return res.status(200).send({ message: 'Account Updated. and Confirmation mail has been sent to Customer' })
            }).catch((error) => {
                console.log(error)
                return res.status(400).send({ message: 'Found Error while udpating and sending Mail to Customer!' })
            })
        } else {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const deleteCurrentCustomer = async (req, res) => {
    const _id = req.params.id
    if (!_id) {
        return res.status(400).send({ message: 'Please provide id' })
    }
    try {
        const user = await User.findById(_id)
        if (user) {
            const findCompanydetails = await CompanyDetaitls.findOne({ user: _id })
            if (findCompanydetails) {
                await User.findByIdAndRemove(_id)
                await CompanyDetaitls.findByIdAndRemove(findCompanydetails?._id)
                console.log("delete")
                return res.status(200).send({ message: 'User Deleted' })
            }
        } else {
            return res.status(404).send({ message: 'No User found' })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}
// Project Manager Routes for getting all non Active Customer
const getCompanyDetails = async (req, res) => {
    const id = req.params.id
    if (!id) {
        return res.status(400).send({ message: 'Please provide current user ID' })
    }
    try {
        const company_details = await CompanyDetaitls.findById(id)
        if (company_details) {
            return res.status(200).send({ message: 'Details found', company_details })
        } else {
            return res.status(404).send({ message: 'No details found try again!' })
        }
    } catch (error) {
        return res.status(500).send({ message: 'Internal Server Error' })
    }

}

const getNonActiveCustomer = async (req, res) => {
    const { role } = req.body
    console.log(role)
    if (!role) {
        return res.status(400).send({ message: 'Please provide roles' })
    }
    try {
        if (role?.includes("Project-Manager") || role?.includes("Admin")) {
            const user = await User.find().exec()
            if (user) {
                return res.status(200).send({ user })
            } else {
                return res.status(404).send({ message: 'No Users found' })
            }
        } else {
            return res.status(400).send({ message: 'Your are not authorized' })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'Internal Server Error' })
    }
}

const updateCustomerDetails = async (req, res) => {
    const { roles, name, email, phone, password, company_name,
        primary_email, contact_person, primary_phone } = req.body

    if (!roles || !name || !email || !phone || !password || !company_name || !primary_email || !contact_person || !primary_phone) {
        return res.status(402).send({ message: 'Please provide all customer details' })
    }
    if (roles?.includes("Customer") || roles?.includes("Graphic-Designer")) {
        return res.status(402).send({ message: 'Your are not authorized' })
    }
    try {
        const duplicate = await User.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'email already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 10) // Salt Rounds
        const created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()
        const userObject = { email, 'password': hashPassword, name, created_at, is_active: true, verified: true, roles: ['Customer'], avatar: '', phone_no: phone, company_profile: company_name }
        const user = await User.create(userObject)
        if (user) {
            const saveCompanyDetails = await CompanyDetaitls.create({ user: user?._id, company_name, primary_email, contact_person, primary_phone, company_size: '', time_zone: '', company_address: '', })
            if (saveCompanyDetails) {
                const msg = {
                    email,
                    password,
                    url: 'https://si.mibanana.com'
                }
                await sendConfirmAccountMail(email, msg).then(() => {
                    return res.status(200).send({ message: 'Account Updated. and Confirmation mail has been sent to Customer' })
                }).catch(async (error) => {
                    console.log(error)
                    await User.findByIdAndRemove(user?._id)
                    await CompanyDetaitls.findByIdAndRemove(saveCompanyDetails?._id)
                    return res.status(400).send({ message: 'Found Error while udpating and sending Mail to Customer!' })
                })
            } else {
                await User.findByIdAndRemove(user?._id)
                return res.status(500).send({ message: 'Server Error: Try again' })
            }

        } else {
            return res.status(500).json({ message: 'Server Error: Unable to create User Try again!' })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
}
const createUserRole = async (req, res) => {
    const { username, is_active, roles, verified, password, email } = req.body
    console.log(req.body)
    if (!username || !roles || !password || !email) {
        return res.status(402).send({ message: 'Please provide all req fields' })
    }
    try {
        const duplicate = await User.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Email already exists' })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        if (hashPassword) {
            const created_at = new Date().toDateString() + " " + new Date().toLocaleTimeString()
            const obj = { name: username, is_active, created_at, roles, 'password': hashPassword, verified, email, avatar: '', notifications: [] }
            const user = await User.create(obj)
            if (user !== null) {
                return res.status(201).send({ message: 'User Created' })
            } else {
                return res.status(404).send({ message: 'Found error try again!' })
            }
        } else {
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("email"),
        password: Joi.string().required().label("password"),
    });
    return schema.validate(data);
}


module.exports = { createUsers, LoginUser, getNewCustomerDetails, getAllRequiredFields, createUserRole, getNonActiveCustomer, getCompanyDetails, deleteCurrentCustomer, updateCustomerDetails } 
