import React from 'react';
import './main.css';
import Footer from '../components/footer';
import Header from '../components/header';
import ImageTable from '../pages/ImageTable'; // Importa o componente de tabela de imagens

function Main() {
    // Array de URLs de imagens
    const images = [
        '1.jpeg',
        '2.jpg',
        '3.jpeg',
       
    ];

    return (
        <div>
            <Header />
            <div className='main-content'>
                <ImageTable images={images} />
            </div>
            <Footer />
        </div>
    );
}

export default Main;
