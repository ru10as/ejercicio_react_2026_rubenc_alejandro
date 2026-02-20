import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Contacto() {
  const sedes = [
    { nombre: 'Videoclub Centro', lat: 42.8167, lng: -1.6500 },
    { nombre: 'Videoclub Norte', lat: 42.8200, lng: -1.6400 },
    { nombre: 'Videoclub Sur', lat: 42.8100, lng: -1.6550 },
  ];

  return (
    <>
      <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
        <img src="imagen_por_peli/tunel_buena.webp" alt="Banner Contacto" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <h1 style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff'
        }}>
          Ponte en contacto con nosotros
        </h1>
      </div>

      {/* Info de contacto */}
      <div style={{ padding: '20px' }}>
        <p>Email: contacto@ramovies.com</p>
        <p>Teléfono: +34 123 456 789</p>
        <h2>Nuestras sedes / videoclubs</h2>

        {/* Mapa interactivo */}
        <MapContainer center={[42.8167, -1.6500]} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {sedes.map((sede, index) => (
            <Marker key={index} position={[sede.lat, sede.lng]}>
              <Popup>{sede.nombre}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  )
}

export default Contacto;