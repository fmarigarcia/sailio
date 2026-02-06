# Spinner / LoadingIndicator

Componente universal de carga para **Sailio**.

## 🎯 Propósito

Indicador de carga centralizado que evita implementaciones custom en cada módulo. Garantiza consistencia visual y accesibilidad en toda la aplicación.

## ✨ Características

- ✅ Múltiples tamaños (small, medium, large)
- ✅ Variantes de uso (inline, centered, overlay)
- ✅ Texto opcional de carga
- ✅ Accesibilidad completa (ARIA, screen readers)
- ✅ Respeta `prefers-reduced-motion`
- ✅ Tokens de diseño

## 📦 Uso

### Importación

```tsx
import { Spinner } from '@/ui';
```

### Casos de Uso

#### 1. En Botones (Loading State)

```tsx
<Button disabled>
  <Spinner size="small" variant="inline" />
  Guardando...
</Button>
```

#### 2. En Secciones / Tablas

```tsx
function AthletesList() {
  const { data, isLoading } = useAthletes();

  if (isLoading) {
    return <Spinner variant="centered" label="Cargando atletas..." />;
  }

  return <Table data={data} />;
}
```

#### 3. Full Page Loading (con overlay)

```tsx
function App() {
  const { isInitializing } = useAuth();

  return (
    <>
      {isInitializing && <Spinner variant="overlay" size="large" label="Iniciando sesión..." />}
      <MainContent />
    </>
  );
}
```

## 🎨 Props

```tsx
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'; // Default: 'medium'
  variant?: 'inline' | 'centered' | 'overlay'; // Default: 'inline'
  label?: string; // Texto opcional
  className?: string; // Clases adicionales
  ariaLabel?: string; // Default: 'Loading...'
}
```

## 📐 Tamaños

| Size   | Tamaño | Uso Recomendado                 |
| ------ | ------ | ------------------------------- |
| small  | 16px   | Botones, texto inline           |
| medium | 32px   | Secciones, cards, tablas        |
| large  | 48px   | Full-page, procesos importantes |

## 🎭 Variantes

### `inline`

- Display inline-flex
- Para usar dentro de botones o texto
- No afecta el layout

### `centered`

- Display flex con width 100%
- Centrado vertical y horizontal
- Min-height de 200px

### `overlay`

- Position fixed cubriendo viewport
- Backdrop oscuro semi-transparente (z-index 9998-9999)
- ⚠️ **Usar con cuidado**: bloquea toda la UI

## ♿ Accesibilidad

- `role="status"` para anuncios en screen readers
- `aria-label` configurable
- Texto visualmente oculto pero accesible
- Respeta `prefers-reduced-motion` (animación más lenta)

## ⚠️ Buenas Prácticas

### ✅ Hacer

```tsx
// En estados de loading de botones
<Button disabled={isLoading}>
  {isLoading ? <Spinner size="small" /> : null}
  Guardar
</Button>;

// En carga de contenido
{
  isLoading ? <Spinner variant="centered" label="Cargando..." /> : <ContentComponent />;
}
```

### ❌ Evitar

```tsx
// ❌ NO usar overlay para operaciones rápidas
<Spinner variant="overlay" /> // Solo para procesos >3 segundos

// ❌ NO omitir el label en variantes centered/overlay
<Spinner variant="centered" /> // Sin contexto visual

// ❌ NO crear spinners custom
<div className="my-custom-spinner"></div> // Usar Spinner del design system
```

## 🧪 Testing

El componente tiene **100% de cobertura** en:

- Renderizado básico
- Todas las propiedades
- Accesibilidad
- Estructura DOM

Ver: [`__tests__/spinner.test.tsx`](./__tests__/spinner.test.tsx)

## 🎨 Storybook

Ver todas las variantes y ejemplos interactivos en:

```bash
pnpm storybook
```

→ **UI/Feedback/Spinner**

## 🔗 Relacionado

- [Button](../Button/) - Usa Spinner en loading state
- [Modal](../Modal/) - Puede usar Spinner en contenido
- [Table](../Table/) - Usa Spinner mientras carga datos
