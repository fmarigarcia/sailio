# Directorio para paquetes compartidos

Este directorio contendrá paquetes compartidos entre aplicaciones:

- `shared/` - Tipos, utilidades y código compartido
- `config/` - Configuraciones compartidas (eslint, tsconfig, etc.)
- `ui/` - Componentes UI compartidos (si aplica)

Cada paquete debe tener su propio `package.json` y estar configurado como workspace de pnpm.
