# **Vehiculos**
## **Indice**
1. [Crear vehiculo nuevo](#Crear-vehiculo-nuevo)
2. [Asignarse a vehiculo](#Asignarse-a-vehiculo)
3. [Desasignarse de vehiculo](#Desasignarse-de-vehiculo)

---
# Crear vehiculo nuevo
Usado para crear un vehiculo dentro de la compania

**URL** : `/vehiculo`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
    "patente": "[patente del vehiculo]",
	"marca": "[marca del vehiculo]",
	"modelo": "[modelo del vehiculo]",
	"año": "[año del vehiculo]",
    "kmactual": "[kmactual del vehiculo]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
    "vehiculo": {
        Objeto del vehiculo nuevo
    },
    "success": true
}
```
---
# Asignarse a vehiculo
Usado para asignarse a un vehiculo que está dentro de la compania

**URL** : `/vehiculo`

**Metodo** : `PUT`

**Autenticacion requerida**: SI

**Rol requerido**: CONDUCTOR

**Parametros de la solicitud (body)**

```json
{
    "patente": "[patente del vehiculo]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
    "vehiculo": {
        Objeto del vehiculo modificado con el conductor actual
    },
    "usuario": {
        Objeto del usuario conductor modificado con el vehiculo actual
    }
}
```
---
# Desasignarse de vehiculo
Usado para desasignarse de un vehiculo que está dentro de la compania

**URL** : `/vehiculo`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Rol requerido**: CONDUCTOR

**Parametros de la solicitud (body)**

```json
{
    "patente": "[patente del vehiculo]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
    "vehiculo": {
        Objeto del vehiculo modificado, eliminando el conductor actual y agregando el conductor a conductores pasados
    },
    "usuario": {
        Objeto del usuario conductor modificado, eliminando el vehiculo actual y agregando el vehiculo a vehiculos pasados
    }
}
```
---