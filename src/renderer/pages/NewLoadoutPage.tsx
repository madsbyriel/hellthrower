import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { LoadoutContext } from "./LoadoutContext.tsx";

export default function NewLoadoutPage() {
  const [loadoutName, setLoadoutName] = useState("");
  const lContext = useContext(LoadoutContext)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    lContext?.addLoadout(loadoutName)
  };

  return (
    <>
      <h1>New loadout</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="loadoutName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={loadoutName}
            onChange={(e) => setLoadoutName(e.target.value)}
          />
        </Form.Group>

        <Button className="mt-3" type="submit">
          Save
        </Button>
      </Form>
    </>
  );
}
