import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'



import './heroinput.css'; // Arquivo de estilos CSS para a tabela de imagens

import ShowRecipes from './showrecipies';




function HeroInputField() {
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState('')
    const {setSearchByCategory, setRecipes } = useContext(UserContext)
    const navigate = useNavigate();

  
    const handleTreinarSQL = () => {
        navigate('/sql');
    };   

    const handleJsonPlaceHolder = () => {
        navigate('/jsonplaceholder');
    };

    const handleCep = ()=>{
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
		}, [])

        const handleSelect = (event) => {
            const { target } = event
            setSelected(target.value);
            };

        const fetchRecipeCategory = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selected}`);
                const data = await response.json();
                console.log(data); // Verificar a estrutura dos dados recebidos

                if (data && data.meals) {
                    setSearchByCategory(data.meals); // Configurar o estado 'options' com o array de 'meals'
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
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
            <select onChange={(event) => handleSelect(event)}>
                <option disabled={selected}>Selecione a categoria</option>
                { options.length > 0 ? 
                options.map((element) => (
                    <option >{element.strCategory}</option>
                )): <option>Erro!</option> }
            </select>
            <button disabled={!selected} onClick={fetchRecipeCategory}>Pesquisar</button>
           <ShowRecipes/>
           
        </div>
    );
}

export default HeroInputField;
