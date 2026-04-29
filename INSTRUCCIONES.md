# COPILOTO PNP — Instrucciones de Instalación
# Versión con Google Gemini (GRATUITO)

---

## PASO 1 — Obtener tu clave API de Google Gemini (GRATIS)

1. Entra a: https://aistudio.google.com
2. Inicia sesión con tu cuenta de Gmail
3. Click en "Get API Key" (esquina superior izquierda)
4. Click en "Create API key"
5. Selecciona "Create API key in new project"
6. COPIA la clave (empieza con "AIza...")

✅ Sin tarjeta. Sin pago. 1,500 consultas gratis por día.

---

## PASO 2 — Poner tu clave en el código

Abre el archivo: src/App.jsx
Busca esta línea:
  const GEMINI_API_KEY = "TU_CLAVE_GEMINI_AQUI";

Reemplaza con tu clave real:
  const GEMINI_API_KEY = "AIza...tu-clave...";

---

## PASO 3 — Subir a GitHub

1. github.com → "+" → "New repository"
2. Nombre: copiloto-pnp → "Create repository"
3. Click "uploading an existing file"
4. Arrastra TODOS los archivos de esta carpeta
5. Click "Commit changes"

---

## PASO 4 — Publicar en Netlify

1. netlify.com → "Add new site" → "Import an existing project"
2. Elige GitHub → selecciona "copiloto-pnp"
3. Build command:    npm run build
4. Publish directory: dist
5. Click "Deploy site" → espera 2-3 minutos
6. Tu URL: copiloto-pnp.netlify.app

Comparte esa URL por WhatsApp con tus colegas.
