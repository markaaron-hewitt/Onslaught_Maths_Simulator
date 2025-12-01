import './styling/App.css';
import PageHeader from './components/PageHeader.js';
import PageFooter from './components/PageFooter.js';
import Home from './pages/Home.js'

function App() {
  return (
    <div id="App">
      <header>
        <PageHeader />
      </header>
      <section id="content">
        <Home />
      </section>
      <footer>
        <PageFooter />
      </footer>
    </div>
  );
}

export default App;
