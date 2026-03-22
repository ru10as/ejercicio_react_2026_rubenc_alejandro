import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import "./home.css";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import CardPelicula from "../components/peliculas/view/CardPelicula/CardPelicula";
import type { Pelicula } from "../domain/Pelicula";
import type { FirebasePelicula } from "../domain/Pelicula";
import type { FirebaseResponse } from "../domain/Pelicula";
import ResultadosBusqueda from "./ResultadosBusqueda";
import { useTranslation } from "react-i18next";
import { HomeProps } from "../domain/Home";
import { PeliculaFirebase } from "../domain/Pelicula";
import { PeliculaRepository } from "../infrastructure/PeliculaRepository";
import AuthContext from "../store/AuthContext";

// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function Home({ textobuscado }: HomeProps) {
  // Categoria que se haya seleccionado en el catalogo
  const [categoriaActual, setCategoriaActual] = useState<string>("Todas");

  // Lo que vamos a emplear para traducir los textos
  const { t } = useTranslation();

  // Tomamos el contexto actual
  const authCtx = useContext(AuthContext);

  // tomamos el id del usuario
  const userId = authCtx.userID;

  // tomamos el token
  const token = authCtx.idToken;

  // Definimos todas las categorias disponibles
  const categorias: string[] = [
    "Todas",
    "Accion",
    "Drama",
    "Terror",
    "Animacion",
    "Fantasía",
  ];

  // La lista general de peliculas en la base de datos
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  // Que pestaña del nav es la que esta elegida
  const [seccionActiva, setSeccionActiva] = useState<string>("cartelera");

  // Tomamos la lista de peliculas favoritas
  const [listaFavoritosIds, setListaFavoritosIds] = useState<number[]>([]);

  // ----------------------------------------------------------------------------------------------------------
  // Asi de esta forma cargamos los datos del Repo cona las pelis validas (empleamos funcion de infrastructure)
  useEffect(() => {
        // 1. Cargar pelis
        PeliculaRepository.getAvailableMovies().then(data => setPeliculas(data));

        // 2. Cargar favoritos del usuario si está logueado
        if (userId && token) {
            PeliculaRepository.getFavoritoById(userId,token)
                .then(ids => setListaFavoritosIds(ids));
        }
    }, [userId, token]);
    // ----------------------------------------------------------------------------------------------------------


  // Iniciamos la variable donde luego vamos a colocar un contenido y otro
  let contenido;

  // filtramos para quedarnos solo con las que ya han salido pero en el 2026
  const peliculasCartelera = peliculas.filter(
    (p) => !p.proximamente && p.fecha_estreno.includes("2026"),
  );

  // Nos quedamos con las peliculas que van a salir proximamente
  const peliculasProximamente = peliculas.filter((p) => p.proximamente);

  // NOs quedamos con las pelis que, ni van a salir proximamente y que son previas al 2026
  const peliculasCatalogo = peliculas.filter(
    (p) => !p.proximamente && !p.fecha_estreno.includes("2026"),
  );

  // Aplicamos el filtro segun lo que haya elegido
  const pelisFiltradas = peliculasCatalogo.filter((peli: Pelicula) => {
    if (categoriaActual === "Todas") return true;
    return peli.es?.categoria === categoriaActual;
  });

  // Definimos lo que es el grid de tarjetas
  const renderTarjetasPelicula = (lista: Pelicula[]) => (
    <Row>
      {lista.map((peli) => (
        <CardPelicula peli={peli} key={peli.id} isFavorite={listaFavoritosIds.includes(peli.id)}></CardPelicula>
      ))}
    </Row>
  );

  // Aqui decidimos que es lo que vamos a mostrar: si hay texto en el buscador, mostramos
  if (textobuscado.length > 0) {
    contenido = (
      <ResultadosBusqueda peliculas={peliculas} textointroducido={textobuscado}>
      </ResultadosBusqueda>
    );
  } else { // Pero si no hay contenido en el buscador
    contenido = (
      <>
        {/*Seccion de carrusel*/}
        <div className="py-4 bg-dark text-white text-center">
          <h1 className="text-center my-5 fw-bold seccion-titulo">
            {t("home_carousel_title")}
          </h1>
          <CarouselPrincipal peliculas={peliculas} />
        </div>

        {/* Seccion de lo que son las peliculas (conjunto) */}
        <Container
          className="my-5 py-4 px-4 seccion-peliculas"
          style={{ color: "white" }}
        >
          {/* Cabecera de seccion */}
          <section className="text-center mb-3">
            {/*Titulo*/}
            <h3 className="pt-2 pb-3" style={{ color: "white", fontWeight: 700 }}>
              {t("home_set_movies")}
            </h3>

            {/*Para la navegacion de tabs*/}
            <Nav variant="tabs" activeKey={seccionActiva}
              onSelect={(k) => setSeccionActiva(k!)} className="nav-tabs-custom justify-content-center">
              
              {/*Nav de cartelera*/}
              <Nav.Item>
                <Nav.Link eventKey="cartelera">
                  {t("home_tab_billboard")}
                </Nav.Link>
              </Nav.Item>

              {/*Nav de proximamente*/}
              <Nav.Item>
                <Nav.Link eventKey="proximamente">
                  {t("home_tab_upcoming")}
                </Nav.Link>
              </Nav.Item>

              {/*Nav de categoria completa*/}
              <Nav.Item>
                <Nav.Link eventKey="cat_completo">
                  {t("home_tab_catalog")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </section>

          {/*Contenido dinamico para renderizar segun*/}
          <Container>
            {/*Para SECCION DE CARTELERA*/}
            {seccionActiva === "cartelera" && (
              <section className="text-center">
                <h3 className="pt-3 pb-3">{t("home_title_billboard")}</h3>
                {renderTarjetasPelicula(peliculasCartelera)}
              </section>
            )}

            {/*Para seccion de PROXIMAMENTE*/}
            {seccionActiva === "proximamente" && (
              <section className="text-center">
                <h3 className="pt-3 pb-3">{t("home_title_upcoming")}</h3>
                {renderTarjetasPelicula(peliculasProximamente)}
              </section>
            )}

            {/*Para seccion de CATEGORIA COMPLETA*/}
            {seccionActiva === "cat_completo" && (
              <>
                {/*La botonera para las subcategorias*/}
                <section className="mt-3 text-center">
                  <h3 className="pt-3 pb-3">{t("home_title_catalog")}</h3>
                  <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                    {categorias.map((cat) => (
                      <button
                        key={cat}
                        className={`btn-categoria ${categoriaActual === cat ? "activo" : ""}`}
                        onClick={() => setCategoriaActual(cat)}
                      >
                        {t("cat_" + cat.toLowerCase())}
                      </button>
                    ))}
                  </div>
                </section>

                {/**/}
                <section className="pb-5">
                  <h3 style={{ margin: "20px" }} className="text-center">
                    {t("home_movies_of_category", {
                      categoria: t("cat_" + categoriaActual.toLowerCase()),
                    })}
                  </h3>
                  {renderTarjetasPelicula(pelisFiltradas)}
                </section>
              </>
            )}
          </Container>
        </Container>
      </>
    );
  }

  return (
    <div>
      <main style={{ backgroundColor: "#171616ff", minHeight: "100vh" }}>
        {contenido}
      </main>
    </div>
  );
}
export default Home;
