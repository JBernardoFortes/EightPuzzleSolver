import Game from "./components/Game";
import Header from "./components/Header";
import "./styles/styles.css";

function App() {
  return (
    <>
      <main className="mainContainer">
        <Header></Header>
        <Game></Game>
      </main>
    </>
  );
}

export default App;
