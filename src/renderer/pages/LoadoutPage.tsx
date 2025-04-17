import React, { FormEvent, useContext, useState } from "react";
import {
    Binding,
    Loadout,
    LoadoutContext,
    StratagemBinding,
} from "./LoadoutContext.tsx";
import { Accordion, Button, Col, Container, Form, Row } from "react-bootstrap";
import {
    Stratagem,
    StratagemsContext,
} from "../components/StratagemContext.tsx";

export default function LoadoutPage(loadout: Loadout): React.JSX.Element {
    const stratagemContext = useContext(StratagemsContext);
    const loadoutContext = useContext(LoadoutContext);

    if (stratagemContext == undefined || loadoutContext == undefined) {
        return <h1>Something went wrong!</h1>;
    }

    let selectedStratagemId = stratagemContext.stratagems[0].id;

    function onSubmit(): void {
        console.log(`selectedStratagemId: ${selectedStratagemId}`);
        const stratagem = findById(selectedStratagemId);

        if (stratagem === undefined) {
            throw new Error("Somehow the selected stratagem doesn't exist?");
        }

        loadout.stratagemBindings.push({ stratagem: stratagem, bindings: [] });
        loadoutContext?.updateLoadouts();
    }

    function findById(id: number | undefined): Stratagem | undefined {
        if (id == undefined) return undefined;
        return stratagemContext?.stratagems.find((s) => s.id == id);
    }

    function onStratagemSelected(id: number | undefined) {
        if (id == undefined) return;
        selectedStratagemId = id;
    }

    const options = stratagemContext.stratagems.map((e) => {
        return (
            <option key={e.id} value={e.id}>
                {e.stratagem}
            </option>
        );
    });

    let someId = -1;
    const stratBindings = loadout.stratagemBindings.map((stratBinding) => {
        function addKeyBinding(e: StratagemBinding): void {
            const newId = Math.max(...[0, ...e.bindings.map(e => e.id)]) + 1

            e.bindings.push({
                key: null,
                id: newId,
            });
            loadoutContext?.updateLoadouts();
        }

        let bindingIds = -1;
        const bindings = stratBinding.bindings.map((binding) => {
            bindingIds += 1;
            const deleteBinding = (
                stratBinding: StratagemBinding,
                id: number,
            ) => {
                const newBindings = stratBinding.bindings.filter(s => s.id != id)
                stratBinding.bindings = newBindings;

                loadoutContext.updateLoadouts();
            };

            return (
                <Row key={bindingIds} className="mb-3">
                    <Col xs={8}>
                        <Button className="container-fluid">Somebinding</Button>
                    </Col>
                    <Col xs={4}>
                        <Button
                            onClick={() => deleteBinding(stratBinding, binding.id)}
                            className="container-fluid"
                            variant="danger"
                        >
                            Delete
                        </Button>
                    </Col>
                </Row>
            );
        });

        someId += 1;
        return (
            <Accordion key={someId}>
                <Accordion.Item eventKey={stratBinding.stratagem.id.toString()}>
                    <Accordion.Header>
                        {stratBinding.stratagem.stratagem}
                    </Accordion.Header>
                    <Accordion.Body>
                        {bindings}
                        <Button
                            className="container-fluid"
                            onClick={() => addKeyBinding(stratBinding)}
                            variant="primary"
                        >
                            Add a binding
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    });

    return (
        <>
            <h1>{loadout.name}</h1>
            {stratBindings}
            <hr />
            <Row>
                <Col>
                    <Form.Select
                        onChange={(e) => onStratagemSelected(e.target.value)}
                    >
                        {options}
                    </Form.Select>
                </Col>
                <Col xs={2}>
                    <Button
                        variant="success"
                        onClick={() => onSubmit()}
                    >
                        Add
                    </Button>
                </Col>
            </Row>
            <footer>ASd</footer>
        </>
    );
}
