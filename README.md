# API_proyectoWeb_MRM

Las vistas estan actualmente validadas por el archivo validacion.js
este contiene los permisos a las distintas vistas .html
por medio del id rol del usuario en cuestion.
logicamente una vez iniciado sesion.

Si desea quitar esta validacion de inicio de sesion activa, basta con comentar la linea de la siguiente forma

<!--<script src="../js/validacion.js" type="module"></script> -->

    esta se encuentra en el head del html.

FUNCIONALIDADES TESTEADAS CON LA BD heroku

LOGIN
FUNCIONA AL 100%
Solo en el login.html
Este ya distingue entre un usuario empleado o cliente y lo redirecciona a la pagina de inicio correspondiente.
Si desea cambiar esta redireccion ir al archivo auth.js
Se recomienda ser cuidadoso , en caso de hacer cambios importantes , validar su funcionamiento antes de hacer push al repositorio.

REGISTRO
FUNCIONA AL 100% PARA USUARIO DE TIPO CLIENTE

by jairo-sierra2117
