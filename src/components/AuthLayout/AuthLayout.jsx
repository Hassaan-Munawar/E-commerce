import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Moon, Sun } from "lucide-react";
import googleIcon from "../../assets/google-icon.png";
import { ThemeContext } from "../../context/ThemeContext";
import supabase from "../../utils/supabase";

export default function AuthLayout() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
    } else {
      toast.success("Login successful!");
      navigate("/");
    }
    setLoadingForm(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    const { error } = await supabase.auth.signUp({
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
      provider: "google",
    });

    if (error) {
      setErrorMessage(error.message);
    }
    setLoadingForm(false);
  };

  return (
    <>
      <div className="absolute top-5 z-10 left-5 flex items-center gap-3">
        <Link
          to="/"
          className={`inline-flex items-center transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>
        <div className={`h-6 w-px ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
      </div>

      <button
        onClick={toggleDarkMode}
        className={`p-2 absolute top-5 right-5 z-10 rounded-lg cursor-pointer transition-colors ${darkMode
          ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
          : "bg-gray-300 hover:bg-gray-200 text-gray-700"
          }`}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <div
        className={`relative min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"
          } flex items-center justify-center p-4 transition-colors duration-200 `}
      >
        <div
          className={`w-full max-w-md rounded-lg border shadow-lg p-6 md:p-8 ${darkMode
            ? "bg-gray-800 border-gray-700 text-gray-50"
            : "bg-white border-gray-200 text-gray-900"
            }`}
        >
          <div className={`flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <button
              onClick={() => {
                setActiveTab("login");
                setEmail("");
                setPassword("");
                setFullName("");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 cursor-pointer text-center font-medium text-sm transition-colors duration-200 ${activeTab === "login"
                ? darkMode
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "border-b-2 border-blue-600 text-blue-600"
                : darkMode
                  ? "text-gray-400 hover:text-gray-200"
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
                ? darkMode
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "border-b-2 border-blue-600 text-blue-600"
                : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
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
                        setFullName(e.target.value);
                        setErrorMessage("");
                      }}
                      required
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${darkMode
                        ? "border-gray-600 bg-gray-750 text-gray-50 placeholder:text-gray-500 "
                        : "border-gray-300 bg-white text-gray-900"
                        }`}
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
                      setEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${darkMode
                      ? "border-gray-600 bg-gray-750 text-gray-50 placeholder:text-gray-500 "
                      : "border-gray-300 bg-white text-gray-900"
                      }`}
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
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 ${darkMode
                      ? "border-gray-600 bg-gray-750 text-gray-50 placeholder:text-gray-500 "
                      : "border-gray-300 bg-white text-gray-900"
                      }`}
                  />
                </div>

                {errorMessage && <p className={`${darkMode ? "text-red-400" : "text-red-500"}`}>{errorMessage}</p>}

                <button
                  type="submit"
                  className={`inline-flex items-center cursor-pointer justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium ${darkMode
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
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
                  className={`inline-flex items-center cursor-pointer justify-center h-10 px-4 py-2 w-full rounded-md text-sm font-medium border ${darkMode
                    ? "border-gray-600 bg-transparent hover:bg-gray-700 text-gray-100"
                    : "border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700"
                    }`}
                > <img className="w-5 h-5 mr-2" src={googleIcon} alt="google-icon" />
                  Continue with Google
                </button>
              </div>

              <div
                className={`mt-4 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {activeTab === "login" ? (
                  <>
                    Don’t have an account?{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab("signup");
                      }}
                      className={darkMode ? "text-blue-400 underline" : "text-blue-600 underline"}
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
                      className={darkMode ? "text-blue-400 underline" : "text-blue-600 underline"}
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