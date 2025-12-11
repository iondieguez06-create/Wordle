# Wordle
Práctica de DWEC en el que vamos a replicar el juego Wordle  
## Desarrollador   
El proyecto ha sido desarrollado por **Ion Dieguez**
### Caracteristicas
+ Se genera una palabra **aleatoria**
+ En cada linea puedes poner una palabra de **5 letras**
+ Al darle al enter se **comprueba** la palabra
+ Las letras se clasifican por colores dependiendo:
  + **Verde:** Acertado letra y posicion
  + **Naranja:** Acertado letra pero no posicion
  + **Gris:** No acertado ni letra ni posicion  
---
Tabla:
  
| Palabra | FeedBack |
|:-------:|:-------:|
| Porra | VGVVG |
| Perri | VVVVG |
| Perro | VVVVV |

[Enlace al proyecto](https://github.com/iondieguez06-create/Wordle/)
![Imagen](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Wordle_Logo.svg/1200px-Wordle_Logo.svg.png)

``` JavaScript
async function iniciarJuego() {
  const palabra = await obtenerPalabra();
  palabraSecreta = palabra.toUpperCase();
  palabraCargada = true;
  console.log("Palabra secreta:", palabraSecreta);
}
```
>Esto es wordle
>> Un juego de adivinar la palabra \*
