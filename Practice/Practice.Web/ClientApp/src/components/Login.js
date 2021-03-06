import React, { Component } from 'react';
import './Login.css';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';

//import './Home.css';

export class Login extends Component {

  constructor(props){
    super(props);
    this.state ={
      UserName:'',
      Email:'asd',
      Password:'',
      redirect: false,
      target: "",
      text: ""
    }
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);

  }
 



  async login(){
    //debugger;
    //console.log("login fuggveny hivas");
    //console.log(this.state);
    //console.log( JSON.stringify(this.state) );
    //--
    this.setState({ text:"Waiting for answer . . ."});


    const cookies = new Cookies();

    

    const response = await fetch ("https://localhost:44309/Authentification/UserLogin", {
      method: "POST",
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        UserName: this.state.UserName,
        Email: this.state.Email,
        Password: this.state.Password
      })
      //body:(this.state)
    });
    
    //console.log(await response.json()  );


    

    if(response.ok){
      this.setState({ text:"Successfully logged in!"});

      var response_ = await response.json();

      //console.log( response_ );
      //console.log( response_.token );

      cookies.set('token', response_.token);
      
      this.setState({ redirect: true, target: "/MainMenu" });
    }
    else
    {
      this.setState({ text:"Password or username incorrect!"});

    }
    

   // console.log(  response);


    //console.log( response );

  }


  onChange(e){
    //console.log("onchange fuggveny hivas");
    this.setState({[e.target.name]: e.target.value});
    //console.log(this.state);

  }

  


  render() {
    if(this.state.redirect){
      return (
        <Redirect to={this.state.target} />
      );
    }
    else{
      return (
        <div>
          <h1 className="login_boxed" id="title">Login</h1>

  {/*}
          <form class="boxed" id="loginform">
              <label><b>Username</b></label><br></br>
              <input type="text" name="username" placeholder="Enter Username" onChange={this.onChange} required></input><br></br>

              <label><b>Password</b></label><br></br>
              <input type = "password" name="password" placeholder="Enter Password" onChange={this.onChange} required></input><br></br>

              <button type="submit" value="login" class="button" onClick={this.login} >Login</button><br></br>
          </form>
  */}


              <div className="login_boxed" id="loginform">
                <label><b>Username</b></label><br></br>
                <input type="text" name="UserName" placeholder="Enter Username" onChange={this.onChange} required></input><br></br>

                <label><b>Password</b></label><br></br>
                <input type = "password" name="Password" placeholder="Enter Password" onChange={this.onChange} required></input><br></br>

                <button type="submit" value="login" className="login_page_button" onClick={this.login} >Login</button><br></br>
                <label >{this.state.text}</label>
              </div>
        </div>
        
      );
    }
  }
}
