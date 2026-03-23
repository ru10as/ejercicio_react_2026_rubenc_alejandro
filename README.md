# Plataforma de Streaming - React 2026
Este proyecto es una aplicacion web de catalogo y reproduccion de peliculas desarrollada en React con TypeScript. Implementa una arquitectura robusta y funcionalidades avanzadas de interactividad para el usuario.

# Caracteristicas Principales
- Arquitectura Hexagonal: Separacion clara entre dominio, infraestructura y vistas para facilitar el mantenimiento y la escalabilidad.
- Internacionalizacion (i18next): Soporte completo para multiples idiomas (Español, Ingles y Euskera).
- Gestion de Usuarios: Sistema de autenticacion para acceso a contenido exclusivo.
- Interactividad: - Valoraciones mediante sistema de estrellas con calculo de media en tiempo real.
- Hilo de comentarios por pelicula.
- Gestion de lista de "Favoritos" personalizada.
- Modo Cine: Interfaz optimizada para la visualizacion de trailers y contenido de video local.

# Stack Tecnologico
## Frontend: React 18+ con TypeScript.

## Estilos: Bootstrap y React-Bootstrap.

## Gestion de Estado: Context API (AuthContext).

## Backend / DB: Firebase (gestionado a traves de PeliculaRepository).

## Traducciones: react-i18next.

# Estructura del Proyecto (Hexagonal)
```
src/
└──  public
    ├── imagen_por_peli
    ├── imagenes_banderas
    ├── nueva_cartelera
    └── portadas_peliculas
└──  src
    ├── assets/ 
    └──  components/ 
        └──  access/ 
            └──  view
                ├── access.css
                ├── Login.tsx
                └── Registro.tsx
        └──  peliculas/
            └── view
                └──  CardPelicula
                    ├── cardpelicula.css
                    ├── CardPelicula.tsx
                └──  ModoCine
                    ├── ModoCine.css
                    └──  ModoCine.tsx
        └── ui/
            ├── CarouselPrincipal.tsx
            ├── footer.css
            ├── Footer.tsx
            ├── header.css
            ├── MensajeModal.tsx
            └── Header.tsx
    └── domain/
        ├── Busqueda.ts
        ├── Header.ts
        ├── Home.ts
        ├── IAccessRepository.ts
        ├── IPeliculaRepository.ts
        ├── Pelicula.ts
        ├── ui.ts
        └── Usuario.ts
    └── infrastructure/
        ├── AccessRepository.tsx
        ├── FirebaseAccessRepository.tsx
        ├── FirebasePeliculaRepository.tsx
        ├── LocalStoragePeliculaRepository.tsx
        └── PeliculaRepository.tsx
    └── pages/
        ├── AvisoLegal.tsx
        ├── Contacto.tsx
        ├── detallepelicula.css
        ├── DetallePelicula.tsx
        ├── Favoritos.tsx
        ├── home.css
        ├── Home.tsx
        ├── ResultadoBusqueda.css
        ├── ResultadoBusqueda.tsx
        ├── topPeliculas.css
        └── TopPeliculas.tsx
    └── services/
        └── AuthService.tsx
    └── store/ 
        └── AuthContext.tsx
    └── utils/ 
        └── uiHelpers.tsx    
    ├── App.tsx   
    ├── App.css 
    ├── i18n.ts
    └── main.tsx     
```
# Instalacion
- Clona el repositorio:

Bash
git clone [url-del-repositorio]
Instala las dependencias:

Bash
npm install
Lanza el servidor de desarrollo:

Bash
npm start
Equipo (UPNA)
- Ruben Cameo
- Alejandro Guerra
