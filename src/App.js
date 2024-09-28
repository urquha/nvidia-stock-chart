import './App.css';
import StockChart from './components/stockChart';

const stocks = {
  'ENVX': {'colour':'rgba(75,192,192,1)'},
  'NG': {'colour':'rgba(192,75,75,1)'},
  'GME': {'colour':'rgba(75,192,75,1)'},
  'INTC': {'colour':'rgba(75,75,192,1)'},
};

function App() {
  return (
    <div className="App">
      {/* Navbar */}
      <header className="App-header">
        <div className="navbar">
          <h2>My Stock Dashboard</h2>
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#stocks">Stocks</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="content">
        <h1>Stock Performance Chart</h1>
        <StockChart stocks={stocks} />
      </div>

      {/* Footer */}
      <footer className="App-footer">
        <p>&copy; 2024 Stock Insights</p>
      </footer>
    </div>
  );
}

export default App;
