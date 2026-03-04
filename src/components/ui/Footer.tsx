import './footer.css'

function Footer(){
    return(
        <footer className='footer'>
            <div className='row'>
                <div className='col'>
                    <h5 className='titulo_footer'>R&A Movies</h5>
                </div>
                <div className='col'>
                    <h5 className='titulo_footer'>Donde estamos</h5> 
                    <div>
                        <p className='donde_estamos text-secondary small'>Campus de Arrosadia</p>
                        <p className='donde_estamos text-secondary small'>31006 Pamplona, Navarra</p>
                        <p className='donde_estamos text-secondary small'>ra_movies@gmail.com</p>
                    </div>
                </div>
                <div className='col'>
                    <h5 className='titulo_footer'>Siguenos</h5>
                    <div>
                        <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-instagram me-2'></i>Instagram</a></div>
                        <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-twitter-x me-2'></i>Twitter</a></div>
                        <div><a href='#' className='enlaces_footer text-secondary small'><i className='bi bi-facebook me-2'></i>Facebook</a></div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;