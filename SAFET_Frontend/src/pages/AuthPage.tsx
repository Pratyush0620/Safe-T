import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSignIn =()=>{
    navigate("/dashboard")
  }

  const handleSignUp =()=>{
    navigate("/dashboard")
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f172a]">
      <div className={`relative w-[768px] max-w-full min-h-[480px] bg-[#1e293b] shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ${isRightPanelActive ? "right-panel-active" : ""}`}>
        {/* Sign Up Form */}
        <div className={`absolute top-0 w-1/2 h-full transition-all duration-500 flex flex-col items-center justify-center p-8 ${isRightPanelActive ? "opacity-100 z-10 translate-x-full" : "opacity-0 z-0"}`}>
          <form className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="border-1 border-white border-opacity-20 rounded-md text-white p-2 mb-1" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="border-1 border-white border-opacity-20 rounded-md text-white p-2 mb-1" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="border-1 border-white border-opacity-20 text-white p-2 mb-1" />
            <input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone number" className="border-1 border-white border-opacity-20 text-white p-2 mb-1" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border-1 border-white border-opacity-50 text-white p-2 mb-1" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border-1 border-white border-opacity-20 text-white p-2 mb-1" />
            <button onClick={handleSignUp} className="border-2 border-white text-white px-6 py-2 rounded-full font-bold mt-[2vw]">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-500 flex flex-col items-center justify-center p-8 ${isRightPanelActive ? "opacity-0 z-0" : "opacity-100 z-10"}`}>
          <form className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold text-white ">Sign In</h1>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full bg-transparent border border-gray-500 text-white p-3 rounded-md mt-3" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border border-gray-500 text-white p-3 rounded-md mt-3" />
            <button onClick={handleSignIn} className="border-2 border-blue-400 text-blue-400 px-6 py-2 rounded-full font-bold mt-[2vw]">Sign In</button>
          </form>
        </div>

        {/* Panel Section */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white flex items-center justify-center transition-all duration-500 ${isRightPanelActive ? "translate-x-[-100%]" : "translate-x-0"}`}>
          <div className="text-center px-8">
            {isRightPanelActive ? (
              <>
                <h1 className="text-2xl font-bold">Have a dashboard?</h1>
                <p className="text-sm mt-2">Enter your details to sign into your dashboard</p>
                <button className="border-2 border-blue-400 text-blue-400 px-6 py-2 rounded-full font-bold mt-[2vw]" onClick={() => setIsRightPanelActive(false)}>Sign in</button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">New to us?</h1>
                <p className="text-sm mt-2">Enter as organisation to incorporate <b>Safe-T</b> among your workers</p>
                <button className="border-2 border-white text-white px-6 py-2 rounded-full font-bold mt-[2vw]" onClick={() => {
                    setIsRightPanelActive(true);
                }}>Sign up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;