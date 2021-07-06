# **Turnos**
## **Indice**

1. [Crear turno](#Crear-Turno)

---
# Crear Turno
Usado para crear turnos dentro de la compania

**URL** : `/user/crearTurno`

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