import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Navigation from './Navigation';
import logo from './logo.svg';
import './App.css';
// import RotationgSphere from './components/RotatingSphere';


function App() {

  //自执行函数
  // (function(){
  //   console.log('哈哈哈-我自动执行')
  //   alert('selfDoSomethig!')
  // })()

  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />} />
      </Routes>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>woyuele!</span>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <RotationgSphere></RotationgSphere> */}
    </div>
  );
}

export default App;
