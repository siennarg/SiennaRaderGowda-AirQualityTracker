import { BrowserRouter, Route, Routes } from "react-router-dom";
import CityPage from './city/CityPage';
import HomePage from './HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        <Route path="/CityPage" element={<CityPage></CityPage>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;