import React , { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, gql,useMutation } from '@apollo/client';
import './home.css';
import { useHistory } from 'react-router-dom';
import cogoToast from 'cogo-toast';




const RECORDS = gql`
{
    record {
      id
      createdAt
      orderUser{
        username
        
      }
      orderPlant {
        name
        price
        description
      }
    }
  }
`;




 const RecordDetail = () => {

    const {loading, error, data } = useQuery(RECORDS);

    if(data) console.log(data);

    if (loading) return <p> Loading </p>
    if (error) return <p> error </p>
    return data.record.map(({id , orderPlant, orderUser,createdAt}) => (
        <>
        <div className="main-card" key={id}> 
            <div className='card-record'>
                <div>
                    <p> Ordered by user : <span>{orderUser.username}</span></p>
                    <p>Plant Name : <span> {orderPlant.name}</span></p>
                    <p>Plant price : <span>{orderPlant.price}</span></p>
                    <p> Plant Description <span>{orderPlant.description}</span></p>
                    <p> Created At : <span>{createdAt}</span></p>             
                </div>
            </div>         
         </div>
        </>
    )
   )
}

export const Record = () => {

    return (
        <>
        <Header isManager={false} heading = " 📚 Records"/>
        <RecordDetail/>
        </>
    )

}


const MainList = () => {

    const { data: dataR, error: errorR, loading: loadingR } = useQuery(USER_DETAILS,{variables:{username:localStorage.getItem('username')}});
    let manager;
    if(dataR){

        manager = dataR.userDetails.isManager;
    } 
    return (
        <>
        < Header isManager={manager ? true: false} heading=" Shop Plants"></Header>
        <div className="main-card"> 
        <Main/>
        </div>
        </>

    )


}





const Header = ({ isManager ,heading }) => {

    const history = useHistory();
    const username = localStorage.getItem('token') ? localStorage.getItem('username') : "  ";


    return (
        <>
        <div className='header'>
             <h4>Dphi Nursery</h4>
             <p>{username}</p>
        </div>
        <section className='menu'>
            <div> <p style={{fontSize:'20px'}}>{heading}</p>  </div>
            {isManager ? <div>
                <button > ➕ Add Plant</button>
                <button onClick={() => history.push('/records')} > 📚 Records </button>
            </div> : "  " }

        </section>
        </>
    );
}


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

const USER_DETAILS =gql`

query userDetails($username:String!){
    userDetails(username:$username){
      isManager
    }
  }`;

const Main = () => {

    const {loading, error , data } = useQuery(USER_LIST);
    const [cart , isCart ] = useState(false);

    const addCart = (e) => {
        console.log(e.target.id)
    }

    
    if(loading) return <p> Loading ..</p>
    if(error) return <p> Error ..</p>
    return data.plants.map(({ id , name, price, description, photo  }) => (
    <>
        <div className='card'  key={id}>
                <img src="https://picsum.photos/id/1/200/300" ></img>
                    <div>
                     <h3>{name}</h3> 
                     <p>price : {price}</p>
                     <p>description : {description}</p>
                     <div className='card-button'>
                     <a id ={id} onClick = {addCart}> <span>🛒</span>Cart</a> <a> <span>↗️ </span>Buy now</a>
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



const USER_CREATE = gql`
mutation createUser($username:String!,$password:String!) {
    createUser(input: {
      username:$username
      password:$password
    }) {
      ok
    }
  }
`


const Login = () => {

    let username,password,newUsername,newPassword,newPassword1;
    const history = useHistory();
    const [mutate] = useMutation(USER_CHECK)
    const [createUser] = useMutation(USER_CREATE)
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [signup , isSignup ] = useState(true);

    const handleClick = async ({variables}) => {
    try {
        const data  = await mutate({variables})
        localStorage.setItem('token', data.data.tokenAuth.token);
        localStorage.setItem('username',variables.username) 
        setData(data);
        cogoToast.success("Logging in...");
        setTimeout(function () {window.location.reload()},100);


        
    }
    catch (e) {
        setError(e);
     }
    }
    const signUp = async ({variables}) => {
        try {
            const data  = await createUser({variables})
            cogoToast.success(
            <div>
                <b>Account created ;)</b>
                <div>Now login....</div>
            </div>);
            setTimeout(function () {window.location.reload()},100);
            
        }
        catch (e) {
            isSignup(false)
         }
        }

    
    useEffect(() => {
        
    },[])

    return (
        <>
        <Header isManager={false} heading=" "/>
        <div>
        <div className="login-sign">
        <div>
           <form className ="login-form">   <div>
            <h3 > Login </h3>
            <p className='error-login'>{error ? " * Enter valid credentails":" "}</p>
            <label>Username: </label>
            <input
            ref={node => {
                username = node;
            }}
            name= "username"
            type="text"
            />
            </div>
            <div>
                <label for="password"> Password:  </label>
            <input
            ref={node => {
                password = node;
            }}
            name="password"
            type="password"
            />
            </div>
            <div><button className="btn"  onClick = {e => {
                e.preventDefault();
                handleClick({variables: {username:username.value,password:password.value}});
                username.value = '';
                password.value = '';
            }}type="submit">Login</button></div>
        </form>
        </div>
        <div> <h2> Or </h2></div>
        <div>
            <form>
                <div className="sign-form">
                <h3 style={{marginTop:'1rem',marginBottom:'1rem',margin:'0'}}> Sign Up</h3>
                <div>
                <p className='error-login'>{signUp ? " ":" * Can't create account"}</p>
                <label>Username</label>    
                    <input
                    ref={node => {
                        newUsername = node;
                    }}
                     style={{marginLeft:'65px'}}>
                
                     </input>
                </div>
                <div>
                <label>Password</label>
                    <input 
                    style={{marginLeft:'70px'}}
                    ref={node => {
                        newPassword1 = node;
                    }}
                    type="password"
                    >
                    </input>
                </div>
                <div>
                <label>Confirm Password </label>
                    <input
                    ref={node => {
                        newPassword = node;
                    }}
                    ></input>
                </div>
                <div><button className="btn" type="submit" onClick = {e => {
                e.preventDefault();
                signUp({variables: {username:newUsername.value,password:newPassword.value}});
                newUsername.value = '';
                newPassword.value = '';
                newPassword1.value = '';
                }}
                >Sign Up</button>
                </div>
            </div>
            
            </form>
        </div>
        </div>
    </div>
    </>

    )
}



const VERIFY_TOKEN = gql`
mutation verifyToken($token:String!){
    verifyToken(token:$token){
      payload
    }
  }
`;


const Home = () => {

    const [isloggedIn , setLoggedIn ] = useState(null);
    const [loading, setLoading ] = useState();
    const [verifyToken] = useMutation(VERIFY_TOKEN)
    const [token , setToken ] = useState(localStorage.getItem('token') ? localStorage.getItem('token'):null)



    const tokenVerify = async() => {
        setLoading(true)
        try {
            setToken(localStorage.getItem('token'))
            const data = await verifyToken({variables:{token:token}})
            console.log("userLoggedIn")
            setLoggedIn(true);
    
        }
        catch (e){
            setLoggedIn(false);
            console.log("Invalid token")
        }
    
    
    }
    
    useEffect(() => {
        if(token){
            tokenVerify();
        }
        else {
            console.log("user not logged in")
            setLoggedIn(false);
        }
        setLoading(false);
        
    },[]);


    if (loading) return <p> Loading ..</p>
    if (isloggedIn) return  <MainList/>
    if (!isloggedIn) return  <Login/>

    

}

export default Home;



