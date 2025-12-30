import { useState, FormEvent, ChangeEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useConfigProvider } from '../contexts/ConfigProvider';

const NameForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const service = useConfigProvider();

  if (service == undefined) return <h1>Config not loaded</h1>
  const {config, setConfig} = service;


  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    let newConfig = { ...config, name: name };

    setConfig(newConfig);
    service.saveConfig(newConfig);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  return (
    <>
      <h1>Hello fellow Helldiver! What would you like to be called?</h1>
      <h4>{name}</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nameInput" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default NameForm;
