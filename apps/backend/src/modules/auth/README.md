# Módulo de Autenticación

Sistema completo de autenticación con JWT, refresh tokens y rotación de tokens para seguridad.

## 🏗️ Arquitectura

El módulo sigue los principios SOLID y la arquitectura por dominio establecida:

```
modules/auth/
├── __tests__/
│   ├── auth.service.test.ts         # Tests unitarios (✓ 9/9)
│   └── auth.integration.test.ts     # Tests de integración
├── auth.controller.ts               # Traducción HTTP → Dominio
├── auth.routes.ts                   # Definición de endpoints
├── auth.schemas.ts                  # Validación con Zod
├── auth.service.ts                  # Lógica de negocio
└── auth.types.ts                    # Tipos del dominio
```

## 🚀 Endpoints Disponibles

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

**Body:**

```json
{
  "email": "coach@sailio.com",
  "password": "Password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+34612345678",
  "certificationLevel": "Advanced",
  "clubAffiliation": "Club Náutico Madrid"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "coach@sailio.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      ...
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### POST /api/auth/login

Autentica un usuario existente.

**Body:**

```json
{
  "email": "coach@sailio.com",
  "password": "Password123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### POST /api/auth/refresh

Renueva el access token usando un refresh token válido.

**Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### POST /api/auth/logout

Cierra sesión revocando el refresh token.

**Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "message": "Sesión cerrada exitosamente"
  }
}
```

## 🔐 Seguridad

### Tokens

- **Access Token**: Corta duración (15 minutos por defecto)
- **Refresh Token**: Larga duración (7 días por defecto)
- Rotación automática de refresh tokens
- Token families para detectar reutilización

### Password Requirements

- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número

### Protección contra Ataques

- Revocación automática de token families si se detecta reutilización
- Refresh tokens hasheados en la base de datos
- Tracking de dispositivos, IP y user-agent

## 🔧 Middleware de Autenticación

### authenticate

Protege rutas que requieren autenticación obligatoria:

```typescript
import { authenticate } from '../../shared/middleware';

router.get('/protected', authenticate, (req, res) => {
  const { userId, email } = (req as AuthRequest).user;
  // ...
});
```

### optionalAuthenticate

Para rutas donde la autenticación es opcional:

```typescript
import { optionalAuthenticate } from '../../shared/middleware';

router.get('/public', optionalAuthenticate, (req, res) => {
  const user = (req as AuthRequest).user;
  // user puede ser undefined
});
```

## ⚙️ Configuración

Variables de entorno necesarias (en `.env`):

```env
# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sailio
```

## 🧪 Tests

### Ejecutar tests unitarios

```bash
pnpm test auth
```

### Tests de integración

Los tests de integración requieren una base de datos de test configurada:

```bash
# 1. Crear base de datos de test
DATABASE_URL="postgresql://user:password@localhost:5432/sailio_test" pnpm prisma:migrate

# 2. Ejecutar tests
DATABASE_URL="postgresql://user:password@localhost:5432/sailio_test" pnpm test auth
```

## 📊 Cobertura de Tests

- ✅ Tests unitarios: 9/9 pasando
- ⚠️ Tests de integración: Requieren configuración de BD

## 🔄 Flujo de Autenticación

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Service
    participant DB

    Client->>API: POST /auth/login
    API->>Service: login(credentials)
    Service->>DB: Buscar usuario
    Service->>Service: Verificar password
    Service->>Service: Generar tokens
    Service->>DB: Guardar refresh token
    Service->>API: { user, tokens }
    API->>Client: 200 OK

    Note over Client: Usa access token en cada request

    Client->>API: GET /api/resource (Header: Bearer token)
    API->>Service: verifyAccessToken()
    Service->>API: { userId, email }
    API->>Client: 200 OK + data

    Note over Client: Cuando access token expira

    Client->>API: POST /auth/refresh
    API->>Service: refreshToken()
    Service->>DB: Verificar refresh token
    Service->>DB: Revocar token viejo
    Service->>DB: Crear nuevo token
    Service->>API: { newTokens }
    API->>Client: 200 OK
```

## 📝 Errores Comunes

- **401 Unauthorized**: Token inválido o expirado
- **409 Conflict**: Email ya registrado
- **403 Forbidden**: Usuario inactivo o email no verificado
- **400 Bad Request**: Validación de datos fallida

## 🚧 Próximas Mejoras

- [ ] Verificación de email con código OTP
- [ ] Reset de contraseña vía email
- [ ] 2FA (Two-Factor Authentication)
- [ ] Rate limiting por endpoint
- [ ] OAuth2 (Google, GitHub, etc.)
