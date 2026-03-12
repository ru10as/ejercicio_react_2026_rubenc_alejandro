import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import { Container, Row, Col } from 'react-bootstrap';

function Contacto() {

  const posicionCentro: LatLngExpression = [42.8167, -1.6500];

  const sedes = [
    { nombre: 'Videoclub Centro', lat: 42.8167, lng: -1.6500 },
    { nombre: 'Videoclub Norte', lat: 42.8200, lng: -1.6400 },
    { nombre: 'Videoclub Sur',   lat: 42.8100, lng: -1.6550 },
  ];

  return (
    <div style={{ backgroundColor: '#171616', minHeight: '100vh', color: 'white' }}>

      {/* Banner */}
      <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
        <img
          src="imagen_por_peli/tunel_buena.webp"
          alt="Banner Contacto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(23,22,22,0.85) 100%)'
        }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h1 className='fw-bold text-white text-center' style={{ letterSpacing: '1px' }}>
            Ponte en contacto con nosotros
          </h1>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#2d9d9d', borderRadius: '2px', marginTop: '10px' }} />
        </div>
      </div>

      <Container className='py-5'>

        {/* Tarjetas de contacto */}
        <Row className='g-4 mb-5 justify-content-center'>
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-envelope-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>Email</h6>
              <p className='mb-0 text-white-50'>contacto@ramovies.com</p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-telephone-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>Teléfono</h6>
              <p className='mb-0 text-white-50'>+34 123 456 789</p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <div className='text-center p-4 rounded' style={{ backgroundColor: '#1c2b29', border: '1px solid rgba(45,157,157,0.2)' }}>
              <i className='bi bi-geo-alt-fill mb-3 d-block' style={{ fontSize: '1.8rem', color: '#2d9d9d' }}></i>
              <h6 className='text-uppercase fw-bold mb-1' style={{ color: '#2d9d9d', letterSpacing: '1px', fontSize: '0.8rem' }}>Dirección</h6>
              <p className='mb-0 text-white-50'>Campus de Arrosadia, Pamplona</p>
            </div>
          </Col>
        </Row>

        {/* Mapa */}
        <h4 className='fw-bold mb-4' style={{ color: '#2d9d9d' }}>
          <i className='bi bi-pin-map-fill me-2'></i>Nuestras sedes
        </h4>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(45,157,157,0.25)' }}>
          <MapContainer center={posicionCentro} zoom={13} style={{ height: '360px', width: '100%' }}>
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
