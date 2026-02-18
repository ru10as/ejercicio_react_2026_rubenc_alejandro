import React from "react";
import CarouselPrincipal from "../components/ui/CarouselPrincipal";
import './home.css';

function Home(){
    return(
        <div>
            <main>
                <h1 className='text-center my-5 fw-bold text-uppercase' style={{ color: '#1f6c6c' }}>
                    Principales Carteleras
                </h1>
                <CarouselPrincipal />

            </main>
        </div>
    )
}
export default Home;