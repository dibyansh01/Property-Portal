import { useEffect } from 'react'
import axios from "axios";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Signin} from '@/Signin';
import {Appbar} from '@/Appbar';
import { Home } from '@/Home';
import { useLoginState } from "@/hooks/use-login-state";
import { MyPropertyListing } from './myproperty';
import { Signup } from './Signup';


// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = process.env.VITE_BASE_URL




function App() {
  return (
    <>
      <Router>
        <Appbar />
        <InitAdmin />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/signin" element={<Signin />} /> 
          <Route path="/myproperty" element={<MyPropertyListing />} />
        </Routes>
      </Router>
    </>
  )
}

function InitAdmin() {
  const loginstate = useLoginState();
  const init = async() => {
      try {
          const response = await axios.get(`${BASE_URL}/me`, {
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem("token")
              }
          })

          if (response.data.username) {
            loginstate.onLogin();
            loginstate.setUsername(response.data.username)

          } else {
              loginstate.onLogout;
              loginstate.setUsername('')
          }
      } catch (e) {
        console.log("Init Error")

        loginstate.onLogout;
        loginstate.setUsername('')
      }
  };

  useEffect(() => {
    init();
  }, []);

  return <></>
}

export default App
