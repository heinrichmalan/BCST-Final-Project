import React from "react";
import {
    Link
} from "react-router-dom";

class Register extends React.Component {
	constructor(props, context) {
        super(props,context);
        this.state = {
            isLoggedin: false,
            loginInfo: ""
        };
     
        this.submitHandler = this.submitHandler.bind(this);
      }

    submitHandler(e) {
        e.preventDefault();
        var userid =$('.register .userid').val();
		var password = $('.register .password').val();
		var email = $('.register .email').val();
        if(!userid||!password||!email){
            return;
        }
        let data = JSON.stringify({
            userInfo:{
				userid,
				email,
                password
            }});
        $.ajax({
            url:'/api/v1/register',
            type:"post",
            data:data,
            contentType:"application/json;charset=utf-8",
            success: (data)=>{
                console.log(data);
                if (data.error) {
					this.setState();
					window.location.href='/register';
                }else{
					window.location.href=`/home?username=${userid}`;
				}
            }
        });
    }
	render(){
		return(
			<div className="register">
			<div className="login_wrapper">
				<div id="register" className="animate form registration_form">
	                <section className="login_content">
	                    <form>
	                        <h1>Create Account</h1>
	                        <div>
	                            <input type="text" className="form-control userid" placeholder="Username" required="" />
	                        </div>
	                        <div>
	                            <input type="email" className="form-control email" placeholder="Email" required="" />
	                        </div>
	                        <div>
	                            <input type="password" className="form-control password" placeholder="Password" required="" />
	                        </div>
	                        <div>
	                            <Link to="/home" className="btn btn-default submit" onClick={this.submitHandler}>Submit</Link>
	                        </div>

	                        <div className="clearfix"></div>

	                        <div className="separator">
	                            <p className="change_link">Already a member ?
	                                <Link to="/login" className="to_register" > Log in </Link>
	                            </p>

	                            <div className="clearfix"></div>
	                            <br />
	                        </div>
	                    </form>
	                </section>
	            </div>
	            </div>
            </div>
        )
	}
}
export default Register;