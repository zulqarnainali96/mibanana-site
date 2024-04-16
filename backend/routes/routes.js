const express = require('express')
const router = express.Router()
const parser = require("../storage_service/cloudinary")
const { createGraphicDesign, getGraphicProject, upadteProject, deleteGraphicProject, getCustomerFiles, duplicateProject, projectCompleted, projectAttend, projectForReview, deleteFile, projectOngoing, projectCancel, updateDriveLink, updateFigmaLink, getSingleProject, projectWidthRevision } = require('../controllers/graphicDesign')
const { postCompanyDetails,
    updateProfile,
    getCompanyDetails,
} = require("../controllers/profileSetting")
const multer = require('multer')
const uploadFiles = multer({
    storage: multer.memoryStorage()
})

const { createGraphicProject, getAssignGraphicProject, getDesignerList } = require('../controllers/Team-Members/Designers/designerProjects')
const { createChatController, getProjectChat, findChatWithIDs } = require('../controllers/chat/chat_controller')
const { fileUploader, getProfileData, updateCustomerProfile } = require('../controllers/cloudinary_control')
const { getBrandList, createBrand, deleteBrandList, updateBrandList, addMoreImages, UpdateAllBrandDetails, getSingleBrandFile } = require('../controllers/Brand/brandController')
const changePassword = require('../controllers/forgetPassControll')
const verifyToken = require('../controllers/verifyEmail/verify-email-control')
const { downloadFile, getFiles, uploadFile } = require('../google-cloud-storage/gCloudStorage')
const { designerUpload, getDesignerFiles, deleteDesigners, deleteDesignerFiles, designerUploadsOnVersion, getFilesOnVersionBasis, deleteFileOnVersionBasis } = require('../controllers/Projects/Graphic_design/designer_upload')
const { UploadProfileImage, UploadWithoutProfileImage } = require('../controllers/profile-image/profileImage')
const { getAllRequiredFields, createUserRole, getNewCustomerDetails, getNonActiveCustomer, deleteCurrentCustomer, updateCustomerDetails } = require('../controllers/userController')
const { postMessageToOtherMembers, getUserNotifications, updateChatMessage, updateAllChatMessage, getProjectNotifications, getProjectStatusNotifications } = require('../controllers/Notifications/notificationsController')
const { createCopyWritingProject, getCopyWritingProject, deleteCopyWritingProject, uploadFilesCopywrite } = require('../controllers/Projects/CopyWriting/copy-writing')

const { createSocialMediaProject, getSocialMediaProjects, deleteSocialMediaProject } = require('../controllers/Projects/social-media-manager/social-media-manager')
const { createWebsiteProject, getWebsiteProjects, deleteWebsiteProject } = require('../controllers/Projects/website/website')
const { createWebAppProject, getWebAppProjects, deleteWebAppProject } = require('../controllers/Projects/web-app/web-app')
const { createMobileAppProject, getMobileAppProjects, deleteMobileAppProject } = require('../controllers/Projects/mobile-dev/mobile-dev')


// Project Manager Route
router.post("/api/get-all-customer", getNonActiveCustomer)
router.patch("/api/udpate-customer", updateCustomerDetails)
router.get("/api/get-company-details/:id", getCompanyDetails)
router.delete("/api/delete-customer/:id", deleteCurrentCustomer)
// Route for required field afeter login
// router.post("/api/req-fields/:id", postRequiredFields)
router.post("/api/create-new-customer", getNewCustomerDetails) // Not added on api documentation
router.get("/api/get-req-fields/:id", getAllRequiredFields) // Not added on api documentation
router.post("/api/create-user", createUserRole)

// Route for Company profile Data
router.post("/settings/company-profile", postCompanyDetails)
router.get("/settings/company-profile/:id", getCompanyDetails)
router.patch("/settings/company-profile", updateProfile)


// Route for Creating Graphic Project Controller
router.get("/get-customer-files/:id", getCustomerFiles)
router.get("/graphic-project/:id", getGraphicProject)
router.delete("/graphic-project/:id", deleteGraphicProject)
router.post("/api/duplicate-project/:id", duplicateProject) 
router.get("/api/project-completed/:id", projectCompleted)
router.get("/api/attend-project/:id", projectAttend)
router.get("/api/cancel-project/:id", projectCancel)
router.post("/api/updating-drive-link", updateDriveLink)
router.post("/api/updating-figma-link", updateFigmaLink)
router.get("/api/ongoing-project/:id", projectOngoing) // Not added on api documentation
router.get("/api/for-review-project/:id", projectForReview)
router.get("/api/with-revision/:id", projectWidthRevision)
router.get("/api/get-project-by/:id", getSingleProject)
router.route("/graphic-project")
    .post(createGraphicDesign)
    .patch(upadteProject)

// router.get("/authentication/sign-in", graphicCategory)
// Route for Assigning project to Graphic getDesignerList

router.post("/assign-graphic-project", createGraphicProject) // Not added on api documentation
router.get("/assign-graphic-project/:id", getAssignGraphicProject) // Not added on api documentation


// get Designer List ===> project manager route
router.get("/api/get-designer-list/:id", getDesignerList)
router.delete("/api/del-designer-files/:id/:filename", deleteDesignerFiles) // Not added on api documentation
router.post("/api/delete-file", deleteFile)
router.put('/api/delete-designer', deleteDesigners)



// Saving chat message controller routes 
router.put("/chat-message", createChatController)
router.get("/chat-message/:id", getProjectChat)
router.post("/api/all-projects-ids", findChatWithIDs)

// // Route for Profile Data Cloudinary
router.post('/api/settings-profile', parser.single('avatar'), fileUploader)
router.post('/api/settings-update-profile', updateCustomerProfile)
router.get('/api/settings-profile/:id', getProfileData)


// Google Drive Route not tested 
// router.post("/api/upload-project-files", upload.array('files', 5), uploadProjectFiles)


// Route for creating and getting brand 
router.post("/api/brand", uploadFiles.array('files', 7), createBrand)
router.post("/api/add-more-files/:id", uploadFiles.array('files', 5), addMoreImages)
router.get("/api/brand/:id", getBrandList)
router.delete("/api/brand/:id", deleteBrandList)
router.patch("/api/brand", updateBrandList)
// router.post("/api/update-brand-details", uploadFiles.array('files', 5), UpdateAllBrandDetails) // Not added on api documentation
router.get("/api/get-single-brand-files/:id", getSingleBrandFile)

// Route for changing password 
router.put("/api/settings/forget-password", changePassword)

router.get("/auth/user/:id/verify/:token", verifyToken)


// Route for posting adding and get project files

router.post('/file/google-cloud/', uploadFiles.array('files', 7), uploadFile)
router.post('/file/get-files', getFiles)
router.get('/get-files/download/:name', downloadFile) // Not added on api documentation


// Route for Designer Uploading files releated to project

router.post('/api/designer-uploads/:id', uploadFiles.array('files', 5), designerUpload) // Not added on api documentation
router.post('/api/version-uploads/:version/:id', uploadFiles.array('files', 5), designerUploadsOnVersion)
router.get('/api/get-version-uploads/:version/:id', getFilesOnVersionBasis)

router.delete('/api/del-version-uploads/:version/:id', deleteFileOnVersionBasis) // Not added on api documentation

router.get('/api/designer-uploads/:id', getDesignerFiles) // Not added on api documentation


// Router For user profile image for Google Cloud

router.post('/api/user/profile/:id', uploadFiles.single('file', 1), UploadProfileImage)

router.post('/api/user/no-profile/:id', UploadWithoutProfileImage)


// Send Message to other those who are not online 
router.post('/api/send-message-to-others', postMessageToOtherMembers)
router.get('/api/get-notifications/:id', getUserNotifications) // Not added on api documentation
router.get('/api/udpate-notifications/:userId/:id', updateChatMessage) // Not added on api documentation
router.get('/api/udpate-all-notifications/:id', updateAllChatMessage) // Not added on api documentation
router.get('/api/project-notifications/:id', getProjectNotifications)
router.get('/api/project-status-notifications/:id', getProjectStatusNotifications) // Not added on api documentation


// CopyWriting routes 
router.post('/api/create-copywriting-project', createCopyWritingProject)
router.get('/api/get-copywriting-projects/:id', getCopyWritingProject)
router.delete('/api/delete-copywriting-project/:id', deleteCopyWritingProject)
router.post('/api/upload-copywriting-files/:id/:userId', uploadFiles.array('files', 5),uploadFilesCopywrite) 
router.post('/api/uploading-single-files/:id/:userId', uploadFiles.single('files', 1),uploadFilesCopywrite) 

// Social Media Projects

router.post("/api/create-social-media-project", createSocialMediaProject)
router.get("/api/get-social-media-projects/:id", getSocialMediaProjects)
router.delete("/api/delete-social-media-project/:id", deleteSocialMediaProject)


// Website Development 
router.post('/api/create-website-project', createWebsiteProject)
router.get('/api/get-website-projects/:id', getWebsiteProjects)
router.delete('/api/delete-website-project/:id', deleteWebsiteProject)


// Web App Development
router.post('/api/create-web-app-project', createWebAppProject)
router.get('/api/get-web-app-project/:id', getWebAppProjects)
router.delete('/api/delete-web-app-project/:id', deleteWebAppProject)


// Mobile App Development
router.post('/api/create-mobile-app-project', createMobileAppProject)
router.get('/api/get-mobile-app-projects/:id', getMobileAppProjects)
router.delete('/api/delete-mobile-app-project/:id', deleteMobileAppProject)

module.exports = router 