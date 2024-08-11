import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import './heroinput.css'; // Arquivo de estilos CSS para a tabela de imagens
import ShowRecipes from './showrecipies';

function HeroInputField() {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState('');
    const [showFavorites, setShowFavorites] = useState(false);
    const { setSearchByCategory, setRecipes } = useContext(UserContext);
    const navigate = useNavigate();

    const handleTreinarSQL = () => {
        navigate('/sql');
    };

    const handleJsonPlaceHolder = () => {
        navigate('/jsonplaceholder');
    };

    const handleCep = () => {
        navigate('/cep');
    };

    const handleLogout = () => {
        const userId = localStorage.getItem('userId');

        fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
                navigate('/');
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
                const data = await response.json();
                console.log(data); // Verificar a estrutura dos dados recebidos

                if (data && data.meals) {
                    setOptions(data.meals); // Configurar o estado 'options' com o array de 'meals'
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSelect = (event) => {
        setSelected(event.target.value);
    };

    const fetchRecipeCategory = async () => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selected}`);
            const data = await response.json();
            console.log(data); // Verificar a estrutura dos dados recebidos

            if (data && data.meals) {
                setSearchByCategory(data.meals); // Configurar o estado 'searchByCategory' com o array de 'meals'
            }
        } catch (error) {
            console.error('Erro ao buscar receitas:', error);
        }
    };

    const handleToggleFavorites = () => {
        setShowFavorites(!showFavorites);
        // Atualiza as receitas mostradas se for necessário
        if (!showFavorites) {
            const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
            setSearchByCategory(prev => prev.filter(recipe => favoriteRecipes.includes(recipe.idMeal)));
        } else {
            // Recarrega todas as receitas se estiver mostrando favoritos
            fetchRecipeCategory(); // Pode precisar ajustar para garantir que recarregue todas as receitas
        }
    };

    return (
        <div>
            <label>Menu:</label>
            <button onClick={handleTreinarSQL}>Treinar SQL</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCep}>Api Via Cep</button>
            <button onClick={handleJsonPlaceHolder}>Api JsonPlaceHolder</button>
           
            <br></br>
            <label>Categorias:</label>
            <select onChange={handleSelect}>
                <option disabled={selected}>Selecione a categoria</option>
                { options.length > 0 ? 
                options.map((element) => (
                    <option key={element.strCategory}>{element.strCategory}</option>
                )): <option>Erro!</option> }
            </select>
            <button disabled={!selected} onClick={fetchRecipeCategory}>Pesquisar</button>
            <button onClick={handleToggleFavorites}>
                {showFavorites ? 'Mostrar Todas' : 'Favoritos'}
            </button>
            <ShowRecipes showFavorites={showFavorites} />
        </div>
    );
}

export default HeroInputField;
