# Ecommerce (Next.js+FastAPI+Supabase+Flow+Alembic)

## Variables de entorno

### Frontend (/frontend/.env.local)
NEXT_PUBLIC_API_URL= backend url ej: http://localhost:8000
NEXT_PUBLIC_SITE_URL=frontend url ej: http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=url pública de supabase ej: https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=publishable key de supabase ej: sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY= service_role secreta de supabase
SUPABASE_STORAGE_BUCKET=nombre del storage creado en supabase
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=llave de la api places de google, se debe conseguir en https://console.cloud.google.com/
PAYMENT_API_URL=url del backend que procesará los pagos, puede ser la misma que la pública ej: http://localhost:8000
INTERNAL_API_KEY= clave secreta que usará nextjs para llamar al payment api url, debes generarla y ponerla tanto en el frontend como en el backend
NEXT_PUBLIC_EMAILJS_SERVICE_ID=Se obtiene luego de crear una cuenta de emailjs y crear un servicio
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=Id de un template creado en emailjs, usar {{user_name}} {{user_email}} y {{message}} como variables
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=La public key de la cuenta que vas a usar con emailjs
[!WARNING] Es importante que las variables que no empiezan con next_public sean secretas, si se sospecha una filtración se deben generar nuevas lo antes posible

### Backend (/backend/.env)
ENVIRONMENT= puede ser development o production, por defecto es development, sirve para condicionar funcionalidades para que funcionen solo en caso de desarrollo o solo en caso de producción
SUPABASE_URL= supabase url pública de tu supabase, debería ser la misma que en next_public_supabase_url   
SUPABASE_SERVICE_ROLE_KEY= service_role secreta de supabase
FLOW_BASE_URL=url de flow, en desarrollo se puede usar sandbox ej: https://sandbox.flow.cl/api
FLOW_SECRET_KEY= llave secreta de tu cuenta de flow, lo puedes ver en integración con api en flow
FLOW_API_KEY= llave de tu cuenta de flow, se encuentra junto con la flow_secret_key en integraciones por apis
FLOW_RETURN_URL=url a donde se redirige al usuario luego de pagar, por defecto es http:url-frontend/checkout/success
FLOW_CONFIRMATION_URL=url que flow usa para confirmar la compra, por defecto es http://url-backend/webhook/flow
ALLOWED_ORIGINS=urls que pueden usar la api desde su front, se deben separar por comas ej: http://url-frontend1,http://url-frontend2
DATABASE_URL=url de la base de datos para conexión directa, se usa para migraciones con alembic, se encuentra en connect>Direct Connection string ej: postgresql://postgres:[YOUR-PASSWORD]@db.[SUPABASE_URL]:5432/postgres
APP_NAME=Nombre del ecommerce, se usa en la creación del pago con flow
INTERNAL_API_KEY=clave secreta de la api, debe ser la misma que INTERNAL_API_KEY del frontend/.env.local



## Configurar supabase
1. Agregar en Authentication URL Configuration para Redirect URLs la url para post authentication, por ejemplo http://localhost:3000/auth/callback
2. Ir a storage>Files crear un nuevo bucket público y elegir un nombre
[!NOTE] Luego este nombre se usa en las variables de entorno del frontend como SUPABASE_STORAGE_BUCKET



## Realizar las migraciones con alembic
Genera la estructura de la base de datos usando alembic en local usando la terminal
1. Crea el entorno virtual dentro de la carpeta backend: python -m venv venv
2. Instala dependencias: pip install -r requirements.txt
3. Ejecuta la migración: alembic upgrade head
[!IMPORTANT] No se puede hacer la migración sin configurar antes DATABASE_URL en /backend/.env

## Configurar iniciar sesión con google y places api
1.Ingresar a https://console.cloud.google.com/
2.Crear nuevo proyecto
3.Buscar pantalla de consentimiento de OAuth y configura un proyecto nuevo
4.Crear ID de client OAuth, agrega en "origenes autorizados de javascript" tu localhost y la url de supabase
5.Agrega en URIs de redireccionamiento autorizado la url de supabase ej: https://xxxxxxxxx.supabase.co/auth/v1/callback
6.Guarda el client ID y client secret de google
7.Luego en Sign In/Providers en supabase, habilita en "auth provider" Google y usa tu client ID y client secret
8.Habilita la api de places y restringe las urls que pueden usarla, luego copia la API KEY y usala como NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en el frontend

## Admin user
Usa el panel admin creando un usuario
1. Crear usuario en Supabase Auth
2. Copiar UUID
3. Ejecutar en SQL Editor:

UPDATE public.users 
SET role = 'admin' 
WHERE id = 'UUID copiado';


