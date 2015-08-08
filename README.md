# Not Messenger

Servidor de mensajería que implementa un servicio como Facebook Messenger ni otro similar pero que sirve para poder aprender a interactuar con una simple interfaz REST desde aplicaciones web o móviles.

## Inicio

Para iniciar el servidor, clonar el repositorio y ejecutar

```bash
npm start
```

## API

### POST /me

Crea un nuevo usuario. Se debe enviar en el cuerpo un objeto JSON: `{"name": "Juan"}`.

### GET /me

Devuelve los datos del cliente: `{"name": "Juan"}`.

### GET /users/:name

Devuelve los datos del usuario `name` en un objeto JSON: `{"name": "Juan"}`.

### GET /chats

Devuelve los nombres de los usuarios con quienes el cliente se ha enviado mensajes y datos como cuál fue el último mensaje, la cantidad no leídos y la hora:

```json
[{
    "name": "Alberto",
    "unread": 1,
    "last": "¿Cómo estás?",
    "time": 1439008336062
}]
```

### GET /chats/:name

Devuelve los mensajes entre el cliente y el usuario `name`.

```json
[{
    "from":"Juan",
    "to":"Alberto",
    "text":"¿Cómo estás?",
    "time":1439008336062
}]
```

### POST /chats/:name

Envía un mensaje al usuario `name` en un objecto JSON: `{"text": "¿Cómo estás?"}`.
