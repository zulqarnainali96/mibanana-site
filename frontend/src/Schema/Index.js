import * as Yup from 'yup'

export const copyWritingSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    copy_writing_service: Yup.string().required('Service type is required'),
    word_count: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
    brand: Yup.object(),
});

export const socialMediaSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    service_type: Yup.string().required('Service type is required'),
    platforms: Yup.string().required('Service type is required'),
    plan: Yup.string().required('Project details is required'),
    project_description: Yup.string().required('Project details is required'),
    brand: Yup.object(),

});

export const webDevelopmentSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    website_type: Yup.string().required('Service type is required'),
    preferred_stack: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
    brand: Yup.object(),
});

export const webAppSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    preferred_stack: Yup.string().required('Service type is required'),
    backend_tech: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
    brand: Yup.object(),
});

export const mobileAppSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    platform: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project description is required'),
    brand: Yup.object(),
});

export const groupChatSchema = Yup.object({
    group_name: Yup.string()
        .min(4, "Group name must be at least 4 characters long")
        .required("Please enter your group name"),  
    // participants:  Yup.array().of(Yup.string().required('Each participant ID is required')).required('Participants are required'),
    group_description: Yup.string()
        .max(300, 'Group description must be at most 300 characters long')
        .notRequired()
});

export const emailSchema = Yup.object({
    email: Yup.string().email().required('Email is required'),
});

export const resetPassword = Yup.object({
    new_password: Yup.string().min(6, 'password have be atleast 6 charachters').required("Please enter your password"),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match').required('Confirm password is required'),
});