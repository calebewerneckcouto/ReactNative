import React from 'react';
import './ImageTable.css'; // Arquivo de estilos CSS para a tabela de imagens

const ImageTable = ({ images }) => {
    return (
        <div className='image-table-container'>
            <h2>Praticando SQL</h2>
            <table className='image-table'>
                <tbody>
                    <tr>
                        {images.map((image, index) => (
                            <td key={index}>
                                <img src={image} alt={`Imagem ${index + 1}`} className='image-item' />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ImageTable;
