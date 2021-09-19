# **Turnos**
## **Indice**

1. [Crear turno](#Crear-Turno)
2. [Asignar turno](#Asignar-Turno)
3. [Empezar Entrega](#Empezar-Entrega)
4. [Terminar Entrega](#Terminar-Entrega)

---
# Crear Turno
Usado para crear turnos dentro de la compania

**URL** : `/user/turno/crear`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (headers)**

```txt
Content-type: application/json
x-access-token: <accessToken de usuario>
```

**Parametros de la solicitud (body)**

```json
{
    "codigoDeTurno": "[codigo del turno que le pasan al gestor]",
    "fechaYhora": "[fecha y hora del turno] formato: [YY-MM-DD HH:mm:ss]",
    "nombreVendedor": "[nombre del vendedor]",
    "codigoOrdenDeCompra": "[codigo de la orden de compra]"
}
```

### Respuesta del servidor

```json
{
  "turno": {
      ["OBJETO DEL TURNO"]
  },
  "message": "Turno creado con exito"
}
```
---
# Asignar Turno
Usado para asignar turnos a los diferentes conductores

**URL** : `/user/turno/asignar`

**Metodo** : `PUT`

**Autenticacion requerida**: SI

**Rol requerido**: GESTOR

**Parametros de la solicitud (headers)**

```txt
Content-type: application/json
x-access-token: <accessToken de usuario>
```

**Parametros de la solicitud (body)**

```json
{
  "idConductor": "[id del conductor al que se le quiere asignar el turno]",
  "codigoDeTurno": "[codigo del turno que se quiere asignar]"
}
```

### Respuesta del servidor

```json
{
  "message": "Turno asignado con exito"
}
```
---
# Empezar Entrega
Usado para que un conductor comience una entrega

**URL** : `/user/entrega/empezar`

**Metodo** : `PATCH`

**Autenticacion requerida**: SI

**Rol requerido**: CONDUCTOR

**Parametros de la solicitud (headers)**

```txt
Content-type: application/json
x-access-token: <accessToken de usuario>
```

**Parametros de la solicitud (body)**

```json
{
  "codigoDeTurno": "[codigo del turno que se quiere asignar]"
}
```

### Respuesta del servidor

```json
{
  "message": "Entrega empezada con exito"
}
```
---
# Terminar Entrega
Usado para que un conductor finalice una entrega

**URL** : `/user/entrega/terminar`

**Metodo** : `PATCH`

**Autenticacion requerida**: SI

**Rol requerido**: CONDUCTOR

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de usuario>
```

### Respuesta del servidor

```json
{
  "message": "Entrega terminada con exito"
}
```