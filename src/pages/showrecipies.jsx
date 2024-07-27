import React, { useContext } from 'react'

import Card from './card'
import './card.css'

import { UserContext } from '../context/userContext'

function ShowRecipes() {
    const { searchByCategory } = useContext(UserContext)
    console.log(searchByCategory)
    
	return(
        <div className='cardContainer'>
		{ searchByCategory && searchByCategory.map((element) => (
            <Card title={element.strMeal} image={element.strMealThumb} />
        ))}
        </div>
	)
}


export default ShowRecipes
