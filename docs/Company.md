# **Compania**
## **Indice**
1. [Devolver info de la compania](#Devolver-datos-de-la-compania)
2. [Codigos de registro](#codigos-de-registro)
   1. [Gestor](#de-gestor)
   2. [Conductor](#de-conductor)
   3. [Verificar](#verificar)

---
# Devolver datos de la compania
Usado para que el gestor reciba toda la informacion de su compania.

**URL** : `/user/getbycid`

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