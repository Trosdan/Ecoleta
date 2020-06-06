import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Popup, Marker} from 'react-leaflet'
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg'
import axios from 'axios';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [Ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelecteduf] = useState('0');

  useEffect(() => {
    getItems();
  }, [])

  const getItems = useCallback(async () => {
    try {
      const { data } = await api.get('/items');
      setItems(data);
    } catch (error) {
      alert('Não foi possivel carregar os itens.');
    }
  }, [])


  useEffect(() => {
    getUf();
  }, [])

  const getUf = useCallback(async () => {
    try {
      const { data } = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      const ufInitials = data.map(uf => uf.sigla);

      setUfs(ufInitials);
    } catch (error) {
      alert('Não foi possivel carregar os Estados.');
    }
  }, []);

  const handleSelectUf = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;

    setSelecteduf(uf);
  }, [])

  useEffect(() => {
    if(selectedUf === '0'){
      return;
    }
    getCities();
  }, [selectedUf])

  const getCities = useCallback(async () => {
    try {
      const { data } = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      const cityNames = data.map(city => city.nome);
      setCities(cityNames);
    } catch (error) {
      alert('Não foi possivel carregar os Municipios.');
    }
  }, [selectedUf])
  
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft/>
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-7.1460306, -34.9175803]} zoom={15}  onclick={console.log}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[-7.1460306, -34.9175803]}/>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select 
                name="uf" 
                id="uf" 
                value={selectedUf} 
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {Ufs.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city">
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id} >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  );
};

export default CreatePoint;