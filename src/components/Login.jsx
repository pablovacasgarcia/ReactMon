import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../Utils/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState(""); // Estado para almacenar mensajes de error
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    // Función para iniciar sesión con correo y contraseña
    function loginWithEmailPassword() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/");
            })
            .catch((error) => {
                let errorMessage;
                if (error.code === 'auth/invalid-credential') {
                    errorMessage = 'Usuario o contraseña incorrectos';
                } else {
                    errorMessage = error.message;
                }
                setError(errorMessage);
            });
    }

    // Función para registrarse con correo y contraseña
    function registerWithEmailPassword() {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: fullName
                }).then(() => {
                    navigate("/");
                })
            })
            .catch((error) => {
                let errorMessage;
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'La dirección de correo electrónico ya está en uso.';
                } else if(error.code === 'auth/weak-password'){
                    errorMessage = 'La contraseña debe tener al menos 6 carácteres';
                } else {
                    errorMessage = error.message;
                }
                setError(errorMessage); // Guarda el mensaje de error
            });
    }

    // Función para iniciar sesión con Google
    function loginWithGoogle() {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google API.
                // The signed-in user info.
                const user = result.user;
                navigate("/");
            })
            .catch((error) => {
                let errorMessage;
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'El inicio de sesión con Google fue cancelado.';
                } else if (error.code === 'auth/account-exists-with-different-credential'){
                    errorMessage = 'Ya existe una cuenta con ese email.';
                } else {
                    errorMessage = error.message;
                }
                setError(errorMessage); // Guarda el mensaje de error
            });
    }

    // Función para iniciar sesión con GitHub
    function loginWithGithub() {
        signInWithPopup(auth, githubProvider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access GitHub API.
                // The signed-in user info.
                const user = result.user;
                navigate("/");
            })
            .catch((error) => {
                let errorMessage;
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'El inicio de sesión con GitHub fue cancelado.';
                } else if (error.code === 'auth/account-exists-with-different-credential'){
                    errorMessage = 'Ya existe una cuenta con ese email.';
                } else {
                    errorMessage = error.message;
                }
                setError(errorMessage); // Guarda el mensaje de error
            });
    }

    return (
        <div className="login-container">
            {/* Mostrar error si existe */}
            {error && <div className="error-message">{error}</div>}

            {/* Formulario de inicio de sesión */}
            {showLogin && (
                <form onSubmit={(e) => { e.preventDefault(); loginWithEmailPassword(); }}>
                    <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
                    <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                    <button className="submit-button" type="submit">Iniciar sesión</button>
                </form>
            )}

            {/* Formulario de registro */}
            {!showLogin && (
                <form onSubmit={(e) => { e.preventDefault(); registerWithEmailPassword(); }}>
                    <input className="input-field" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" required />
                    <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
                    <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
                    <button className="submit-button" type="submit">Registrarse</button>
                </form>
            )}

            {/* Botón para iniciar sesión con Google */}
            <button className="external-login-button" onClick={loginWithGoogle}>Iniciar sesión con Google <img src="https://assets.stickpng.com/images/5a951939c4ffc33e8c148af2.png" alt="" /></button>

            {/* Botón para iniciar sesión con GitHub */}
            <button className="external-login-button" onClick={loginWithGithub}>Iniciar sesión con GitHub <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" /></button>

            {/* Botón para cambiar entre formulario de inicio de sesión y registro */}
            <button className="toggle-button" onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? "Registrarse" : "Iniciar Sesión"}
            </button>
        </div>
    );
}

export default Login;
