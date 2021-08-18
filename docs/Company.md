# **Compania**
## **Indice**
1. [Devolver info de la compania](#Devolver-datos-de-la-compania)
2. [Devolver un vehiculo en especifico](#devolver-un-vehiculo-en-especifico)
3. [Devolver un usuario en especifico](#devolver-un-usuario-en-especifico)
4. [Codigos de registro](#codigos-de-registro)
   1. [Gestor](#de-gestor)
   2. [Conductor](#de-conductor)

---
# Devolver datos de la compania
Usado para que el gestor reciba toda la informacion de su compania.

**URL** : `/company`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR


**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
    "gestores":[
        "Array con todos los gestores de la compañia"
    ],
    "conductores":[
        "Array con todos los conductores de la compañia"
    ],
    "vehiculos":[
        "Array con todos los vehiculos de la compañia"
    ],
    "turnos":[
        "Array con todos los turnos de la compañia"
    ]
}
```
---
# Devolver un vehiculo en especifico
Usado para obtener la informacion de un vehiculo en especifico (dentro de la companía).

**URL** : `/company/vehiculo`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol minimo requerido**: CONDUCTOR

**Parametros de la solicitud (body)**

```json
{
    "id": "[id del vehiculo a solicitar]",
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken del usuario>
```

### Respuesta del servidor

```json
{
    "vehiculo": {
        ["OBJETO DEL VEHICULO"]
    }
}
```
---
# Devolver un usuario en especifico
Usado para obtener la informacion de un usuario en especifico (dentro de la compania).

**URL** : `/company/usuario`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
    "id": "[id del usuario a solicitar]",
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken del usuario>
```

### Respuesta del servidor

```json
{
    "usuario": {
        ["OBJETO DEL USUARIO"]
    }
}
```
---
# Codigos de registro
## De gestor
Usado para generar un codigo de registro para una cuenta de gestor de una compania, se enviara por email a la direccion especificada.

**URL** : `/user/codigo/gestor`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
    "email": "[direccion de correo del gestor a agregar]",
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de gestor>
```

### Respuesta del servidor

```json
{
    "codigo": "[String con el codigo que se debera ingresar en el registro]",
    "message": "Email enviado con exito!"}
```
---
## De conductor
Usado para generar un codigo de registro para una cuenta de conductor de una compania, se enviara por email a la direccion especificada.

**URL** : `/user/codigo/conductor`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de gestor>
Content-Type: application/json
```

**Parametros de la solicitud (body)**

```json
{
    "email": "[direccion de correo del conductor a registrar]",
}
```

### Respuesta del servidor

```json
{
    "codigo": "[String con el codigo que se debera ingresar en el registro]",
    "message": "Email enviado con exito!"
}
```