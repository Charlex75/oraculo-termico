# 🌡️ El Oráculo Térmico

Misión M1 · El Despertar del DOM — Web Development I.

El oráculo piensa un número, pero no te dice si es mayor o menor: solo si te estás acercando (ardiendo, caliente, templado, frío, helado). Cada intento queda en el historial con el color de su temperatura.

## Cómo probarlo

Abre `index.html` en el navegador (o con Live Server).

- Elige la dificultad: Fácil (1–50, 8 intentos), Normal (1–100, 10 intentos) o Difícil (1–500, 12 intentos).
- Escribe un número y pulsa «Consultar» o Enter.
- «Nueva partida» reinicia el juego en cualquier momento.
- Tecla secreta: pulsa **n** para activar el modo noche.

## Uso de IA

**Contexto.** La tarea se publicó cuando yo ya llevaba varias semanas de viaje en Islandia, unas vacaciones planeadas y pagadas desde abril. Sé que no es una excusa y que siempre se puede sacar un rato, pero durante el viaje he tenido muy poco tiempo entre conducir y visitar sitios. Además, el portátil que llevo apenas puede con Windows. Por eso me he apoyado sobre todo en la IA para escribir el código. Lo que no he querido es entregar algo que no entienda: he trabajado fase a fase, pidiendo que me explicara cada parte, para poder defenderlo en la revisión oral.

Usé **Claude Code** durante todo el proyecto. El código de `index.html`, `styles.css`, `README.md` y `app.js` lo generó la IA, en cinco fases (una por commit). Aunque gran parte del la logica del `app.js` lo hice a mano. La logica basica de frio-caliente, las dificultades y despues claude revisaba y mejoraba algun detalle que me hubiera saltado. El modo nocturno fué cosa de claude ahunque su aplición no sea nada muy complejo.

Verificación: Yo habria el index.html y me aseguraba de que las cosas nuevas aplicadas funcionaran correctamente y a su vez la IA probó la lógica de cada fase con scripts de Node que simulaban el DOM (valores vacíos, decimales, fuera de rango, victoria, derrota y cambio de dificultad).

## Autopsia

1. **El evento `submit` del formulario en vez del `click` del botón.** Con `submit`, el juego responde tanto al clic como a la tecla Enter sin escribir código extra. A cambio, hay que llamar a `evento.preventDefault()`; si no, el navegador recarga la página y se pierde el número secreto. Descarté escuchar `click` en el botón y, aparte, `keydown` con Enter en el input: eran dos listeners para hacer lo mismo.

2. **La temperatura se calcula en proporción al rango, no con una distancia fija.** La pista sale de `distancia / maximo`, así que estar a 10 del secreto es frío en Fácil (1–50) y ardiendo en Difícil (1–500). Descarté cantidades fijas como si caliente estás a menos de 5 porque en 1–500 casi nunca sonarían, y habría que escribir umbrales distintos para cada dificultad.