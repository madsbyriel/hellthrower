// import React from 'react';
// import { Button } from 'react-bootstrap';
// import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
//
// function Hello() {
//   return (
//     <div>
//       <Button variant='success'>Fucking lort</Button>
//     </div>
//   );
// }
//
// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Hello />} />
//       </Routes>
//     </Router>
//   );
// }
//
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Container } from "react-bootstrap";
import Activate from "./pages/Activate.tsx";
import LoadoutPage from "./pages/LoadoutPage.tsx";
import NewLoadoutPage from "./pages/NewLoadoutPage.tsx";
import {
  defaultLoadoutContext,
  LoadoutContext,
} from "./pages/LoadoutContext.tsx";

function App() {
  const loadoutContext = defaultLoadoutContext();

  return (
    <Router>
      <div className="App">
        <LoadoutContext.Provider value={loadoutContext}>
          <AppNavbar />
          <main>
            <Container className="py-4">
              <Routes>
                <Route path="/activate" element={<Activate />} />
                <Route path="/loadout/new" element={<NewLoadoutPage />} />
                <Route path="/loadout/:id" element={<LoadoutPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </main>
        </LoadoutContext.Provider>
      </div>
    </Router>
  );
}

export default App;
