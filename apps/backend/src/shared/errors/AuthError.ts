import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Credenciales inválidas') {
    super(message, 401);
  }
}

export class EmailNotVerifiedError extends AppError {
  constructor(message = 'Email no verificado') {
    super(message, 403);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message = 'Token expirado') {
    super(message, 401);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message = 'Token inválido') {
    super(message, 401);
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(message = 'El email ya está registrado') {
    super(message, 409);
  }
}

export class UserInactiveError extends AppError {
  constructor(message = 'Usuario inactivo') {
    super(message, 403);
  }
}

export class TokenRevokedError extends AppError {
  constructor(message = 'Token revocado por seguridad') {
    super(message, 401);
  }
}
