# AI Log - EasyEat Project
**Herramienta:** Antigravity (Coding Assistant)  
**Modelos usados:** Gemini 1.5 Pro (para lógica compleja y refactorización) y Gemini 1.5 Flash (para implementación rápida).

## Consulta 1: Definición del Modelo y Vinculación con Restaurante
**Pregunta:** ¿Cómo implementar el sistema de recursos vinculados a la entidad restaurante en MongoDB? Prompt: "Implementing Restaurant Resources Service... creating the backend model, service, controller, and routes, and updating the restaurant model to include these resources" 
**Incoherencias:** La IA generó correctamente el esquema de resource.ts pero olvidó inicialmente que para que la relación fuera funcional, se debía modificar el modelo base de restaurant.ts para incluir la referencia (recursos: objectId). 
**Solución:** Se añadió manualmente el campo recursos a la interfaz IRestaurant y al esquema restaurantSchema. También se añadió una lógica en el servicio para que, al crear un recurso, se haga automáticamente un findByIdAndUpdate en el restaurante correspondiente para enlazar el ID del recurso recién creado.
---
## Consulta 2: Solución de error en POST /recursos
**Pregunta:** ¿Por qué falla el Swagger al hacer un POST a /recursos con un error 422?
**Prompt:** "me esta fallando el swagger al hacer un post Responses... [adjunta error de validación de Joi]"
**Incoherencias:** La IA detectó que el esquema de Joi era demasiado estricto y no permitía el campo `_id` en los items, ni permitía objetos desconocidos que añade Swagger.
**Solución:** Se modificó `src/middleware/joi.ts` para añadir `_id: objectId.optional()` y `.unknown(true)` en el esquema de recursos. Se reinició el servidor tras hacer el `build`.
---
## Consulta 3: Paginación y Buscador en Backend
**Pregunta:** Implementar paginación y búsqueda por tipo o texto en el backend.
**Prompt:** "necesito que el listado incluya paginacion... y despues necesito añadir un buscador en el backend como por ejemplo a traves de el tipo de recurso o descripcion"
**Incoherencias:** Ninguna relevante, aunque se tuvo que asegurar que la búsqueda fuera insensible a mayúsculas/minúsculas usando regex.
**Solución:** Se actualizaron `ResourceService` y `ResourceController` para aceptar parámetros `page`, `limit`, `type` y `search`. Se actualizó la documentación de Swagger para reflejar los nuevos campos.