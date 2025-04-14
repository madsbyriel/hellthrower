import React from "react";
import { Button, Form } from "react-bootstrap";

export default function Activate() {
  return (
    <div>
      <h1>Activate a loadout</h1>
      <hr />
      <p>Select a loadout:</p>
      <Form.Select aria-label="Default select example">
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>

      <Button className="mt-3" variant="danger">ACTIVATE</Button>
    </div>
  );
}
