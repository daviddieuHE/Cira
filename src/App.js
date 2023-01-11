import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { RealtimeData } from './Components/realtimeData';
import Header from './Container/header/header';

function App() {
  return (
    <div className="App">
      <Header/>
      <RealtimeData/>
    </div>
  );
}

export default App;
