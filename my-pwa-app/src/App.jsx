import { CiMenuBurger } from "react-icons/ci";
import "./index.css";
import { FaCamera } from "react-icons/fa";

function App() {
  return (
    <>
      <nav>
        <a className="nav-logo" href="">Postgram</a>
        <CiMenuBurger className="nav-menu" />
      </nav>

      <main>
        <h1>Share your moments</h1>
        <div className="post">
          <img src="" alt="image" />
          <p>title: <span>Hello world</span></p>
        </div>
      </main>

      <button>+</button>
    </>
  );
}

export default App;
