import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';

function App() {
  initializeAuthentication();
  const googleProvider = new GoogleAuthProvider();

  const [user, setUser] = useState({})
  const auth = getAuth();

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

  const handleRegistration = e => {
    console.log('register will be added')
    e.preventDefault();
  }

  return (
    <div className="App">
      <form onSubmit={handleRegistration}>
        <h3>Pleaes Register</h3>
        <label htmlFor="name">Name: </label>
        <input type="text" name="text" placeholder="Your full name" />
        <br />
        <label htmlFor="tel">Phone: </label>
        <input type="tel" name="phone" placeholder="Your Phone" />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" placeholder="Your email" />
        <br />
        <label htmlFor="password">Password: </label>
        <input type="password" name="password" placeholder="Create a strong password" />
        <br />
        <input type="submit" value="Register" />
      </form>

      <br /><br /><br />
      <div>------------------------------------------------</div>
      <button onClick={handleGoogleSignIn}>Google sign in</button>
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
