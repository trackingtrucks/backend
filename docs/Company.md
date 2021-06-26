# **Compania**
## **Indice**
1. [Devolver info de la compania](#Devolver-datos-de-la-compania)
2. [Devolver un vehiculo en especifico](#devolver-un-vehiculo-en-especifico)
3. [Devolver un usuario en especifico](#devolver-un-usuario-en-especifico)
4. [Codigos de registro](#codigos-de-registro)
   1. [Gestor](#de-gestor)
   2. [Conductor](#de-conductor)
   3. [Verificar](#verificar)

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
}
```
---
# Devolver un vehiculo en especifico
Usado para obtener la informacion de un vehiculo en especifico (dentor de la companía).

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
Usado para generar un codigo de registro para una cuenta de gestor de una compania.

**URL** : `/user/codigo/gestor`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: ADMIN

**Parametros de la solicitud (body)**

```json
{
    "companyId": "[id unico de cada compania]",
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
    "codigo": "[String con el codigo que se debera ingresar en el registro]"
}
```
---
## De conductor
Usado para generar un codigo de registro para una cuenta de conductor de una compania.

**URL** : `/user/codigo/conductor`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de gestor>
```

### Respuesta del servidor

```json
{
    "codigo": "[String con el codigo que se debera ingresar en el registro]"
}
```
---
## Verificar
Verifica si el codigo ingresado es valido

**URL** : `/user/codigo/check`

**Metodo** : `GET`

**Autenticacion requerida**: NO

**Parametros de la solicitud (body)**

```json
{
    "codigo": "[codigo de registro]",
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
```

### Respuesta del servidor

```json
{
    "valid": true/false
}
```