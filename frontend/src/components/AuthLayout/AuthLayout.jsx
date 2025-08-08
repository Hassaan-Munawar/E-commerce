import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2 } from "lucide-react";
import googleIcon from "../../assets/google-icon.png";
import supabase from "../../utils/supabase";
import axios from "axios"
import { AppRoutes } from "../../constant/AppRoutes";
import { UserInfoContext } from "../../context/UserInfoContext";

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState("login");
  const { setUserInfo } = useContext(UserInfoContext)


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
    } else {
      const id = data.user.id;

      axios.post(AppRoutes.login, { id: id }).then((data) => {
        setUserInfo(data?.data?.data)
      }).catch((error) => {
        setErrorMessage(error.message == 'Request failed with status code 403' ? error.response.data.message : error.message)
      })
      toast.success("Login successful!");
      navigate("/");
    }
    setLoadingForm(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      axios.post(AppRoutes.login,
        {
          id: data.user.id,
          full_name: data.user.user_metadata.full_name,
          email: data.user.email
        }
      ).then((data) => {
        setUserInfo(data?.data?.data)
      }).catch((error) => {
        setErrorMessage(error.message == 'Request failed with status code 403' ? error.response.data.message : error.message)
      })
      toast.success("Signup successful!");
      navigate("/");
    }
    setLoadingForm(false);
  };

  const handleGoogleLogin = async () => {
    setLoadingForm(true);
    setErrorMessage("");
    setFullName("");
    setPassword("");
    setEmail("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google"
    });
    if (error) {
      setErrorMessage(error.message);
    }
    setLoadingForm(false);
    toast.success("Login successful!");

  };

  return (
    <>
      <div className="absolute top-5 z-10 left-5 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center transition-colors text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>
        <div className="h-6 w-px bg-gray-300" />
      </div>

      <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4 transition-colors duration-200">
        <div className="w-full max-w-md rounded-lg border shadow-lg p-6 md:p-8 bg-white border-gray-200 text-gray-900">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab("login");
                setEmail("");
                setPassword("");
                setFullName("");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 cursor-pointer text-center font-medium text-sm transition-colors duration-200 ${activeTab === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setEmail("");
                setPassword("");
                setFullName("");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 cursor-pointer text-center font-medium text-sm transition-colors duration-200 ${activeTab === "signup"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={activeTab === "login" ? handleLogin : handleSignup}>
            <div className="mt-6 space-y-4">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">
                  {activeTab === "login" ? "Login" : "Sign Up"}
                </h1>
              </div>

              <div className="space-y-4">
                {activeTab === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Full name
                    </label>
                    <input
                      id="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
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
                      setPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <button
                  type="submit"
                  className="inline-flex items-center cursor-pointer justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loadingForm ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : activeTab === "signup" ? (
                    "Sign Up"
                  ) : (
                    "Log in"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center cursor-pointer justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
                >
                  <img className="w-5 h-5 mr-2" src={googleIcon} alt="google-icon" />
                  Continue with Google
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                {activeTab === "login" ? (
                  <>
                    Don’t have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("signup");
                      }}
                      className="text-blue-600 underline"
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
                      className="text-blue-600 underline"
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
    </>
  );
}