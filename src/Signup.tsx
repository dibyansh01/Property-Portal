import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Card, Typography} from '@mui/material';
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";



// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = process.env.VITE_BASE_URL
const BASE_URL = "http://ec2-18-212-116-46.compute-1.amazonaws.com:3000/admin"


export function Signup(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const loginstate = useLoginState();

    const isEmailValid = (email: any) => {
        // Check if the email ends with "@gmail.com"
        return email.endsWith('@gmail.com');
      };
    
      const handleSignup = async () => {
        if (!isEmailValid(email)) {
          alert('Please enter a valid Gmail username');
          return;
        }
    
        try {
          const response = await axios.post(`${BASE_URL}/signup`, {
            username: email,
            password: password,
          });
    
          const data = response.data;
          localStorage.setItem('token', data.token);
          loginstate.setUsername(email);
          loginstate.onLogin();
          alert('Signed Up');
          navigate('/');
        } catch (error) {
          console.error(error);
          alert(error);
        }
      };
   
    
    return (
        <div>
        
            <div className="pt-40 mb-10 flex justify-center">
                < Typography variant = {"h6"}>
                Welcome. Sign up below
                </Typography>
            </div>
        
           <div style={{
                display: 'flex',
                justifyContent: 'center'}}>
               <Card variant="outlined" style={{width: 400, padding: 20}}>
                  <form>
                    <TextField
                        onChange={(event) => {
                            let elemt = event.target;
                            setEmail(elemt.value);
                        }}
                        fullWidth={true}
                        label="Email"
                        variant="outlined"
                        type ={"email"}
                        required
                    />
                    <br /> <br />
                   <TextField
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        fullWidth={true}
                        label="Password"
                        variant="outlined"
                        type={"password"}
                        required
                    />
                    <br/><br/>

                   <Button
                        size={"large"}
                        variant="contained"
                        onClick={handleSignup}
                    > 
                        Signup
                    </Button>
                   </form>
                </Card>
           </div>
      
        </div>
    )
}
