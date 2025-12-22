import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Carousel, Container, Form, Image } from "react-bootstrap";
import hdLogo from "./assets/helldivers-2-seeklogo.svg"

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("press_enter"));
  }

  return (
    <main className="container">
    <h1>Welcome to <Badge bg="warning">Hellthrower</Badge></h1>
    </main>
  );
}

export default App;
