import React, { useState } from 'react';
import './cep.css'; // Importe o CSS aqui
import { useNavigate } from 'react-router-dom';

function CEP() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState(null);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();


    
const handleLogout = () => {
   
    const userId = localStorage.getItem('userId');

   
    fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Enviar o userId para o servidor
    })
    .then(response => {
        if (response.ok) {
           
            localStorage.removeItem('userId');
            localStorage.removeItem('token');

            
            window.location.href = '/';
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
       
    });
};

const handleJsonPlaceHolder = () => {
    navigate('/jsonplaceholder');
};


    const handleTreinarSQL = () => {
        navigate('/sql');
    };

    const handleComandos = ()=>{
        navigate('/comandos');
    };

    const handleCardapio = ()=>{
        navigate('/heroinput');
    };

    const buscarEndereco = async () => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) {
                throw new Error('CEP não encontrado');
            }
            const data = await response.json();
            setEndereco(data);
            setErro('');
        } catch (error) {
            setEndereco(null);
            setErro('CEP não encontrado. Verifique o CEP digitado.');
            console.error('Erro ao buscar endereço:', error);
        }
    };

    const handleChangeCep = (e) => {
        const valorCep = e.target.value.replace(/\D/g, ''); 
        setCep(valorCep);
    };

    return (
        
        <div className="container"> {/* Aplicando a classe "container" para aplicar estilos gerais */}
            <h2>Consulta de Endereço por CEP</h2>
            <button onClick={handleTreinarSQL}>Treinar SQL</button>
            <button onClick={handleJsonPlaceHolder}>Api PlaceHolder</button>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleComandos}>Comandos Sql</button>
            <button onClick={handleCardapio}>Cardápio</button>

            
            <div className="form-container"> {/* Aplicando a classe "form-container" para estilizar o formulário */}
                <label htmlFor="cepInput">Digite o CEP:</label>
                <input
                    type="text"
                    id="cepInput"
                    placeholder="Digite o CEP..."
                    value={cep}
                    onChange={handleChangeCep}
                />
                <button onClick={buscarEndereco}>Buscar</button>
            </div>
            {erro && <p className="error-message">{erro}</p>} {/* Aplicando a classe "error-message" para estilizar mensagens de erro */}
            {endereco && (
                <div>
                    <h3>Dados do Endereço</h3>
                    <table className="address-table"> {/* Aplicando a classe "address-table" para estilizar a tabela de endereço */}
                        <tbody>
                            <tr>
                                <th>CEP:</th>
                                <td>{endereco.cep}</td>
                            </tr>
                            <tr>
                                <th>Logradouro:</th>
                                <td>{endereco.logradouro}</td>
                            </tr>
                            <tr>
                                <th>Bairro:</th>
                                <td>{endereco.bairro}</td>
                            </tr>
                            <tr>
                                <th>Cidade:</th>
                                <td>{endereco.localidade}</td>
                            </tr>
                            <tr>
                                <th>Estado:</th>
                                <td>{endereco.uf}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CEP;
