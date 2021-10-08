import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { useState } from 'react';

function App() {
  initializeAuthentication();
  const googleProvider = new GoogleAuthProvider();

  const [name, setName] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)

  const auth = getAuth();

  const [email, setEmail] = useState('');

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user

        const logInUser = {
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(logInUser);
      })
  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user, email, name)
        verifyUser()
        setError('')
        setUserName()
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const logInProcess = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user)
        setError('')
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const verifyUser = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result)
      })
  }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result)
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(result => { })
  }

  /* handle registration */
  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password)
    if (password.length < 6) {
      setError('Password should be at least 6 characters')
      return;
    }

    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('password should has two uppercase letters.')
      return;
    }
    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError('password should has one special case letter.')
      return;
    }
    isRegistered ? logInProcess(email, password) : registerNewUser(email, password)
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const toggleSignIn = e => {
    setIsRegistered(e.target.checked)
  }
  const handleNameChange = e => {
    setName(e.target.value)
  }

  return (
    <div className='mx-5 mt-5'>
      <form onSubmit={handleRegistration} className='mx-5'>
        <h3 className="text-center">Please {isRegistered ? 'Login' : 'Register'}</h3>
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        {!isRegistered && <div className="row mb-3">
          <label htmlFor="inputText3" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputText3" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleSignIn} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <h3 className='text-danger text-center'>{error}</h3>
        <button type="submit" className="btn btn-primary">{isRegistered ? 'Login' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm ms-5">Reset Password</button>
      </form>

      <br /><br /><br />
      <div className="text-center">------------------------------------------------

        <br />
        <button onClick={handleGoogleSignIn}>
          Google sign in</button></div>
      <br />
      {
        user.name && <div>
          <h2>Welcome {user.name}</h2>
          <p>I know your email address: {user.email}</p>
          <p>This is you</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
