import i18n from "i18next";
import { initReactI18next } from "react-i18next"; // Motor para permitir que i18next trabaje con react
import LanguageDetector from "i18next-browser-languagedetector"; // Importamos el detector que mira el idioma del navegador

// Definimos el diccionario que vamos a utilizar
const resources = {
  es: {
    translation: {
      // SECCION DE NAVBAR / GENERAL
      home: "Inicio",
      contact: "Contacto",
      favorites: "Favoritos",
      login: "Login",
      register: "Registrarse",
      logout: "Cerrar sesion",
      search_placeholder: "Buscar pelicula...",
      welcome: "¡Bienvenido!", // Bienvenida para el usuario en LOGIN
      hello: "Hola", // Bienvenida para el usuario en LOGIN (2) 

      // SECCION DE LOGIN Y REGISTRO
      login_title: "Iniciar Sesion",
      register_title: "Crear Cuenta",
      email_label: "Correo electronico",
      email_placeholder: "tu@email.com", // Placeholder para el email en LOGIN
      password_label: "Contraseña",
      username_label: "Nombre de usuario",
      username_placeholder: "Ej: Bonjovi87",
      login_btn: "Entrar",
      register_button: "Registrarse",
      already_have_account: "¿Ya tienes cuenta?",
      no_account_question: "¿No tienes cuenta?",
      login_link: "Inicia sesion",
      register_link: "Registrate",
      mensaje_error_desconocido: "error desconocido", // Para mensaje de error desconocido LOGIN

      // SECCION DE MENSAJES Y ERRORES
      registration_success: "Registro completado con exito",
      auth_error: "Error de acceso",
      unknown_error: "Ha ocurrido un error inesperado",
      view_more: "Ver mas",
      view_details: "Ver detalles",

      // SECCION FAVORITOS
      favorites_title_page: "Mis Peliculas Favoritas",
      fav_btn_details: "Ver detalles",
      fav_btn_remove: "Eliminar de favoritos",
      fav_error_load_title: "Error de carga",
      fav_error_load_msg: "No pudimos cargar tus favoritos",
      fav_removed_title: "Pelicula eliminada",
      fav_removed_msg: "Pelicula eliminada de tus favoritas correctamente",
      fav_error_delete_title: "Error",
      fav_error_delete_msg: "No se ha podido eliminar la pelicula",
      auth_required_favs_msg:"Debes iniciar sesion para gestionar tu lista de peliculas favoritas.",

      // SECCION DETALLE PELICULA
      movie_detail_loading: "Cargando detalles...",
      movie_detail_add_fav: "AÑADIR A MIS FAVORITOS",
      movie_detail_already_fav: "YA EN MIS FAVORITOS",
      movie_detail_btn_watch: "Ver ahora",
      movie_detail_login_to_watch: "Inicia sesion para reproducir el contenido",
      movie_detail_login_to_rate: "Inicia sesion para puntuar",
      movie_detail_thanks_rating: "¡Gracias por valorar la pelicula!",
      movie_detail_rate_title_section: "Danos tu puntuacion",
      movie_detail_rate_label: "Nota (1-10)",
      movie_detail_btn_rate: "Puntuar",
      movie_detail_review_thanks_title: "Gracias por tu reseña",
      movie_detail_review_already_done: "Ya has participado en la comunidad de esta pelicula",
      movie_detail_write_review: "Comentanos que te ha parecido",
      movie_detail_placeholder_review: "Escribe tu reseña...",
      movie_detail_btn_send_comm: "Enviar comentario",
      movie_detail_synopsis: "Sinopsis",
      movie_detail_official_trailer: "Trailer Oficial",
      movie_detail_community_comments: "Comentarios de la comunidad",
      movie_detail_no_comments_yet: "Todavia no hay comentarios sobre esta pelicula",
      movie_detail_your_rating_display: "Has puntuado esta pelicula con un {{nota}}",

      // SECCION DE MODALES DETALLES
      movie_detail_modal_comm_title: "Comentario guardado",
      movie_detail_modal_comm_msg: "¡Gracias por darnos tu opinion!",
      movie_detail_modal_rate_title: "Puntuacion guardada",
      movie_detail_modal_rate_msg: "¡Gracias por valorar la pelicula!",
      movie_detail_modal_fav_title: "Añadida a favoritos",
      movie_detail_modal_fav_msg: "Pelicula añadida a tus favoritos",
      movie_detail_login_to_comment:"Inicia sesion para compartir que te ha parecido esta pelicula.",
      movie_detail_video_not_supported: "Tu navegador no soporta la reproduccion de video.",

      // SECCION CONTACTO
      contact_banner_title: "Ponte en contacto con nosotros",
      contact_email_label: "Email",
      contact_phone_label: "Telefono",
      contact_address_label: "Direccion",
      contact_address_value: "Campus de Arrosadia, Pamplona",
      contact_map_title: "Nuestras sedes",
      contact_branch_center: "Videoclub Centro",
      contact_branch_north: "Videoclub Norte",
      contact_branch_south: "Videoclub Sur",

      // Aviso Legal SECCION DE AVISO LEGAL
      legal_title: "Aviso Legal",
      legal_sec1_title: "1. Datos Identificativos",
      legal_sec1_text: "Este sitio web es un proyecto academico desarrollado por los estudiantes Ruben Cameo y Alejandro Guerra. El portal ha sido creado con fines exclusivamente educativos para la asignatura de desarrollo web.",
      legal_sec2_title: "2. Propiedad Intelectual",
      legal_sec2_text: "Todo el contenido visual (carteles de peliculas, trailers y sinopsis) es propiedad de sus respectivos autores y productoras cinematograficas. Su uso en esta plataforma se realiza bajo el concepto de uso legitimo con fines docentes.",
      legal_sec3_title: "3. Contenido Multimedia",
      legal_sec3_text: "Los autores no se hacen responsables de la exactitud de los datos proporcionados por servicios externos, ni la disponibilidad continua del servicio, al tratarse de un entorno de pruebas.",

      // Errores de AccessService SECCION DE ERRORES EN ACCESS SERVICE
      error_email_exists: "El correo ya esta en uso. Prueba con otro o haz login",
      error_weak_password: "La contraseña es muy corta. Pon al menos 6 caracteres.",
      error_invalid_email: "El formato del correo no es correcto (falta @ o punto).",
      error_general: "Ha ocurrido un error tecnico",

      // SECCION DE TOP PELICULAS 
      top_title: "Ranking de Peliculas",
      top_subtitle: "Las mejor valoradas por nuestra comunidad",
      cat_todas: "Todas",
      top_no_desc: "Sin descripcion disponible.",
      top_view_short: "Ver",
      home_carousel_title: "Destacados",
      home_set_movies: "Nuestras Peliculas",
      home_tab_billboard: "En Cartelera",
      home_tab_upcoming: "Proximamente",
      home_tab_catalog: "Catalogo",
      home_title_billboard: "Peliculas en Cartelera",
      home_title_upcoming: "Proximos Estrenos",
      home_title_catalog: "Nuestro Catalogo Completo",
      home_movies_of_category: "Peliculas de {{categoria}}",
      cat_accion: "Accion",
      cat_drama: "Drama",
      cat_terror: "Terror",
      cat_animacion: "Animacion",
      cat_fantasia: "Fantasia",
      lang_text: "Idioma",
      top_text: "Top",
      login_text: "Login",
      register_text: "Registrarse",

      // SECCION DE RESULTADOS
      search_results_for: "Resultados de la busqueda: ",
      home_no_results: "No hay coincidencias",

      // SECCION DE FOOTER
      footer_slogan: "Tu cine, a cualquier hora.",
      footer_location_title:"Ubicacion",
      footer_legal:"Aviso legal",
      footer_privacy:"Politica de privacidad",
      titulo_informacion:"Informacion",
      footer_rights:"Todos los derechos reservados.",

      // SECCION DE MODAL
      modal_button_ok:"Entendido",
    
    },
  },
  en: {
    translation: {

      // SECCION DE NAVBAR / GENERAL
      home: "Home",
      contact: "Contact",
      favorites: "Favorites",
      login: "Login",
      register: "Register",
      logout: "Logout",
      search_placeholder: "Search movie...",
      welcome: "Welcome!", // Bienvenida para el usuario en LOGIN
      hello: "Hello", // Bienvenida para el usuario en LOGIN (2)


      // SECCION DE LOGIN Y REGISTRO
      login_title: "Login",
      register_title: "Create Account",
      email_label: "Email Address",
      email_placeholder: "you@email.com", // Placeholder para el email en LOGIN
      password_label: "Password",
      username_label: "Username",
      username_placeholder: "Ex: Bonjovi87",
      login_btn: "Login",
      register_button: "Sign Up",
      already_have_account: "Already have an account?",
      no_account_question: "Don't have an account?",
      login_link: "Login here",
      register_link: "Register here",
      registration_success: "Registration completed successfully",
      auth_error: "Access Error",
      unknown_error: "An unexpected error occurred",
      view_more: "View more",

      // SECCION DE FAVORITOS
      favorites_title_page: "My Favorite Movies",
      fav_btn_details: "View details",
      fav_btn_remove: "Remove from favorites",
      fav_error_load_title: "Loading Error",
      fav_error_load_msg: "We couldn't load your favorites",
      fav_removed_title: "Movie removed",
      fav_removed_msg: "Movie successfully removed from your favorites",
      fav_error_delete_title: "Error",
      fav_error_delete_msg: "The movie could not be removed",
      auth_required_favs_msg:"You must log in to manage your favorite movies list.",

      // SECCION DE DETALLES DEL MOVIL
      movie_detail_loading: "Loading details...",
      movie_detail_add_fav: "ADD TO FAVORITES",
      movie_detail_already_fav: "ALREADY IN FAVORITES",
      movie_detail_btn_watch: "Watch Now",
      movie_detail_login_to_watch: "Login to watch the content",
      movie_detail_login_to_rate: "Login to rate",
      movie_detail_thanks_rating: "Thanks for rating the movie!",
      movie_detail_rate_title_section: "Give us your rating",
      movie_detail_rate_label: "Rating (1-10)",
      movie_detail_btn_rate: "Rate",
      movie_detail_review_thanks_title: "Thanks for your review",
      movie_detail_review_already_done:"You have already participated in this movie's community",
      movie_detail_write_review: "Tell us what you think",
      movie_detail_placeholder_review: "Write your review...",
      movie_detail_btn_send_comm: "Send comment",
      movie_detail_synopsis: "Synopsis",
      movie_detail_official_trailer: "Official Trailer",
      movie_detail_community_comments: "Community Comments",
      movie_detail_no_comments_yet: "There are no comments for this movie yet",
      movie_detail_your_rating_display: "You rated this movie with a {{nota}}",
      
      // SECCION MODALES DETALLES
      movie_detail_modal_comm_title: "Comment saved",
      movie_detail_modal_comm_msg: "Thanks for your feedback!",
      movie_detail_modal_rate_title: "Rating saved",
      movie_detail_modal_rate_msg: "Thanks for rating the movie!",
      movie_detail_modal_fav_title: "Added to favorites",
      movie_detail_modal_fav_msg: "Movie added to your favorites",
      movie_detail_login_to_comment:"Log in to share your thoughts on this movie.",
      movie_detail_video_not_supported: "Your browser does not support video playback.",

      // SECCION CONTACTO
      contact_banner_title: "Get in touch with us",
      contact_email_label: "Email",
      contact_phone_label: "Phone",
      contact_address_label: "Address",
      contact_address_value: "Arrosadia Campus, Pamplona",
      contact_map_title: "Our locations",
      contact_branch_center: "Downtown Video Club",
      contact_branch_north: "North Video Club",
      contact_branch_south: "South Video Club",

      // SECCION DE LEGAL NOTICE
      legal_title: "Legal Notice",
      legal_sec1_title: "1. Identifying Data",
      legal_sec1_text:"This website is an academic project developed by students Ruben Cameo and Alejandro Guerra. The portal has been created exclusively for educational purposes for the web development course.",
      legal_sec2_title: "2. Intellectual Property",
      legal_sec2_text:"All visual content (movie posters, trailers, and synopses) is the property of their respective authors and film production companies. Its use on this platform is carried out under the concept of fair use for teaching purposes.",
      legal_sec3_title: "3. Multimedia Content",
      legal_sec3_text:"The authors are not responsible for the accuracy of data provided by external services, nor for the continuous availability of the service, as it is a testing environment.",

      // SECCION DE ERRORES DE ACCESS SERVICE
      error_email_exists: "Email already in use. Try another one or log in.",
      error_weak_password: "Password is too short. Use at least 6 characters.",
      error_invalid_email: "Invalid email format (missing @ or dot).",
      error_general: "A technical error has occurred",

      // SECCION DE TOP MOVIES
      top_title: "Movie Ranking",
      top_subtitle: "Top rated by our community",
      cat_todas: "All",
      top_no_desc: "No description available.",
      top_view_short: "View",

      // SECCION HOME
      home_welcome_title: "Billboard",
      home_subtitle: "Explore the latest movie releases",
      home_no_results: "No movies found matching '{{busqueda}}'",
      home_loading: "Loading movies...",
      home_filter_all: "All categories",
      home_carousel_title: "Featured",
      home_set_movies: "Our Movies",
      home_tab_billboard: "On Billboard",
      home_tab_upcoming: "Upcoming",
      home_tab_catalog: "Catalog",
      home_title_billboard: "Movies on Billboard",
      home_title_upcoming: "Upcoming Releases",
      home_title_catalog: "Our Full Catalog",
      home_movies_of_category: "{{categoria}} Movies",
      cat_accion: "Action",
      cat_drama: "Drama",
      cat_terror: "Horror",
      cat_animacion: "Animation",
      cat_fantasia: "Fantasy",
      lang_text: "Language",
      top_text: "Top Movies",
      login_text: "Login",
      register_text: "Register",

      // SECCION DE RESULTADOS
      search_results_for: "Search results for: ",
      mensaje_error_desconocido:"unknown error", // Para mensaje de error desconocido LOGIN

      // SECCION DE FOOTER
      footer_slogan: "Your cinema, anytime.",
      footer_location_title:"Location",
      footer_legal:"Legal Notice",
      footer_privacy:"Privacy Policy",
      titulo_informacion:"Information",
      footer_rights:"All rights reserved.",

      // SECCION MODAL
      modal_button_ok:"Understood"
    },
  },
  eu: {
    translation: {

      // SECCION DE NAVBAR / GENERAL
      home: "Hasiera",
      contact: "Kontaktua",
      favorites: "Gogokoak",
      login: "Saioa hasi",
      register: "Erregistratu",
      logout: "Saioa itxi",
      search_placeholder: "Pelikula bilatu...",
      welcome: "Ongi etorri!", // Bienvenida para el usuario en LOGIN
      hello: "Kaixo", // Bienvenida para el usuario en LOGIN (2)
      login_title: "Saioa Hasi",
      register_title: "Kontua Sortu",
      email_label: "Posta elektronikoa",
      email_placeholder: "zure@posta.com", // Placeholder para el email en LOGIN
      password_label: "Pasahitza",
      username_label: "Erabiltzaile izena",
      username_placeholder: "Adibidez: Bonjovi87",
      login_btn: "Sartu",
      register_button: "Erregistratu",
      already_have_account: "Baduzu kontua?",
      no_account_question: "Ez duzu konturik?",
      login_link: "Hasi saioa",
      register_link: "Eman izena",
      registration_success: "Erregistroa ondo burutu da",
      auth_error: "Sarrera errorea",
      unknown_error: "Ustekabeko errore bat gertatu da",
      view_more: "Gehiago ikusi",

      // SECCION DETALLES DE LA PELICULA
      movie_detail_loading: "Xehetasunak kargatzen...",
      movie_detail_add_fav: "GOGOKOETARA GEHITU",
      movie_detail_already_fav: "GOGOKOETAN DAUDENAK",
      movie_detail_btn_watch: "Ikusi orain",
      movie_detail_login_to_watch: "Saioa hasi edukia ikusteko",
      movie_detail_login_to_rate: "Saioa hasi baloratzeko",
      movie_detail_thanks_rating: "Eskerrik asko pelikula baloratzeagatik!",
      movie_detail_rate_title_section: "Eman zure puntuazioa",
      movie_detail_rate_label: "Oharra (1-10)",
      movie_detail_btn_rate: "Baloratu",
      movie_detail_review_thanks_title: "Eskerrik asko zure iritziagatik",
      movie_detail_review_already_done: "Dagoeneko parte hartu duzu pelikula honen komunitatean",
      movie_detail_write_review: "Esaguzu zer iruditu zaizun",
      movie_detail_placeholder_review: "Idatzi zure iritzia...",
      movie_detail_btn_send_comm: "Iritzia bidali",
      movie_detail_synopsis: "Sinopsia",
      movie_detail_official_trailer: "Trailer Ofiziala",
      movie_detail_community_comments: "Komunitatearen iruzkinak",
      movie_detail_no_comments_yet: "Oraindik ez dago iruzkinik pelikula honi buruz",
      movie_detail_your_rating_display: "Pelikula hau {{nota}} batekin baloratu duzu",
      
      // SECCION MODALES DETALLE
      movie_detail_modal_comm_title: "Iruzkina gordeta",
      movie_detail_modal_comm_msg: "Eskerrik asko zure iritzia emateagatik!",
      movie_detail_modal_rate_title: "Puntuazioa gordeta",
      movie_detail_modal_rate_msg: "Eskerrik asko pelikula baloratzeagatik!",
      movie_detail_modal_fav_title: "Gogokoetara gehituta",
      movie_detail_modal_fav_msg: "Pelikula zure gogokoetara gehitu da",
      movie_detail_login_to_comment:"Saioa hasi pelikula honi buruzko zure iritzia partekatzeko.",
      movie_detail_video_not_supported:"Zure nabigatzaileak ez du bideoa erreproduzitzea onartzen.",

      // SECTION SECCION DE FAVORITOS
      favorites_title_page: "Nire Pelikula Gogokoenak",
      fav_btn_details: "Xehetasunak ikusi",
      fav_btn_remove: "Gogokoetatik kendu",
      fav_error_load_title: "Karga errorea",
      fav_error_load_msg: "Ezin izan ditugu zure gogokoak kargatu",
      fav_removed_title: "Pelikula kenduta",
      fav_removed_msg: "Pelikula ondo kendu da zure gogokoetatik",
      fav_error_delete_title: "Errorea",
      fav_error_delete_msg: "Ezin izan da pelikula kendu",
      auth_required_favs_msg:"Saioa hasi behar duzu zure gogokoen zerrenda kudeatzeko.",

      // SECCION CONTACTO
      contact_banner_title: "Jarri gurekin harremanetan",
      contact_email_label: "E-posta",
      contact_phone_label: "Telefonoa",
      contact_address_label: "Helbidea",
      contact_address_value: "Arrosadiako Campusa, Iruñea",
      contact_map_title: "Gure egoitzak",
      contact_branch_center: "Erdialdeko Bideokluba",
      contact_branch_north: "Iparraldeko Bideokluba",
      contact_branch_south: "Hegoaldeko Bideokluba",

      // SECCION DE PAGINA DE LEGAL
      legal_title: "Lege-oharra",
      legal_sec1_title: "1. Identifikazio Datuak",
      legal_sec1_text: "Webgune hau Ruben Cameo eta Alejandro Guerra ikasleek garatutako proiektu akademikoa da. Ataria web garapeneko irakasgairako hezkuntza-helburuekin soilik sortu da.",
      legal_sec2_title: "2. Jabetza Intelektuala",
      legal_sec2_text: "Ikusizko eduki guztia (pelikulen kartelak, trailerrak eta sinopsiak) dagozkien egileen eta zinema-ekoiztetxeen jabetzakoa da. Plataforma honetan ematen zaion erabilera irakaskuntza-helburuetarako bidezko erabileraren kontzeptupean egiten da.",
      legal_sec3_title: "3. Multimedia Edukia",
      legal_sec3_text: "Egileek ez dute beren gain hartzen kanpoko zerbitzuek emandako datuen zehaztasunaren ardura, ezta zerbitzuaren etengabeko erabilgarritasunarena ere, proba-ingurune bat baita.",

      // SECCION DE ERRORES DE ACCESS SERVICE
      error_email_exists: "Posta hau jada erabiltzen ari da. Saiatu beste batekin edo hasi saioa.",
      error_weak_password: "Pasahitza laburregia da. Gutxienez 6 karaktere erabili.",
      error_invalid_email: "Posta formatu okerra (@ edo puntua falta da).",
      error_general: "Errore tekniko bat gertatu da",

      // SECCION PELICULAS TOP
      top_title: "Pelikulen Sailkapena",
      top_subtitle: "Gure komunitateak hoberen baloratutakoak",
      cat_todas: "Guztiak",
      top_no_desc: "Deskribapenik ez dago eskuragarri.",
      top_view_short: "Ikusi",

      // SECCION HOME
      home_welcome_title: "Karteldegia",
      home_subtitle: "Arakatu zinemako azken berriak",
      home_loading: "Pelikulak kargatzen...",
      home_filter_all: "Kategoria guztiak",
      home_carousel_title: "Nabarmenduak",
      home_set_movies: "Gure Pelikulak",
      home_tab_billboard: "Karteldegian",
      home_tab_upcoming: "Laster",
      home_tab_catalog: "Katalogoa",
      home_title_billboard: "Karteldegiko Pelikulak",
      home_title_upcoming: "Hurrengo Estreinaldiak",
      home_title_catalog: "Gure Katalogo Osoa",
      home_movies_of_category: "{{categoria}} pelikulak",
      cat_accion: "Ekintza",
      cat_drama: "Drama",
      cat_terror: "Beldurra",
      cat_animacion: "Animazioa",
      cat_fantasia: "Fantasia",
      lang_text: "Hizkuntza",
      top_text: "Gorenenak",
      login_text: "Saioa hasi",
      register_text: "Erregistratu",

      // SECCION DE BUSQUEDA
      search_results_for: "Bilaketaren emaitzak: ",
      home_no_results: "Ez da bat datorrenik aurkitu",
      mensaje_error_desconocido:"Sarrera Errorea", // Para mensaje de error desconocido LOGIN

      // SECCION DE FOOTER
      footer_slogan: "Zure zinema, edozein ordutan.",
      footer_location_title:"Kokapena",
      footer_legal:"Lege Oharra",
      footer_privacy:"Pribatutasun Politika",
      titulo_informacion:"Informazioa",
      footer_rights:"Eskubide guztiak erreserbatuta.",
      modal_button_ok:"Ulertuta"
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });
