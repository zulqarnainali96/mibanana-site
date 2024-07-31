import * as Yup from 'yup'

export const copyWritingSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    copy_writing_service: Yup.string().required('Service type is required'),
    word_count: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
});

export const socialMediaSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    service_type: Yup.string().required('Service type is required'),
    platforms: Yup.string().required('Service type is required'),
    plan: Yup.string().required('Project details is required'),
    project_description: Yup.string().required('Project details is required'),

});

export const webDevelopmentSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    website_type: Yup.string().required('Service type is required'),
    preferred_stack: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
});

export const webAppSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    preferred_stack: Yup.string().required('Service type is required'),
    backend_tech: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project details is required'),
});

export const mobileAppSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    platform: Yup.string().required('Service type is required'),
    project_description: Yup.string().required('Project description is required'),
});

export const groupChatSchema = Yup.object({
    group_name: Yup.string().min(4).required("Please enter your group name"),
    // participants:  Yup.array().of(Yup.string().required('Each participant ID is required')).required('Participants are required'),
    group_description: Yup.string().max(600, 'Group description must be at most 300 characters long').notRequired()
});