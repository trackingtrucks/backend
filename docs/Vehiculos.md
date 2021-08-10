# **Vehiculos**
## **Indice**
1. [Crear vehiculo nuevo](#Crear-vehiculo-nuevo)
2. [Asignarse a vehiculo](#Asignarse-a-vehiculo)
3. [Desasignarse de vehiculo](#Desasignarse-de-vehiculo)
4. [Tareas del vehiculo](#Tareas)
   1. [Crear tarea](#Crear-tarea)
   2. [Modificar tarea](#Modificar-tarea)
   3. [Get tareas por vehiculo](#Get-tareas-por-vehiculo)
   4. [Get tarea por ID](#Get-tarea-por-ID)
5. [Alertas](#Alertas)
   1. [Eliminar alerta en especifico](#Eliminar-alerta-en-especifico)
   2. [Eliminar todas las alertas de un vehiculo](#Eliminar-alertas-de-vehiculo)
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
    "kilometrajeActual": "[Numero del kilometraje actual]"
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
# Tareas
## Crear tarea

Usado para crear una tarea para un vehiculo en especifico

**URL** : `/vehiculo/tareas`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"vehiculo": {id del vehiculo},
	"tipo": {tipo de tarea, por ahora solo acepta "aceite" y "neumaticos"},
	"cantidadCada": {cada cuanto se tiene que realizar esta tarea (kms)},
	"cantidadUltima": {cuando fue la ultima vez que se realizo esta tarea (kms)},
	"avisarAntes": {cuanto antes de la distancia maxima se quiere obtener una alerta}
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
    "nuevaTarea": {
        Objeto de la tarea nuevo
    }
}
```
---
## Modificar tarea
Usado para modificar una tarea de un vehiculo

**URL** : `/vehiculo/tarea`

**Metodo** : `PATCH`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"id": {id del vehiculo},
	"data": {
		"avisarAntes": {parametro a cambiar (vacio si no se cambia)},
		"cantidadUltima":  {parametro a cambiar (vacio si no se cambia)},
        "cantidadCada":  {parametro a cambiar (vacio si no se cambia)}
	}
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
  "_id": {id de la tarea},
  "vehiculo": {id del vehiculo},
  "tipo": {tipo de tarea},
  "cantidadCada": {cantidad modificada, o original si no se modifico},
  "cantidadUltima": {cantidad modificada, o original si no se modifico},
  "avisarAntes": {cantidad modificada, o original si no se modifico}
}
```
---
## Get tareas por vehiculo
Usado para obtener todas las tareas que tiene un vehiculo asignadas

**URL** : `/vehiculo/tareas`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"vehiculo": {id del vehiculo}"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
[
  {
    objeto de la tarea 1
  },
  {
    objeto de la tarea 2
  }
]
```
---
## Get tarea por ID
Usado para obtener una tarea en especifico con su ID

**URL** : `/vehiculo/tarea`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"id": {id de la tarea}
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
  objeto de la tarea
}
```
---
# Alertas
## Eliminar alerta en especifico
Usado para eliminar una alerta en especifico con su uuid

**URL** : `/vehiculo/alerta`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"id": {id de la alerta},
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
    "vehiculoActualizado":{
        objeto del vehiculo actualizado
    }
}
```
---
## Eliminar alertas de vehiculo
Usado para eliminar todas las alertas de un vehiculo

**URL** : `/vehiculo/alertas`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"id": {id del vehiculo}
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
  "message": "Alertas eliminadas con exito!"
}
```