const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: 'gmail',
			port: 587,
			secure: true,
			auth: {
				user: 'zuhairbaig23@gmail.com',
				pass: 'fcur gmjl emlr ztty',
			},
		});

		await transporter.sendMail({
			from: 'zuhairbaig23@gmail.com',
			to: email,
			subject: subject,
			text: text,
		});
		// console.log("email sent successfully");
	} catch (error) {
		// console.log("email not sent!");
		// console.log(error);
		return error;
	}
};