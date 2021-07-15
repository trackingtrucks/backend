# **Datos**
## **Indice**

1. [Subir Datos](#Subir-Datos)

---
# Subir Datos
Usado para crear turnos dentro de la compania

**URL** : `/data`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: CONDUCTOR

**Requerimientos**: Estar asignado

**Parametros de la solicitud (headers)**

```txt
Content-type: application/json
x-access-token: <accessToken de usuario>
```

**Parametros de la solicitud (body)**

```json
{
    "fuelLevel": {Objeto de información de fuel level},
	"RPM": {Objeto de información de RPM},
	"speed": {Objeto de información de speed},
	"coolantTemperature": {Objeto de información de coolant temperature},
    "pendingTroubleCodes": [Array de información de pending trouble codes] (Puede no haber),
	"kilometrosRecorridos": {Objeto de información de kilometros recorridos}
}
```

**Ejemplo de body**

```json
{
	"fuelLevel": ["50%", "40%"],
	"RPM": ["1600RPM", "1500RPM"],
	"speed": "60km/h",
	"coolantTemperature": "20C",
	"kilometrosRecorridos": ["3", "3.5"]
}
}
```

### Respuesta del servidor

```json
{
  "message": "Datos subidos con exito!"
}
```
---