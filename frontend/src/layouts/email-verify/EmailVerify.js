import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import success from "assets/mi-banana-icons/success.png";
import styles from "./styles.module.css";
import { Fragment } from "react";
import apiClient from "api/apiClient";
import MDTypography from "components/MDTypography";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `/auth/user/${param.id}/verify/${param.token}`;
				const { data } = await apiClient.get(url);
				setValidUrl(true);
			} catch (error) {
				// console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	return (
		<Fragment>
			{validUrl ? (
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<MDTypography vairant="h4"

						sx={{
							paddingTop: '1.5rem',
							color: 'green',
							fontSize: '32px',
							fontWeight: 400,
						}}>Email verified successfully</MDTypography>
					<MDTypography sx={{ paddingTop: '1rem', }}>Your Account Status is on
						<span
							style={{
								textTransform: 'uppercase', padding: '7px', backgroundColor: 'red', color: 'white', borderRadius: '11px', boxShadow: 'inset -1px 0px 24px 1px #0000003b', fontSize: '16px', marginInline: '7px'
							}}>
							pending</span>.Once your account is verified you will get email from <strong>Mibanana.com</strong></MDTypography>
					<Link to="/authentication/mi-sign-in" style={{ paddingTop: '12px' }}>
						<button className={styles.green_btn}>Back to login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)
			}
		</Fragment >
	);
};

export default EmailVerify;