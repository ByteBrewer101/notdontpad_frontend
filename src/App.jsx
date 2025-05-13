import { CodePage } from "./Code"
import { SharePage } from "./Share"
import { BrowserRouter,Routes,Route } from "react-router-dom"




function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>

<Route path="/"  element={<CodePage/>}  />
<Route path='/share/:id' element={<SharePage/>} />
    </Routes>
    
    </BrowserRouter>
      
     
    </>
  )
}

export default App
