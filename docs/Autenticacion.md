# **Autenticacion**
## **Indice**
1. [Login](#login)
2. [Registro](#registro)
   1. [De administradores](#De-administradores)
   2. [De gestores y conductores](#De-gestores-y-conductores) 
3. [Tokens](#Tokens)
   1. [Nuevo access token](#Nuevo-access-token)
   2. [Eliminar refresh token](#Eliminar-Refresh-Token)
   3. [Eliminar todos los Refresh Token](#Eliminar-Todos-los-Refresh-Token)
---
# Login
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
    "perfil":{
        "Informacion del usuario"
    },
    "accessToken": "[jwt token]",
    "refreshToken": "[jwt token]",
    "ATExpiresIn": "[fecha de expiracion del accessToken]",
    "RTExpiresIn": "[fecha de expiracion del refreshToken]"
}
```
---
# Registro
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
    "perfil":{
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
    "perfil":{
        "Informacion del usuario"
    },
    "accessToken": "[jwt token]",
    "refreshToken": "[jwt token]",
}
```

### Respuesta del servidor (Conductor)

```json
{
    "message": "Usuario creado con éxito!"
}
```
---
# Tokens
## Nuevo Access Token

Usado para solicitar un nuevo access token utilizando el refresh token

**URL** : `/auth/token/`

**Metodo** : `GET`

**Autenticacion requerida**: SI (Refresh Token)

**Parametros de la solicitud (headers)**

```txt
x-refresh-token: <refreshToken del usuario>
```

### Respuesta del servidor

```json
{
    "accessToken": "[jwt token]"
}
```
---
## Eliminar Refresh Token

Usado para anular un refresh token, cerrando sesion del dispositivo e impidiendo que se creen nuevos access  tokens.

**URL** : `/auth/token/`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Parametros de la solicitud (headers)**

```txt
x-refresh-token: <refreshToken a eliminar>
x-access-token: <accessToken valido>
```

### Respuesta del servidor

```json
{
    "message": "Token revoked"
}
```
---
## Eliminar Todos los Refresh Token

Usado para anular todos los refresh token de la cuenta, cerrando sesion en todos los dispositivos e impidiendo que se creen nuevos access tokens.

**URL** : `/auth/tokens/`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Parametros de la solicitud (body)**

```json
{
    "password": "[contraseña del usuario]",
}   
```

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken valido>
```

### Respuesta del servidor

**Codigo**: `204 (No content)`

---