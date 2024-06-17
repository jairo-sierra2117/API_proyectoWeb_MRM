# API_proyectoWeb_MRM

Las vistas estan actualmente validadas por el archivo validacion.js
este contiene los permisos a las distintas vistas .html
por medio del id rol del usuario en cuestion.
logicamente una vez iniciado sesion.

Si desea usar la validacion de inicio de sesion activa, basta con des-comentar la linea de la siguiente forma

    <!--<script src="../js/validacion.js" type="module"></script> -->

    <script src="../js/validacion.js" type="module"></script>

esta se encuentra en el head del html.

FUNCIONALIDADES TESTEADAS CON LA BD heroku
PARA TESTEAR LA VALIDACION DE LA SESION, EL REGISTRO DE CLIENTE Y EL LOGIN DE CLIENTES Y PERSONAL DEBE TENER LA API DESCARGADO EN SU PC Y EJECUTARLA .(POR EL MOMENTO NO SE HA DESPLEGADO LA API PARA SU USO DESDE CUALQUIER PC)

FUNCIONES

LOGINCLIENT
FUNCIONA AL 100%
Solo en el loginClient.html
Este SOLO ACEPATA USUARIOS TIPO cliente y lo redirecciona a la pagina de inicio correspondiente.
Si desea cambiar esta redireccion ir al archivo auth.js
Se recomienda ser cuidadoso , en caso de hacer cambios importantes , validar su funcionamiento antes de hacer push al repositorio.

REGISTRO
FUNCIONA AL 100% PARA USUARIO DE TIPO CLIENTE

LOGIN-MRM
FUNCIONA AL 100%
Solo en el loginMRM.html
Este SOLO ACEPATA USUARIOS TIPO empleado, es decir personal de MRM y lo redirecciona a la pagina de inicio correspondiente.
Si desea cambiar esta redireccion ir al archivo auth.js
Se recomienda ser cuidadoso , en caso de hacer cambios importantes , validar su funcionamiento antes de hacer push al repositorio.
by jairo-sierra2117
