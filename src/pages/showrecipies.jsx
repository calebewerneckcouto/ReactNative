import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import RecipeReviewCard from './card';
import './../pages/card.css';

function ShowRecipes({ showFavorites }) {
    const { searchByCategory } = useContext(UserContext);

    // Filtra apenas as receitas favoritas se `showFavorites` for verdadeiro
    const filteredRecipes = showFavorites
        ? (searchByCategory || []).filter(recipe => {
            const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
            return favoriteRecipes.includes(recipe.idMeal);
        })
        : searchByCategory;

    return (
        <div className='cardContainer'>
            { filteredRecipes && filteredRecipes.length > 0 ? 
                filteredRecipes.map((element) => (
                    <RecipeReviewCard 
                        key={element.idMeal}
                        id={element.idMeal} 
                        title={element.strMeal} 
                        image={element.strMealThumb} 
                    />
                )) 
                : <p>No recipes found.</p> 
            }
        </div>
    );
}

export default ShowRecipes;
