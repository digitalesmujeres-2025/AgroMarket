
# Mercado Campesino (AgroMarket)

## Descripción

El mercado campesino siempre a sido parte importante en nuestra economía a nivel local y nacional, sin embargo, existen muchas dificultades que limitan a las familias campesinas distribuir eficientemente sus productos a mas hogares Colombianos, por eso, buscamos impulsar el mercado campesino por medio del desarrollo web de **AgroMarket**, que les permita a estas familias llegar a más corazones Colombianos.

## Objetivo

Ofrecer un espacio virtual que permita a los usuarios tener la comodidad de comprar y vender productos agrícolas, eliminando las barreras geopolíticas entre familias campesinas y potenciales clientes.

## Funcionalidades
Dentro del sistema tendremos funciones como:

- Registro y gestión de usuarios (Cliente, Productor, Administrador)
- Catalogo de productos
- Publicación de productos agrícolas
- Compra y venta de productos
- Consulta y facturación de pedidos
- Consulta de envíos

## Roles de Usuario

**👨Cliente** Navegar en diferentes catálogos para adquirir productos.

**👩‍🌾Productor** Publicar, gestionar sus productos y poder visualizar sus ventas.

**🎮Administrador** Gestionar usuarios y generar reportes.

## Rutas principales

**Productor:**
- `/Productor/crearProducto`
- `/Productor/editarProducto`
- `/Productor/eliminarProducto`
- `/Productor/gestionarVentas`
- `/Productor/editarPerfil`

**Cliente:**  
- `/Cliente/registro` 
- `/Cliente/ingreso`
- `/Cliente/editarPerfil` 
- `/Cliente/explorar`  
- `/Cliente/comprar`
- `/Cliente/consultarCompra`

**Administrador:**  
- `/admin/gestionarUsuarios`  
- `/admin/gestionarProductos`  
- `/admin/reportes`

## Roles de las integrantes

**Catherine Arias Ramos** Lider de proyecto / Back end

**Sisney Franco Quinchía** Validaciones / Back end

**Maria Camila Alarcon Fernandez** Seguridad / Back end

**Erika Andrea Gonzalez Ramos** Logica / Back end

## Variables de entorno

### Base de Datos
DB_NAME=nombre_de_tu_base_de_datos
DB_HOST=host_de_tu_servidor
DB_PORT=puerto_de_conexion
DB_USERNAME=usuario_de_postgres
DB_PASSWORD=contraseña_de_postgres

### Autenticación JWT
JWT_SECRET=clave_secreta_para_generar_tokens

## Pruebas Unitarias
Se implementaron pruebas unitarias por medio de la ejecucion de los archivos de cada entidad terminados en **.spec.ts**, adicionalmente, se realizaron pruebas de las rutas de cada entidad gracias a las herramientas **Postman** y **Swagger**.

Gracias a esto, podimos observar y validar la correcta entrada de datos y las salidas de las validaciones esperadas.

## Instrucciones para ejecutar la API localmente

1. Clonar el repositorio.
2. Instalar las dependencias con **npm install**.
3. Configura tus variables de entorno en un archivo **.env**, puedes guiarte de nuestro **.env.example**.
4. Asegurate de que tu base de datos en PostgreSQL esta activa.
5. Iniciar el servidor desde la terminal con **npm run start:dev** (asegurate de estar ubicado en el archivo del repositorio).