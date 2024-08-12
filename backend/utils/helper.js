module.exports.findRole = (users) => {
    if(users?.roles.includes("Admin")){
        return {
            admin : true
        } 
    }
    if(users?.roles.includes("Project-Manager")){
        return {
            projectManager : true
        } 
    }
    if(users?.roles.includes("Graphic-Designer") || users?.roles.includes("Web-Developer") || users?.roles.includes("Social-Media-Manager") || users?.roles.includes("Copy-Writer") || (users?.roles.includes("Mobile-App-Developer"))){
        return {
            teamMember : true
        } 
    }
    if(users?.roles.includes("Customer")){
        return {
            customer : true
        } 
    }
}