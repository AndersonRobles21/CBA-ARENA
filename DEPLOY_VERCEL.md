Preparación para desplegar en Vercel

Pasos rápidos:

- Subir el repo a Git (GitHub/GitLab/Bitbucket).
- En Vercel, "Import Project" → seleccionar el repo.
- En la sección Environment Variables (Project Settings) añadir las variables necesarias (Production):
  - DB_HOST
  - DB_PORT
  - DB_NAME
  - DB_USER
  - DB_PASSWORD
  - JWT_SECRET
  - Any other DB-related or third-party keys you use

Notas técnicas:
- El archivo `vercel.json` ya configura:
  - Build de `frontend` usando `frontend/package.json` y salida en `dist/frontend/browser`.
  - La función serverless `api/index.ts` para las rutas `/api/*`.

Recomendaciones:
- Asegúrate de que las variables de conexión a la base de datos permitan conexiones desde Vercel (IP/SSL según tu proveedor).
- Si la base de datos requiere SSL, ya está configurado `rejectUnauthorized: false` en la conexión.
- Revisa los logs de funciones en Vercel para ver errores de conexión o permisos.

Comandos locales útiles:

```bash
# Build frontend localmente
npm --prefix frontend run build

# Levantar backend local (desarrollo)
cd backend
npm install
npm run dev
```

Si quieres, puedo:
- Mover lógica pesada (migraciones/`initDb`) fuera del cold-start de la función.
- Añadir `serverless-http` para una mejor compatibilidad si Vercel requiere un handler explícito.
- Verificar que el `dist` de Angular coincide con `vercel.json` (si quieres lo construyo y compruebo).
