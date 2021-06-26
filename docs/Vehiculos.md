# **Vehiculos**
## **Indice**
1. [Crear vehiculo nuevo](#Crear-vehiculo-nuevo)

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
