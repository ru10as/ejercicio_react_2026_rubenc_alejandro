import './header.css'
import { Container, Nav, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderProps } from '../../domain/Header';

  /* interface HeaderProps{
    onSearch: (parametro:string) => void;
  } */

function Header({onSearch}:HeaderProps){
    //
    const authCtx = useContext(AuthContext);

    //
    const navigate = useNavigate();

    //
    let contenidoDerecha;

    //
    const {t,i18n} = useTranslation();

    
    const manejo_de_busqueda = (texto:string) => {
        if(location.pathname !== '/' && texto.length > 0){
            navigate('/');
        }
        onSearch(texto);
    }


    //
    const activeLenguage = (lang:string) => {                   //
        if (i18n.language === lang){                            // 
            return 'nav-link-custom active-lang fw-bold mx-1';  // Le metemos lo de active-lang
        }else{                                                  //
            return 'nav-link-custom mx-1';                      //
        }
    }

    // 
    if (!authCtx.login){
        contenidoDerecha = (
            <>
                <Link to="/login" className='btn btn-sm btn-outline-info fw-semibold mx-1'>{t('login_text')}</Link>
                <Link to="/registro" className='btn btn-sm btn-outline-info fw-semibold mx-1'>{t('register_text')}</Link>
            </>
        )
    }

    // 
    else{
        contenidoDerecha = (
            <button
                className='btn btn-sm btn-outline-danger fw-semibold mx-1'
                onClick={() => {
                    authCtx.logoutAction();
                    navigate('/');
                }}>
                {t('logout')}
            </button>
        )
    }

    //
    return (
        <>
            <Navbar className="header-nav" sticky="top" style={{ padding: "10px 0" }} expand="md">
                <Container>
                    <NavbarBrand as={Link} to="/" className="brand-name">
                        <i className='bi bi-film me-2' style={{ color: '#2d9d9d' }}></i>
                        R&A Movies
                    </NavbarBrand>

                    <NavbarToggle aria-controls="main-nav" style={{ borderColor: '#2d9d9d' }} />
                    
                    <NavbarCollapse id="main-nav" className='ms-md-5'>

                        {/* LA PARTE DEL BUSCADOR */}
                        <div className='mx-auto' style={{width:'100%', maxWidth:'400px'}}>
                            <div className='input-group'>
                                <span style={{borderColor:'#2d9d9d'}}>
                                    <i className='bi bi-search'></i>
                                </span>
                                <input type='search' className='bg-transparent text-white' style={{borderColor:'#2d9d9d'}} placeholder={t('search_placeholder')}
                                onChange={(e) => manejo_de_busqueda(e.target.value)}></input>
                            </div>
                        </div>

                        {/* EL RESTO DE COSAS DE LA CABECERA */}
                        <Nav className='ms-auto align-items-center'>
                            <Nav.Link as={Link} to="/" className="nav-link-custom">{t('home')}</Nav.Link>
                            <Nav.Link as={Link} to="/contacto" className="nav-link-custom">{t('contact')}</Nav.Link>
                            <Nav.Link as={Link} to="/top-peliculas" className="nav-link-custom">{t('top_text')}</Nav.Link>
                            {authCtx.login && (
                                <Nav.Link as={Link} to="/favoritos" className="nav-link-custom">{t('favorites')}</Nav.Link>
                            )}

                            <NavDropdown id='lenguage_de_dropdown' title={<span className="text-white">{t('lang_text')}</span>}>
                                <NavDropdown.Item onClick={() => i18n.changeLanguage('es')}>
                                    ES
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => i18n.changeLanguage('en')}>
                                    EN
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => i18n.changeLanguage('eu')}>
                                    EU
                                </NavDropdown.Item>
                            </NavDropdown>

                            {/* <div>
                                <button onClick={() => i18n.changeLanguage('es')} className={activeLenguage('es')} 
                                    style={{background:'none', border:'none', color:'inherit'}}>ES</button>
                                <button onClick={() => i18n.changeLanguage('en')} className={activeLenguage('en')} 
                                    style={{background:'none', border:'none', color:'inherit'}}>EN</button>
                                <button onClick={() => i18n.changeLanguage('eu')} className={activeLenguage('eu')} 
                                    style={{background:'none', border:'none', color:'inherit'}}>EU</button>
                            </div> */}

                            <Nav className='ms-2'>
                                {contenidoDerecha}
                            </Nav>
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </>
    )
}
export default Header;
