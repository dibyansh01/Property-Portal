import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Card, Typography} from '@mui/material';
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";
import {BASE_URL} from './config';


export function Signin(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const loginstate = useLoginState();
   
    
    return (
        <div>
        
            <div className="pt-40 mb-10 flex justify-center">
                < Typography variant = {"h6"}>
                Welcome back. Sign in below
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
                        onClick={async () => {
                            try {
                                    const response = await axios.post(`${BASE_URL}/login`,
                                        {
                                        // username: email,
                                        // password: password,
                                        },
                                        {
                                        headers: {
                                            "Content-type": "application/json",
                                            username: `${email}`,
                                            password: `${password}`,
                                        },
                                        }
                                    );
                                const data = response.data; // Access the response data using response.data
                        
                                localStorage.setItem("token", data.token);
                                loginstate.setUsername(email)
                                loginstate.onLogin()
                                                            
                                //console.log(data);
                                //console.log(role)
                                alert("Signed In")
                                
                                navigate('/')
                            } catch (error) {
                                // Handle error if the request fails
                                console.error(error);
                                alert(error)
                            }
                        }}
                    > 
                        Signin
                    </Button>
                   </form>
                </Card>
           </div>
      
        </div>
    )
}
