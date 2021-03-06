# **Vehiculos**
## **Indice**
1. [Crear vehiculo nuevo](#Crear-vehiculo-nuevo)
2. [Eliminar un vehiculo](#Eliminar-vehiculo)
3. [Asignarse a vehiculo](#Asignarse-a-vehiculo)
4. [Desasignarse de vehiculo](#Desasignarse-de-vehiculo)
5. [Tareas del vehiculo](#Tareas)
   1. [Crear tarea](#Crear-tarea)
   2. [Modificar tarea](#Modificar-tarea)
   3. [Get tareas por vehiculo](#Get-tareas-por-vehiculo)
   4. [Get tarea por ID](#Get-tarea-por-ID)
6. [Alertas](#Alertas)
   1. [Eliminar alerta en especifico](#Eliminar-alerta-en-especifico)
   2. [Eliminar todas las alertas de un vehiculo](#Eliminar-alertas-de-vehiculo)
7. [Tramites](#Tramites)
    1. [Crear tramite](#Crear-tramite)
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
# Eliminar vehiculo
Usado para elmiminar un vehiculo de la compania

**URL** : `/vehiculo/:id`
(ejemplo: /vehiculo/60d291c91fa1ae411c56b85c)

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR


**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
    "message": "Vehiculo eliminado con exito!"
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
---
# Tramites
## Crear tramite

Usado para crear un tramite para un vehiculo en especifico

**URL** : `/vehiculo/tramite`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (body)**

```json
{
	"vehiculo": {id del vehiculo},
	"titulo": {titulo del tramite},
	"descripcion": {descripcion del tramite},
	"date": {fecha en la que se vence el tramite},
	"ultimaVez": {fecha de la ultima vez que se actualizo el tramite},
    "urgencia": {urgencia del tramite, por ahora es "urgente" o "moderado"}
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
    "nuevoTramite": {
        Objeto del tramite nuevo
    }
}
```