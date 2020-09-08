import React , { useState, useEffect } from 'react';
import { useQuery, gql,useMutation } from '@apollo/client';
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

const Main = () => {
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



const USER_CHECK = gql`
mutation tokenAuth($username:String!,$password:String!){
    tokenAuth(username:$username ,password:$password){
      token
    }
  }`;

const VERIFY_TOKEN = gql`
mutation verifyToken($token:String!){
    verifyToken(token:$token){
      payload
    }
  }
`;


const Login = () => {
    let username,password;
    const [mutate] = useMutation(USER_CHECK)
    const [verifyToken] = useMutation(VERIFY_TOKEN)
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [token , setToken ] = useState(localStorage.getItem('token') ? localStorage.getItem('token'):null)
    const handleClick = async ({variables}) => {
    try {
        const data  = await mutate({variables})
        localStorage.setItem('token', data.data.tokenAuth.token);
        setData(data);
    }
    catch (e) {
        setError(e);
    }
    }
    const tokenVerify = async() => {
        try {
            setToken(localStorage.getItem('token'))
            const data = await verifyToken({variables:{token:token}})
            console.log("logged In")
    
        }
        catch (e){
            console.log("user not logged in")
        }

    }
    useEffect(() => {
        console.log(token)
        if(token){
            tokenVerify();
        }
    },[])

    return (
        <div>
          <p>{error ? "Enter valid credentails":" "}</p>
        <form
            onSubmit={e => {
            e.preventDefault();
            handleClick({variables: {username:username.value,password:password.value}});
            username.value = '';
            password.value = '';
            }}
        >
            <input
            ref={node => {
                username = node;
            }}
            />
            <input
            ref={node => {
                password = node;
            }}
            />
            <button type="submit">Login</button>
        </form>
        </div>

    )
}


const Home = () => {

    const [isloggedIn , setLoggedIn ] = useState(false);
    const [loading, isLoading ] = useState(true)
    
    useEffect(() => {
        setLoggedIn(false);
        isLoading(false);
        
    });

    if (loading) return <p>Loading...</p>
    if (isloggedIn) return <Main/>
    else return <Login/>
    

}

export default Home;



