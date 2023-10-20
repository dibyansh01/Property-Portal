import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";

export function Appbar({
    
}: React.HTMLAttributes<HTMLElement>) {
    const navigate = useNavigate();
    const loginstate = useLoginState();

    if (!loginstate.isLogin){
    return (
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 bg-gray-200 items-center">
            <div className="flex justify-between w-full">
                <div className="flex items-center">
                    <h2 className="text-xl font-bold mr-4">LOGO</h2>
                        <a href="/" onClick={()=>navigate('/')}>
                           <h4>Home</h4>
                        </a>
                </div>
                <div className="flex">
                    <Button className="rounded-lg" size="lg" variant="outline" onClick={()=>navigate('/Signin')}>SignIn</Button>
                    <Button className="rounded-lg ml-2" size="lg" variant="outline" onClick={()=>navigate('/Signup')}>SignUp</Button>
                </div>
            </div>
        </div>
    );
    } else {
        return (
            <div className="w-full bg-gray-200 py-4 px-2">
                <div className="flex justify-between w-full">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold mr-4">LOGO</h2>
                        <a href="/" onClick={()=>navigate('/')}>
                           <h4>Home</h4>
                        </a>
                    </div>
                    <div className="flex p-2">
                        <div className="p-2">
                        {loginstate.username}
                        </div>
                        
                        <Button className="rounded-lg" size="lg" variant="outline" onClick={()=>navigate('/myproperty')}>My Properties</Button>
                        <Button className="rounded-lg ml-2" size="lg" variant="outline" 
                             onClick={() => {
                                localStorage.setItem("token", "");
                                loginstate.onLogout();
                                loginstate.setUsername('');
                                navigate('/')
                            }}>Logout</Button>
                    </div>
                </div>
            </div>

    )}

}
