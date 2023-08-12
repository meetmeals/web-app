import { Route, Routes } from 'react-router-dom';
import Temp from 'pages/temp';

function App() {
  return (
    <Routes>
      <Route path="/temp" element={<Temp />} />
    </Routes>
  );
}

export default App;
