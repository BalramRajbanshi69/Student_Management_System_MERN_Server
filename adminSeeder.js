const User = require("./models/User");
const bcrypt = require("bcryptjs")


const adminSeeder = async()=>{  
     const isAdminExist = await User.findOne({email:"admin@gmail.com"});
    
    if(!isAdminExist){
        await User.create({
        email:"admin@gmail.com",
        password: bcrypt.hashSync("admin",10),
        name:"admin",
        role :"admin"
        })
        console.log("Admin seeded successfully");
    }else{
        console.log("Admin already seeded");
        
    }
}

module.exports = adminSeeder



