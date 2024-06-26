# API_proyectoWeb_MRM

VEAN HIJOS DE SU FRUTA MADRE LA ESTA HISTORIAL PEDIDOS FUNCIOANL ASI QUE HAGAN LO DEMAS QUE FALTE ESO DE PEDIDOS NI LO MIREN , A NO SER QUE VAYAN A CAMBIAR EL ASCO DE BOTON DE AGREGAR PROVEEDOR.

Y DEJEN DORMIR
FULL MAÑANA HASTA LAS 4 AM PARA IR A SUSTENTAR ESTA MONDA.
REVISAR .










cambios   13:06 pm               2:15 am 21/06/2024
FAVOR COPIAR EL CODIGO DEL HEADER DE CLIENTE
para que este sea el mismo en todas las vistas.

SE AGREGO PERFIL.HTML y PerfilEmpl.html
TIENE FUNCIONAL LA INFORMACION DEL USUARIO.
TIENE FUNCIONAL EL CAMBIO DE CLAVE CON MODAL.

Las vistas estan actualmente validadas por el archivo validacion.js
este contiene los permisos a las distintas vistas .html
por medio del id rol del usuario en cuestion.
logicamente una vez iniciado sesion.

Si desea usar la validacion de inicio de sesion activa, basta con des-comentar la linea de la siguiente forma

    <!--<script src="../js/validacion.js" type="module"></script> -->

    <script src="../js/validacion.js" type="module"></script>

esta se encuentra en el head del html.

FUNCIONALIDADES TESTEADAS CON LA BD heroku
PARA TESTEAR LA VALIDACION DE LA SESION, EL REGISTRO DE CLIENTE Y EL LOGIN DE CLIENTES Y PERSONAL DE MRM, SE DEBE TENER LA API DESCARGADA EN SU PC Y EJECUTARLA .
(POR EL MOMENTO NO SE HA DESPLEGADO LA API PARA SU USO DESDE CUALQUIER PC)

FUNCIONES

LOGINCLIENT
FUNCIONA AL 100%
Solo en el loginClient.html
Este SOLO ACEPTA USUARIOS TIPO cliente y lo redirecciona a la pagina de inicio correspondiente.
Si desea cambiar esta redireccion ir al archivo auth.js
Se recomienda ser cuidadoso , en caso de hacer cambios importantes , validar su funcionamiento antes de hacer push al repositorio.

REGISTRO
FUNCIONA AL 100% PARA USUARIO DE TIPO CLIENTE

LOGIN-MRM
FUNCIONA AL 100%
Solo en el loginMRM.html
Este SOLO ACEPTA USUARIOS TIPO empleado, es decir personal de MRM y lo redirecciona a la pagina de inicio correspondiente.
Si desea cambiar esta redireccion ir al archivo auth.js
Se recomienda ser cuidadoso , en caso de hacer cambios importantes , validar su funcionamiento antes de hacer push al repositorio.



atribuciones de imgs
<div> Iconos diseñados por <a href="https://www.flaticon.es/autores/kornkun" title="kornkun"> kornkun </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es'</a></div>



by jairo-sierra2117
