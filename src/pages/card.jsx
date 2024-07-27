import React, { useState } from 'react'
import './card.css'

function Card({title, image}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentCommand, setCurrentCommand] = useState('');
	const openModal = () => {
        setCurrentCommand();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
	return(
			<div className='card' >
                <h4>{title} </h4>
				<img className='cardImage' src={image} onClick={openModal}/>
				{isModalOpen && (
                <div className="modal">
                    <div className="modal-content" onClick={closeModal}>
                        <span className="close-button" >&times;</span>
						<h2>{currentCommand}</h2>
						<h4>{title}</h4>
						<img className='cardImage' src={image}/>
                        
                        
                    </div>
                </div>
            )}
			</div>
			
    )
}


export default Card
