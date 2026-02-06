# Prompt: Crear Nuevo Módulo Frontend

## Objetivo
Crear un nuevo módulo frontend siguiendo la arquitectura modular por dominio de Sailio.

## Instrucciones para GitHub Copilot

Por favor, crea un nuevo módulo frontend llamado `{NOMBRE_MODULO}` con la siguiente estructura:

```
apps/frontend/src/modules/{NOMBRE_MODULO}/
  hooks/
    __tests__/
      use{Nombre}.test.ts
    use{Nombre}.ts
    index.ts
  components/
    __tests__/
      {Component}.test.tsx
    {Component}.tsx
    {Component}.css
    index.ts
  pages/
    {page}/
      __tests__/
        {page}.test.tsx
        use{Page}.test.ts
      index.ts
      {page}.tsx
      {page}.css
      use{Page}.ts
  {NOMBRE_MODULO}.api.ts
  {NOMBRE_MODULO}.routes.tsx
  {NOMBRE_MODULO}.types.ts
  index.ts
```

### Requisitos:

1. **{NOMBRE_MODULO}.api.ts**:
   - SOLO llamadas al backend y mapeo de datos
   - NO maneja estado ni lógica de UI
   - Usar cliente HTTP de `shared/http`
   - Ejemplo:
   ```typescript
   export const {modulo}Api = {
     getAll: async () => {
       const response = await api.get('/api/{modulo}');
       return response.data;
     }
   };
   ```

2. **hooks/**:
   - Custom hooks que orquestan datos, estado y efectos
   - NO contienen JSX
   - Lógica reutilizable del dominio
   - Tests completos con `@testing-library/react-hooks`

3. **components/**:
   - Componentes específicos del dominio
   - Usan componentes de `ui/` (design system)
   - NO definen estilos base (usar tokens CSS)
   - Tests con `@testing-library/react`

4. **pages/{page}/**:
   - `{page}.tsx`: Componente de la página (solo UI)
   - `use{Page}.ts`: Hook con toda la lógica de la página
   - `{page}.css`: Estilos específicos (usando tokens CSS)
   - `__tests__/`: Tests de página y hook

5. **{NOMBRE_MODULO}.routes.tsx**:
   - Definir rutas del módulo con lazy loading
   - Layouts específicos si necesarios
   - Ejemplo:
   ```typescript
   export const {modulo}Routes = {
     path: '/{modulo}',
     element: <{Modulo}Layout />,
     children: [
       { path: '', element: lazy(() => import('./pages/list')) },
       { path: ':id', element: lazy(() => import('./pages/detail')) },
     ]
   };
   ```

6. **{NOMBRE_MODULO}.types.ts**:
   - SOLO si hay tipos propios del negocio
   - NO para DTOs triviales

7. **index.ts**:
   - Exportar lo público del módulo
   - No exportar hooks/componentes internos innecesariamente

### Reglas Importantes:

- ✅ TODO traducido con I18N (español e inglés)
- ✅ Sin strings hardcoded en JSX
- ✅ Sin estilos inline (`style={{}}`)
- ✅ Usar tokens CSS (variables) para colores, spacing, fonts
- ✅ Máximo 300 líneas por archivo (excepto tests)
- ✅ Complejidad ciclomática ≤ 15
- ✅ Sin console.log
- ✅ Sin tipo `any`
- ✅ Cumplir rules-of-hooks
- ✅ Tests con cobertura ≥ 80%

### Internacionalización (I18N):

Crear traducciones en:
```
apps/frontend/src/locales/
  es/{NOMBRE_MODULO}.json
  en/{NOMBRE_MODULO}.json
```

Estructura ejemplo:
```json
{
  "{modulo}": {
    "title": "Título",
    "subtitle": "Subtítulo",
    "actions": {
      "create": "Crear",
      "edit": "Editar",
      "delete": "Eliminar"
    },
    "fields": {
      "name": "Nombre",
      "description": "Descripción"
    },
    "messages": {
      "success": "Operación exitosa",
      "error": "Error al realizar la operación"
    }
  }
}
```

### Páginas Requeridas:

{DESCRIBIR PÁGINAS NECESARIAS}

Ejemplo:
- Lista de {entidades} (con paginación, filtros, búsqueda)
- Detalle de {entidad}
- Crear nueva {entidad}
- Editar {entidad}

### Componentes Específicos:

{DESCRIBIR COMPONENTES ESPECÍFICOS DEL DOMINIO}

Ejemplo:
- {Entidad}Card
- {Entidad}Form
- {Entidad}Filters
- {Entidad}Table

### Hooks Personalizados:

{DESCRIBIR HOOKS NECESARIOS}

Ejemplo:
- use{Entidades} - Fetch lista con paginación
- use{Entidad} - Fetch detalle por ID
- useCreate{Entidad} - Crear nueva entidad
- useUpdate{Entidad} - Actualizar entidad
- useDelete{Entidad} - Eliminar entidad

### Integración con Backend:

Endpoints a consumir:
- GET `/api/{modulo}` - Listar
- GET `/api/{modulo}/:id` - Detalle
- POST `/api/{modulo}` - Crear
- PUT `/api/{modulo}/:id` - Actualizar
- DELETE `/api/{modulo}/:id` - Eliminar

### Testing:

1. **Tests de Hooks**:
   - Casos de éxito
   - Manejo de errores
   - Estados loading
   - Mocks de API

2. **Tests de Componentes**:
   - Rendering correcto
   - Interacciones (clicks, inputs)
   - Props variants
   - Estados (loading, error, empty)

3. **Tests de Páginas**:
   - Rendering de layout
   - Integración de componentes
   - Navegación
   - Traducciones (ambos idiomas)

## Checklist de Validación:

- [ ] Estructura correcta del módulo
- [ ] API calls en `{modulo}.api.ts` solamente
- [ ] Hooks sin JSX, solo lógica
- [ ] Componentes usan componentes de `ui/`
- [ ] Páginas con lógica separada en hooks
- [ ] Rutas con lazy loading
- [ ] TODO traducido (es + en)
- [ ] Sin strings hardcoded
- [ ] Sin estilos inline
- [ ] Usa tokens CSS
- [ ] Tests con cobertura ≥ 80%
- [ ] Sin linting errors
- [ ] Commits one-liner
- [ ] Traducciones completas en ambos idiomas

## Ejemplo de Uso:

Consulta el módulo `auth` como referencia de implementación.

## Componentes UI a Reutilizar:

{LISTAR COMPONENTES DEL DESIGN SYSTEM QUE SE USARÁN}

Ejemplo:
- Button
- Input
- Card
- Modal
- Table
- Pagination
