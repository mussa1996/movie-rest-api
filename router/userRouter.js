import express from 'express' 
const router = express.Router();
import userControl from '../controller/userController.js'
import auth from '../middleware/auth.js'
router.post('/create',userControl.createUser)
router.post('/login',userControl.loginUser)
router.post('/logout',auth,userControl.logout)
router.put('/forgetpassword',userControl.forgetPassword)
router.put('/resetpassword',userControl.resetPassword)
router.delete('/delete/:id',userControl.deleteUser)
router.post('/email-activate',userControl.activateAccount)

module.exports = router;