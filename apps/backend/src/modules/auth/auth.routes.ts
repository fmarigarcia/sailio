import { Router } from 'express';
import { authController } from './auth.controller';

const router: Router = Router();

/**
 * @route   POST /auth/register
 * @desc    Registra un nuevo usuario
 * @access  Public
 */
router.post('/register', (req, res, next) => {
  void authController.register(req, res, next);
});

/**
 * @route   POST /auth/login
 * @desc    Autentica un usuario y retorna tokens
 * @access  Public
 */
router.post('/login', (req, res, next) => {
  void authController.login(req, res, next);
});

/**
 * @route   POST /auth/refresh
 * @desc    Renueva el access token usando un refresh token
 * @access  Public
 */
router.post('/refresh', (req, res, next) => {
  void authController.refresh(req, res, next);
});

/**
 * @route   POST /auth/logout
 * @desc    Cierra sesión revocando el refresh token
 * @access  Public
 */
router.post('/logout', (req, res, next) => {
  void authController.logout(req, res, next);
});

export default router;
