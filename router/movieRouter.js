import express from 'express'
const router = express.Router();
import movieControl from '../controller/movieController.js'
import auth from '../middleware/auth.js'

router.post('/create',auth,movieControl.postMovie);
router.get('/listAll',auth,movieControl.getMovie);
router.get('/listOne/:id', auth,movieControl.getOneMovie);
router.patch('/update/:id',auth, movieControl.updateMovie);
router.delete('/delete/:id',auth, movieControl.deleteMovie);
module.exports = router; 