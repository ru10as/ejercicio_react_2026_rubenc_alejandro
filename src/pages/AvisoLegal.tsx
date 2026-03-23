import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function AvisoLegal() {

    // Para tratar con los multiples idiomas
    const{t} = useTranslation();

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className='mb-4 text-white mt-4'>{t('legal_title')}</h1>

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>{t('legal_sec1_title')}</h3>
                        <p className='text-white'>
                            {t('legal_sec1_text')}
                        </p>
                    </section>
                    

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>{t('legal_sec2_title')}</h3>
                        <p className='text-white'>
                            {t('legal_sec2_text')}
                        </p>
                    </section>

                    <section className='mb-4'>
                        <h3 className='text-uppercase fw-bold text-secondary'>{t('legal_sec3_title')}</h3>
                        <p className='text-white'>
                            {t('legal_sec3_text')} 
                        </p>
                    </section>

                    <section>

                    </section>
                </Col>
            </Row>
        </Container>
    );
}

export default AvisoLegal;