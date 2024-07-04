import { Router } from 'express';
import { createCategory, deleteAllCategories, deleteCategory, getCategories, getCategory } from '../controllers/category.controller';
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator } from '../middlewares/validators/category.validators';

const router = Router();

router.post('/new', createCategoryValidator, createCategory);
router.get('/all', getCategories);
router.get('/category/:id', getCategoryValidator, getCategory);
router.delete('/category/:id', deleteCategoryValidator, deleteCategory);
router.delete('/delete_all', deleteAllCategories);

export default router;
