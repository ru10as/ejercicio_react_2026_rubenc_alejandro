import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix para los iconos de Leaflet en produccion con bundlers (Vite/Webpack)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


// ESTRUCTURA HEXAGONAL = SI
// TODO INDICADO CON MENSAJES = SI
// IDIOMAS = SI

function Contacto() {
  // Coordenadas geograficas para mostrar la vista inicial
  const posicionCentro: LatLngExpression = [42.8167, -1.6500];

  // Para tratar con los multiples idiomas
  const {t} = useTranslation();

  // Distintas sedes donde vamos a vender peliculas
  const sedes = [
    { nombre: t('contact_branch_center'), lat: 42.8167, lng: -1.6500 }, 
    { nombre: t('contact_branch_north'), lat: 42.8200, lng: -1.6400 },  
    { nombre: t('contact_branch_south'),   lat: 42.8100, lng: -1.6550 },   
  ];

  return (
    <div style={{ backgroundColor: '#171616', minHeight: '100vh', color: 'white' }}>

      {/* Es lo que es el contenedor principal por asi decir */}
      <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>

        {/* Aqui vamos a poner una imagen decorativa de fondo */}
        <img
          src="imagen_por_peli/tunel_buena.webp"
          alt="Banner Contacto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Aqui los textos principales del banner alineados al centro */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(23,22,22,0.85) 100%)'
        }} />

        {/* Los textos principales del banner */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1 className='fw-bold text-white text-center' style={{ letterSpacing: '1px' }}>
            {t('contact_banner_title')}
          </h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#2d9d9d', borderRadius: '2px', marginTop: '10px' }} />
        </div>
      </div>

      {/* Es el cuerpo principal de nuestra pagina  */}
      <Container className='py-5'>

        {/* Tarjetas de contacto */}
        <Row className='g-4 mb-5 justify-content-center'>
          {/* Tarjeta del correo electronico */}
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-envelope-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>{t('contact_email_label')}</h6>
              <p className='mb-0 text-white-50'>contacto@ramovies.com</p>
            </div>
          </Col>

          {/* Tarjeta de atencion telefonica */}
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-telephone-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>{t('contact_phone_label')}</h6>
              <p className='mb-0 text-white-50'>+34 123 456 789</p>
            </div>
          </Col>

          {/* Tarjeta de ubicacion fisica */}
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-geo-alt-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>{t('contact_address_label')}</h6>
              <p className='mb-0 text-white-50'>{t('contact_address_value')}</p>
            </div>
          </Col>
        </Row>

        {/* Mapa con las sedes  */}
        <h4 className='fw-bold mb-4' style={{ color: '#2d9d9d' }}>
          <i className='bi bi-pin-map-fill me-2'></i>{t('contact_map_title')}
        </h4>

        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(45,157,157,0.25)' }}>
          
          {/* Inicializamos el mapa interactivo */}
          <MapContainer center={posicionCentro} zoom={13} style={{ height: '360px', width: '100%' }}>

            {/*  */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {sedes.map((sede, index) => (
              <Marker key={index} position={[sede.lat, sede.lng]}>
                <Popup>{sede.nombre}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </Container>
    </div>
  );
}

export default Contacto;
