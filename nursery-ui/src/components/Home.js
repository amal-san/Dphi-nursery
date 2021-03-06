import React , { useState, useEffect } from 'react';
import { useQuery,gql,useMutation } from '@apollo/client';
import './home.css';
import { useHistory } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';


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

    if (loading) return <p> Loading </p>
    if (error) return <p> error </p>
    return data.record.map(({id , orderPlant, orderUser,createdAt}) => (
        <>
        <div className="main-card" key={id}> 
            <div className='card-record'>
                <div>
                    <p> Ordered by user : <span>{orderUser.username}</span></p>
                    <p>Plant Name : <span> {orderPlant.name}</span></p>
                    <p>Plant price : <span>{orderPlant.price}</span> ₹</p>
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

const USER_DETAILS =gql`

query userDetails($username:String!){
    userDetails(username:$username){
      isManager
      orderPlaced {
        id
        name
        price
        description
        photo
      }
      cart {
        id
        name
        price
        description
        photo
      }
    }
  }`;

const OTHER_PLANTS = gql`
query otherPlants($username:String!){
    otherPlants(username:$username){
        id
        name
        price
        description
        photo
    }
  }
`;


const MainList = () => {

    const { data: dataR, refetch:refetchR} = useQuery(USER_DETAILS,{variables:{username:localStorage.getItem('username')}});
    const { data, refetch} = useQuery(OTHER_PLANTS,{variables:{username:localStorage.getItem('username')}})
    const [plants , setPlants ] = useState([]);
    const [method , setMethod ] = useState("other");
    let manager;
    if(dataR){

        manager = dataR.userDetails.isManager;
        
    } 
    const click =  (e) => {
        if(e.target.value === "InCart"){
            setPlants(dataR.userDetails.cart)
            setMethod("cart")
            refetchR();
        }
        else if(e.target.value === "Buy" ){
            setPlants(dataR.userDetails.orderPlaced)
            setMethod("buy")
            refetchR();


        }
        else if(e.target.value === "other"){
            setPlants(data.otherPlants);
            setMethod("other")
            refetch();

        }
        else {
            setPlants([]);
        }
         
    }
    useEffect(() => {
        if(data){
            setPlants(data.otherPlants)
        }


    },[data])
    return (
        <>
        <Header isManager={manager ? true: false} heading="🌿 Shop Plants"></Header>
        <div className="main-card" key={true}>
            <div className="sort-plants">
              <div>
                <select name="methods" id="plants" onClick={click} onPointerEnter={click} onPointerOut={click}>
                    <option value="other">Plants</option>
                    <option value="Buy"> Plants Buyed </option>
                    <option value="InCart"> Plants in Cart</option>
                </select>        
                </div>
            </div> 
         <Main plants = {plants} method = {method}/>
        </div>
        </>

    )


}


const CREATE_PLANT = gql`
mutation createPlant($name:String!,$price:Int!,$description:String!) {
    createPlant(name:$name,price:$price,description:$description){
      ok
    }
  }
`;


const AddPlantModal = (props) => {

    let name,price,description;

    const [createplant] = useMutation(CREATE_PLANT);
    const addPlant = async ({variables}) => {

        try {
            const data  = await createplant({variables})
            cogoToast.success("Plant created successfully.");
            props.onHide();

            
        }
        catch (e) {
            cogoToast.warn("can't create plant");
            props.onHide();

         }
        setTimeout(function () {window.location.reload()},200);
    }
   


    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Add Plant
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <div className='add-plant'>
             <div>
                 <label> Name: </label>
            <input  
                ref={node => {
                name = node;
                }} 
                name='text'
                required
                >
            </input>
             </div>
             <div>
                 <label> Price: </label>
                 <input  
                ref={node => {
                price = node;
                }} 
                name='text'
                type='number'
                required
                >
            </input>
             </div>
             <div>
                 <label>Description: </label>
                 <textarea
                 required  
                ref={node => {
                description = node;
                }} 
                >
            </textarea>
             </div>
             <div>
                 <input className="submit-addplant" type="submit"
                 onClick = {e => {
                    e.preventDefault();
                    addPlant({variables: {name:name.value,price:price.value,description:description.value}});
                    name.value = '';
                    description.value = '';
                    price.value ='';}}
                ></input>
             </div>
         </div>
        </Modal.Body>
        
      </Modal>
    );
  }

  const LogoutMenu = () => {

    const history = useHistory();
	const onClick = () => {

		localStorage.removeItem('username')
        localStorage.removeItem('token')
        setTimeout(function () {window.location.reload()},100);

	}

	return (
		<Menu id='menu_id' >
        <Item onClick={onClick}>Logout</Item>
      </Menu>

	)
}



const Header = ({ isManager ,heading }) => {

    const [modalShow, setModalShow] = React.useState(false);
    const history = useHistory();
    const username = localStorage.getItem('token') ? localStorage.getItem('username') : "  ";


    return (
        <>
        <div className='header'>
             <h4>Dphi Nursery</h4>
             <MenuProvider id="menu_id" event="onClick" style={{margin:"1rem"}}>
             <p>
              {username}
             <LogoutMenu>
              </LogoutMenu>
            </p>
            </MenuProvider>
        </div>
        <section className='menu'>
            <div> <p style={{fontSize:'20px'}}>{heading}</p>  </div>
            {isManager ? <div>
                <button onClick={() => setModalShow(true)} > ➕ Add Plant</button>
                <AddPlantModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
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

const ADD_TO_CART = gql`
mutation addToCart($username:String!,$plantId:Int!) {
    addToCart(username:$username,plantId:$plantId){
      ok
    }
  }
`;

const ORDER_PLANT =gql`
mutation orderPlant($username:String!,$plantId:Int!) {
    orderPlant(username:$username,plantId:$plantId){
      ok
    }
  }
`;

const REMOVE_FROM_CART = gql
`mutation removeCart($username:String!,$plantId:Int!) {
    removeCart(username:$username,plantId:$plantId){
      ok
    }
  }
`;

const REMOVE_FROM_PLANT =gql`
mutation removePlant($username:String!,$plantId:Int!) {
    removePlant(username:$username,plantId:$plantId){
      ok
    }
  }
`;



const Main = ({plants,method}) => {

    const [cart] = useMutation(ADD_TO_CART);
    const [ cartRemove ] = useMutation(REMOVE_FROM_CART);
    const [ orderRemove ] = useMutation(REMOVE_FROM_PLANT);
    const [order] = useMutation(ORDER_PLANT);

  
    let username = localStorage.getItem('username');

    const addCart = async (e,method) => {

        try {
            const data  = await cart({variables:{username:localStorage.getItem('username'),plantId:e.target.id}})
            cogoToast.success("Plant added to cart");

        }
        catch (e) {
            cogoToast.warn("can't add to cart");

         }
    }
    const buy = async(e,method) => {

        try {
            const data  = await order({variables:{username:localStorage.getItem('username'),plantId:e.target.id}})
            cogoToast.success("Plant buyed");

        }
        catch (e) {
            cogoToast.warn("can't buy plant");
         }

    }
    const cartremove = async(e,method) => {

        try {
            const data  = await cartRemove({variables:{username:localStorage.getItem('username'),plantId:e.target.id}})
            cogoToast.success("Plant removed from cart");

        }
        catch (e) {
            cogoToast.warn("can't remove plant");
         }
    }

    const orderremove = async(e,method) => {

        try {
            const data  = await orderRemove({variables:{username:localStorage.getItem('username'),plantId:e.target.id}})
            cogoToast.success("Plant removed from buying..");

        }
        catch (e) {
            cogoToast.warn("can't remove plant from buying..");
        }
    }

    useEffect(() => {
            
    },[plants])
    
    
    return plants.map(({ id , name, price, description, photo  }) => (
    <>
        <div className='card'  key={id}>
                <img src="https://source.unsplash.com/300x400/?plants"></img>
                    <div>
                     <h3>{name}</h3> 
                     <p>Price : {price} ₹ </p>
                     <p>Description : {description}</p>
                     <div className='card-button'>
                     {method === "cart" && method !== "buy" && method !=="other"? 
                     <>
                     <a id ={id} style={{background:"#a4a19a"}} onClick = {(e) => {cartremove(e,method)}} >🛒Remove from Cart </a> 
                     <a id ={id} onClick = {(e) => {buy(e,method)}}>↗️ Buy </a> 
                     </>
                     : " " }
                     {method !== "cart" && method === "buy" && method !=="other"? 
                     <>
                     <a id ={id} onClick = {(e) => {addCart(e,method)}}  >🛒Add to Cart </a> 
                     <a id ={id} onClick = {(e) => {orderremove(e,method)}}  style={{background:"#a4a19a"}} >↗️ Remove from Buyed </a> 
                     </>
                     : " " }
                     {method !== "cart" && method !== "buy" && method ==="other"? 
                     <>
                     <a id ={id} onClick = {(e) => {addCart(e,method)}}  >🛒Add to Cart </a> 
                     <a id ={id} onClick = {(e) => {buy(e,method)}}>↗️ Buy </a> 
                     </>
                     : " " }
                     
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
            <div className="info">
            <p>
                <i>Manager</i> <br></br>
                <span> <i>username: manager </i> </span> <br></br>
                <span> <i>password: 1234 </i> </span> <br></br>
                </p>
                <p>
                <i>testuser</i> <br></br>
                <span> <i>username: test </i> </span> <br></br>
                <span> <i>password: test </i> </span> <br></br>
                </p>
            </div>
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
            style={{marginLeft:'13px'}}
            />
            </div>
            <div>
                <label> Password:  </label>
            <input
            ref={node => {
                password = node;
            }}
            name="password"
            type="password"
            style={{marginLeft:'16px'}}
            />
            </div>
            <div><button className="btns"  onClick = {e => {
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
                    style={{marginLeft:'11px'}}
                    type="password"
                    ></input>
                </div>
                <div><button className="btns" type="submit" onClick = {e => {
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
            setLoggedIn(true);
    
        }
        catch (e){
            setLoggedIn(false);
        }
    
    
    }
    
    useEffect(() => {
        if(token){
            tokenVerify();
        }
        else {
            setLoggedIn(false);
        }
        setLoading(false);
        
    },[]);


    if (loading) return <p> Loading ..</p>
    if (token) return  <MainList key={1}/>
    return  <Login/>

    

}

export default Home;



