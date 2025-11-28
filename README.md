📱 App de Finanzas Personales

Esta es una pequeña app de finanzas personales hecha con Expo. Incluye un login simple (sin base de datos), algunas pantallas de ejemplo y un entorno listo para desarrollo o para correr en Docker.

🚀 Cómo instalar y correr la app
1. Instala dependencias

En la raíz del proyecto:

npm install

2. Configura tus variables de entorno

Crea un archivo .env con este contenido (o usa los valores que quieras):

EXPO_PUBLIC_LOGIN_USERNAME=demosebas@gmail.com
EXPO_PUBLIC_LOGIN_PASSWORD=finanzas123
EXPO_PUBLIC_LOGIN_HINT=demosebas@gmail.com / finanzas123


Estos datos sirven para entrar al login.

3. Inicia la app
npx expo start


Luego puedes abrirla desde:

Expo Go en tu celular

Un emulador Android

Un simulador de iOS

O desde el navegador

🔐 Sobre el login

El login no usa base de datos:
solo verifica usuario y contraseña con las variables del .env.

Si son correctos, guarda la sesión en el dispositivo.
Para cerrar sesión, ve a Settings → Cerrar sesión.

🐳 Correr la app con Docker 

Si prefieres usar Docker:

docker build -t gastosapp .
docker run --rm -it \
  -p 19000:19000 \
  -p 19001:19001 \
  -p 19002:19002 \
  -p 8081:8081 \
  gastosapp


Esto levanta el entorno de Expo dentro de un contenedor.

¿Qué es esta app?

Una base sencilla para una app de finanzas personales, ideal para:

gestionar gastos básicos

practicar React Native / Expo

probar flujos con login simple

usar un proyecto real para seguir aprendiendo

Puedes modificarla y adaptarla a tus necesidades.