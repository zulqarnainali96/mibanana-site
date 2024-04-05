import * as Yup from 'yup'

export const copyWritingSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    copy_writing_service: Yup.string().required('Service type is required'),
    word_count: Yup.string().required('Service type is required'),
    project_details: Yup.string().required('Project details is required'),
})

export const socialMediaSchema = Yup.object({
    project_title: Yup.string().min(3).required("Please enter your project title"),
    service_type: Yup.string().required('Service type is required'),
    platforms: Yup.string().required('Service type is required'),
    plan: Yup.string().required('Project details is required'),
    project_details: Yup.string().required('Project details is required'),

})