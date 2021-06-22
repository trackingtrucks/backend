# Autenticacion
## Indice
1. [Login](#login)
2. [Registro](#registro)
   1. [De administradores](#De%20administradores)
   2. De gestores y conductores   
---
## **Login**
Usado para obtener el token de un usuario registrado.

**URL** : `/auth/login/`

**Metodo** : `POST`

**Autenticacion requerida** : NO

**Parametros de la solicitud (body)**

```json
{
    "email": "[direccion de email valida]",
    "password": "[contraseña en texto plano]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
```
### Respuesta del servidor

```json
{
    "response":{
        "Informacion del usuario"
    },
    "accessToken": "[jwt token]",
    "refreshToken": "[jwt token]",
    "ATExpiresIn": "[fecha de expiracion del accessToken]",
    "RTExpiresIn": "[fecha de expiracion del refreshToken]"
}
```
---
## **Registro**
## De administradores
Usado para crear una nueva cuenta con permisos de administrador.

**URL** : `/auth/register/admin/`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: ADMIN

**Parametros de la solicitud (body)**

```json
{
    "email": "[direccion de email valida]",
    "password": "[contraseña en texto plano]",
    "nombre": "[nombre del usuario a crear]",
    "apellido": "[apellido del usuario a crear]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de administrador>
```

### Respuesta del servidor

```json
{
    "response":{
        "Informacion del usuario"
    },
    "accessToken": "[jwt token]",
    "refreshToken": "[jwt token]",
}
```
---
## De gestores y conductores
Usado para crear una nueva cuenta con permisos de gestor o conductor.

**URL** : `/auth/register/`

**Metodo** : `POST`

**Autenticacion requerida**: NO

**Parametros de la solicitud (body)**

```json
{
    "email": "[direccion de email valida]",
    "password": "[contraseña en texto plano]",
    "nombre": "[nombre del usuario a crear]",
    "apellido": "[apellido del usuario a crear]",
    "codigo":"[codigo unico de registro]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
```

### Respuesta del servidor (Gestor)

```json
{
    "response":{
        "Informacion del usuario"
    },
    "accessToken": "[jwt token]",
    "refreshToken": "[jwt token]",
}
```
---