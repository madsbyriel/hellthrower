import React, { FormEvent, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Loadout, LoadoutContext } from "./LoadoutContext.tsx";
import { Accordion, Badge, Button, Col, Form, Row } from "react-bootstrap";
import {
    Stratagem,
    StratagemsContext,
} from "../components/StratagemContext.tsx";

export default function LoadoutPage() {
    const { id } = useParams();
    const numbersId = Number(id);
    const loadoutContext = useContext(LoadoutContext);
    const stratagemContext = useContext(StratagemsContext);
    
    const errorElement = <h1>Something went wrong!</h1>;

    if (
        loadoutContext === undefined || loadoutContext.loadouts === undefined ||
        stratagemContext === undefined
    ) return errorElement;

    const [uniqueId, setId] = useState<number>(stratagemContext.stratagems[0].id);

    let loadout: Loadout | undefined = undefined;
    for (const l of loadoutContext.loadouts) {
        if (l.id === numbersId) {
            loadout = l;
            break;
        }
    }
    if (loadout == undefined) return errorElement;

    const options = stratagemContext.stratagems.map((e) => {
        return <option key={e.id} value={e.id}>{e.stratagem}</option>;
    });

    const bindings = loadout.stratagemBindings.map((e) => {
        return (
            <Accordion>
                <Accordion.Item eventKey={e.stratagem.id.toString()}>
                    <Accordion.Header>{e.stratagem.stratagem}</Accordion.Header>
                    <Accordion.Body>
                        <Button variant="primary">Click me to bind!</Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    });

    function onSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const stratagem = findById(uniqueId);
        if (stratagem === undefined) {
            throw new Error("Somehow the selected stratagem doesn't exist?");
        }

        loadout?.stratagemBindings.push({ stratagem: stratagem, bindings: [] });
        loadoutContext?.setLoadouts([...loadoutContext.loadouts]);
    }

    function onChange(event: ChangeEvent<HTMLSelectElement>): void {
        event.preventDefault();
        setId(event.target.value);
    }

    function findById(id: number): Stratagem | undefined {
        return stratagemContext?.stratagems.find((s) => s.id == id);
    }

    return (
        <>
            <h1>{loadout.name}</h1>
            {bindings}
            <hr />
            <Form onSubmit={onSubmit}>
                <Row>
                    <Col>
                        <Form.Select onChange={onChange}>
                            {options}
                        </Form.Select>
                    </Col>
                    <Col xs={2}>
                        <Button type="submit" variant="success">Add</Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
