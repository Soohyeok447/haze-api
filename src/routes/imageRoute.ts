import { Router } from 'express';
import upload from '../middlewares/multer';
import ImageController from '../controllers/imageController';
// import ImageService from '../services/imageService';

const imageRouter = Router();

// images 이미지 여러장 POST
imageRouter.post('/', upload.array('images'), ImageController.uploadImages);

// image 이미지 1장 POST
imageRouter.post('/single', upload.single('image'), ImageController.uploadImage);

//TODO GET 이미지

//TODO GET 이미지들

export default imageRouter;