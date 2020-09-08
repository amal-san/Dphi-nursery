import React from 'react';
import { useQuery, gql } from '@apollo/client';
import './home.css';


const USER_LIST = gql`
query {
	plants {
    id
    name
    price
    description
    photo
  }
}
`;



const Header = () => {
    return (
        <>
        <div className='header'>
             <h4>Dphi Nursery</h4>
        </div>
        <section className='menu'>
            <div> <span> 🌿 </span> Shop Plants </div>
            <div>
                <button> Add Plant</button>
                <button> Records </button>
            </div>

        </section>
        </>
    );
}

const Home = () => {
    const {loading, error,data} = useQuery(USER_LIST);

    if (loading) return <p>Loading..</p>
    if (error) return <p> Error...</p>

    return data.plants.map(({ id , name, price, description, photo  }) => (
        <>
        <Header/>
        <div className="main-card" key={id}> 
            <div className='card'>
                <img src="https://picsum.photos/id/1/200/300" ></img>
                <div>
                    <h3>{name}</h3> 
                    <p>price : {price}</p>
                    <p>description : {description}</p>
                    <div className='card-button'>
                    <a> <span>🛒</span>Cart</a> <a> <span>↗️ </span>Buy now</a>
                    </div>
                </div>
            </div>          
        </div>
        </>
    ));
    
}

export default Home;



