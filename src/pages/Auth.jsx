import { useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);


  const handleLogin = async (e) => {
    setLoadingForm(true);
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoadingForm(false);
      setErrorMessage(error.message);
    } else {
      toast.success("Login successful!");
      setLoadingForm(false);
      navigate('/');
    }
  };

  const handleSignup = async (e) => {
    setLoadingForm(true);
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setLoadingForm(false);
      setErrorMessage(error.message);
    } else {
      toast.success("Signup successful!");
      setLoadingForm(false);
      useNavigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingForm(true);
    setErrorMessage("");
    setFullName("");
    setPassword("");
    setEmail("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error){
      setLoadingForm(false);
       setErrorMessage(error.message);
    }
    else{
      setLoadingForm(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-50 shadow-lg p-6 md:p-8">
        <div className="flex border-b  border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setActiveTab("login")
              setEmail("");
              setPassword("");
              setFullName("");
            }}
            className={`flex-1 py-2 cursor-pointer text-center font-medium text-sm transition-colors duration-200 ${activeTab === "login"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab("signup")
              setEmail("");
              setPassword("");
              setFullName("");
            }}
            className={`flex-1 py-2 cursor-pointer text-center font-medium text-sm transition-colors duration-200 ${activeTab === "signup"
              ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={activeTab === "login" ? handleLogin : handleSignup}>
          <div className="mt-6 space-y-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">{activeTab === "login" ? "Login" : "Sign Up"}</h1>
            </div>
            <div className="space-y-4">
              {activeTab === "signup" && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Full name
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      setErrorMessage("")
                    }}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400;"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrorMessage("")
                  }}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400;"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessage("")
                  }}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400;"
                />
              </div>

              {errorMessage ? <p className="text-red-500">{errorMessage}</p> : null}

              <button
                type="submit"
                className="cursor-pointer inline-flex items-center justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600;"
              > 
                {activeTab === "login" && loadingForm ?  <Loader2
                className="w-8 h-8 animate-spin mx-auto text-white"
              /> : activeTab === "signup" && loadingForm ?  <Loader2
                className="w-8 h-8 animate-spin mx-auto text-white"
              /> : activeTab === "signup" ? "Sign Up" : "Log in"}
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="cursor-pointer inline-flex items-center justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100;"
              >
                Continue with Google
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("signup");
                    }}
                    className="underline text-blue-600 dark:text-blue-400"
                  >
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("login");
                    }}
                    className="underline text-blue-600 dark:text-blue-400"
                  >
                    Login
                  </a>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

