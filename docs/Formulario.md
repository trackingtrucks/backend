# **Formulario**
## **Indice**
1. [Crear formulario](#crear)
2. [Obtener formularios](#obtener-formularios)
3. [Aceptar formulario](#aceptar-formulario)
4. [Eliminar formulario](#eliminar-formulario)
---
# Crear
Usado para enviar un formulario a la base de datos

**URL** : `/company/formulario`

**Metodo** : `POST`

**Autenticacion requerida** : NO

**Parametros de la solicitud (body)**

```json
{
    "nombreEmpresa": "[Nombre de la empresa que esta contactandonos]",
    "email": "[direccion de email valida]",
    "descripcionUso": "[descripcion del uso que se le va a dar a la aplicacion]",
    "genteCompania": "[cantidad de personas que va a tener la aplicacion]"
}
```

**Parametros de la solicitud (headers)**

```txt
Content-Type: application/json
```
### Respuesta del servidor

```json
{
    "message": "Gracias por comunicarse con nosotros, estaremos en contacto con usted"
}
```
---
# Obtener Formularios
Usado para obtener la lista de formularios enviados.

**URL** : `/admin/formulario/all`

**Metodo** : `GET`

**Autenticacion requerida**: SI

**Rol requerido**: ADMIN

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de administrador>
```

### Respuesta del servidor

```json
{
    "forms":[
        "Lista de todos los formularios"
    ]
}
```
---
# Aceptar formulario
Usado aceptar una peticion enviada por el formulario, permitiendo el ingreso al sistema.

**URL** : `/admin/formulario/aceptar`

**Metodo** : `POST`

**Autenticacion requerida**: SI

**Rol requerido**: ADMIN

**Parametros de la solicitud (body)**

```json
{
    "id": "[id del formulario recibido]",
    "companyId": "[companyId a crear]",
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
    "message": "Confirmado con exito!",
    "codigo": "<token de registro generado>",

}
```
---
# Eliminar formulario
Usado eliminar una peticion enviada por el formulario.

**URL** : `/admin/formulario/:id`

**Metodo** : `DELETE`

**Autenticacion requerida**: SI

**Rol requerido**: ADMIN

**Parametros de la solicitud (headers)**

```txt
x-access-token: <accessToken de administrador>
```

### Respuesta del servidor

```json
{
    "message": "Hecho"    
}
```
---