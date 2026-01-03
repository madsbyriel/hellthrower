import { ChangeEvent, FormEvent, useState } from "react";
import { Accordion, Alert, Badge, Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { invoke } from "@tauri-apps/api/core";
import { useStratagemProvider } from "../contexts/StratagemProvider";
import { Typeahead } from "react-bootstrap-typeahead";
import { KeyBinding, KeyResponse, Loadout, Stratagem, StratBinding } from "../components/Types";

export interface EditLoadoutProps {
    loadout: Loadout,
    onLoadoutCreated: (loadout: Loadout) => void;
    onLoadoutUpdated: (loadout: Loadout) => void;
    readonly: boolean;
}

export default function EditLoadout({ loadout, onLoadoutCreated, onLoadoutUpdated, readonly }: EditLoadoutProps) {
  const [error, setError] = useState("");
  const { stratagems } = useStratagemProvider();

  function addBinding() {
      let l = {... loadout, bindings: [... loadout.bindings, new StratBinding()] };
      onLoadoutUpdated(l);
  }
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      let l = {... loadout, name: e.target.value };
      onLoadoutUpdated(l);
  };

  const validateLoadout = (loadout: Loadout): string => {
      if (loadout.name.length == 0) 
          return "Lord! Please name this configuration of Democracy!";

      if (loadout.bindings.length == 0) return "Good sir, it would seem there are no stratagems defined in this configuration of freedom?"

      if (loadout.bindings.some(e => {
          let unnamed = e.stratagem.name.length == 0
          return unnamed;
      })) return "Sire, a stratagem is left unspecified!"

      let non_existent_strat = new Stratagem();
      if (loadout.bindings.some(e => {
          let strat_not_exists = !stratagems.some(s => s.name == e.stratagem.name);

          if (strat_not_exists) non_existent_strat = e.stratagem;

          return strat_not_exists;
      }))
          return `I beg you, Agent of Democracy, I do not know of this ${non_existent_strat.name} stratagem!`;


      let b = new StratBinding();
      if (loadout.bindings.some(e => {
          let empty = e.key_bindings.length == 0;
          if (empty)
              b = e;

          return empty;
      }))
          return `Sire! ${b.stratagem.name} remains yet to be bound to your will!`


      for (let i = 0; i < loadout.bindings.length; i++) {
          const stratbinding = loadout.bindings[i];

          // if any two keybindings for the same stratagem are identical, you have bound the same key twice
          let key = new KeyBinding();
          let identical = stratbinding.key_bindings.some((binding1, i) => {
              return stratbinding.key_bindings.some((binding2, k) => {
                  if (binding1.code == binding2.code && i != k) {
                      key = binding1;

                      return true;
                  }

                  return false;
              })
          })

          if (identical) return `My Lord! It seems you have bound the key (${key.name}) twice for the glorious ${stratbinding.stratagem.name}?`
      }

      let s1 = new StratBinding();
      let s2 = new StratBinding();
      let subset_strats = loadout.bindings.some((strat1, i) => {
          return loadout.bindings.some((strat2, k) => {
              if (i == k) return false;

              let l_subset = strat1.key_bindings.every(k1 => {
                  return strat2.key_bindings.some(k2 => {
                      return k1.code == k2.code
                  })
              }) // strat1 < strat2

              let r_subset = strat2.key_bindings.every(k1 => {
                  return strat1.key_bindings.some(k2 => {
                      return k1.code == k2.code
                  })
              }) // strat2 < strat1

              if (l_subset)
              {
                  s1 = strat1;
                  s2 = strat2;
              }
              else if (r_subset) {
                  s1 = strat2;
                  s2 = strat1;
              }

              return l_subset || r_subset;
          })
      });

      if (subset_strats) {
          return `Sir! I am too inadequate to decide between ${s1.stratagem.name} and ${s2.stratagem.name} when you signal for ${s2.stratagem.name}!`;
      }

      return ""
  }

  const createLoadout = (): void => {
      let validation = validateLoadout(loadout);
      setError(validation);

      if (validation.length == 0)
      {
          onLoadoutCreated(loadout);
      }
  }

  let elements = loadout.bindings.map((e, i) => {
      const onStratUpdate = (stratagem: string) => {
          let s = stratagems.find(el => el.name == stratagem);

          if (s == undefined) {
              setError(`My Liege! I do not believe that ${stratagem} is in our arsenal?`)
              return;
          }

          e.stratagem = s;

          let l = {... loadout };
          onLoadoutUpdated(l);
      }
      
      const onKeybindsUpdate = (keybinds: KeyBinding[]) => {
          e.key_bindings = keybinds;
          let l = {... loadout };
          onLoadoutUpdated(l);
      }

      const onRemoveStratagem = () => {
          let newBindings = loadout.bindings.filter((_, idx) => i != idx);
          let l = {... loadout, bindings: newBindings };
          onLoadoutUpdated(l);
      }

      return readonly ? <StratagemBinding
        readonly={readonly}
        stratagemBinding={e}
        index={i}
        key={i}
        onStratagemUpdate={(_) => {}}
        onRemoveStratagem={() => {}}
        onBindingsUpdate={(_) => {}} />
        : <StratagemBinding
        readonly={readonly}
        stratagemBinding={e}
        index={i}
        key={i}
        onStratagemUpdate={onStratUpdate}
        onRemoveStratagem={onRemoveStratagem}
        onBindingsUpdate={onKeybindsUpdate} />
  });

  return (
    <Container className="p-5">
      <Form onSubmit={readonly ? (_) => {} : handleSubmit}>
        <Form.Group controlId="nameInput" className="mb-3">
          <Form.Control
            disabled={readonly}
            type="text"
            placeholder="Name this loadout"
            value={loadout.name}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Accordion className="mb-3">
          {elements}
        </Accordion>

        {readonly ? <></> : 
            <>
                <Button onClick={_ => addBinding()}>Add binding</Button>
                <hr />
                <Button onClick={() => createLoadout()} variant="success" className="mb-3" type="submit">
                    Create Loadout
                </Button>
            </>
        }
      </Form>

      {error.length != 0 ? <Alert variant="warning">{error}</Alert> : <></>}
    </Container>
  )
}

interface StratagemBindingProps {
    stratagemBinding: StratBinding;
    index: number;
    onStratagemUpdate: (stratagem: string) => void;
    onBindingsUpdate: (bindings: KeyBinding[]) => void;
    onRemoveStratagem: () => void;
    readonly: boolean;
}

function StratagemBinding({ stratagemBinding, index, onStratagemUpdate, onBindingsUpdate, onRemoveStratagem, readonly } : StratagemBindingProps) {
    const { stratagems } = useStratagemProvider()

    const [listening, setListening] = useState(false)

    const [bindingError, setBindingError] = useState("");

    async function getKeyBind() {
        if (readonly) return;

        setListening(true);

        try {
            let resp: KeyResponse = JSON.parse(await invoke<string>("get_input"));
            if (resp.error.length != 0) {
                setBindingError(resp.error);
            }
            else {
                let key_binding = new KeyBinding();
                key_binding.code = resp.code;
                key_binding.name = resp.name;

                onBindingsUpdate([... stratagemBinding.key_bindings, key_binding]);
            }
        } catch (e: any) {
            setBindingError(JSON.stringify(e));
        }

        setListening(false);
    }

    function RemoveButton(index: number) {
        let new_bindings = stratagemBinding.key_bindings.filter((_, i) => i != index)
        onBindingsUpdate(new_bindings);
    }

    let keybindings_list_items = stratagemBinding.key_bindings.map((e, i) => {
        return <ListGroup.Item>
            <Container fluid>
                <Row xs={12}>
                    <Col xs={6}>
                        {e.name}
                    </Col>
                    <Col xs={3}></Col>

                    <Col xs={3}>
                        {readonly ? <></> :
                            <Button onClick={() => RemoveButton(i)} variant="danger" className="w-100 h-100">
                                Delete
                            </Button>
                        }
                    </Col>
                </Row>
            </Container>
        </ListGroup.Item>
    });

    return <Accordion.Item eventKey={index.toString()}>
        <Accordion.Header>{stratagemBinding.stratagem.name.length == 0 ? "Unset stratagem" : stratagemBinding.stratagem.name}</Accordion.Header>
        <Accordion.Body>

        {readonly ? <></> :
          <Form.Group className="py-2">
            <Form.Label>Select a stratagem</Form.Label>
            <Typeahead
              disabled={readonly}
              id="basic-typeahead"
              options={stratagems.map(s => s.name)}
              placeholder="Choose a stratagem..."
              onChange={(selected) => {
                  if (readonly) return;

                  if (selected.length != 0) {
                    try {
                      onStratagemUpdate(selected[0].toString());
                    }
                    catch {}
                  }
              }}
            />
          </Form.Group>
        }


          {keybindings_list_items.length != 0 ? <ListGroup>{keybindings_list_items}</ListGroup> : <></>}

          {readonly ? <></> : 
              <>
                <Form.Group className="py-2">
                    <Form.Label>Add a trigger</Form.Label>
                    <br />
                    <Button onClick={() => getKeyBind()}>{listening ? "Listening..." : "Press to listen for keypresses"}</Button>
                </Form.Group>

                <hr />

                <Button onClick={() => onRemoveStratagem()} variant="danger">Remove this stratagem</Button>
              </>

          }
          
          {bindingError.length != 0 ? <Badge bg="danger">{bindingError}</Badge> : <></>}


          
        </Accordion.Body>
      </Accordion.Item>
}
