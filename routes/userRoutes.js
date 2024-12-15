const express=require("express");
const { registerUser,
     loginUser, 
     logout, 
     forgotPassword, 
     resetPassword,
     getUserDetails, 
     updatePassword,
      updateProfile, 
      getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser, } = require("../controllers/userController");
const{isAuthenticateUser,authorizeRoles}=require("../middleware/auth")
const router =express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset").put(resetPassword);
router.route("/me").get(isAuthenticateUser,getUserDetails);
router.route("/password/update").put(isAuthenticateUser,updatePassword);
router.route("/me/update").put(isAuthenticateUser,updateProfile);
router.route("/logout").post(logout)

router
  .route("/admin/users")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticateUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticateUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteUser);





module.exports=router