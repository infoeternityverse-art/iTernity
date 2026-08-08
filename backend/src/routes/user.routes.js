import { Router } from 'express';
import {
  deleteUser,
  getUser,
  listUsers,
  sendPasswordResetLink,
  updateUser,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  deleteUserSchema,
  getUserSchema,
  listUsersSchema,
  sendPasswordResetLinkSchema,
  updateUserSchema,
} from '../validators/user.validator.js';

export const userRouter = Router();

userRouter.use(authenticate, requireAdmin);

userRouter.get('/', validate(listUsersSchema), listUsers);
userRouter.get('/:id', validate(getUserSchema), getUser);
userRouter.patch('/:id', validate(updateUserSchema), updateUser);
userRouter.post('/:id/send-password-reset', validate(sendPasswordResetLinkSchema), sendPasswordResetLink);
userRouter.delete('/:id', validate(deleteUserSchema), deleteUser);
