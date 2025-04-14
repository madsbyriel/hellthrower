import React, { useContext } from "react";
import { StratagemsContext } from "../components/StratagemContext.tsx";
import { Table } from "react-bootstrap";

export default function StratagemsPage() {
    const stratagemsContext = useContext(StratagemsContext);

    if (
        stratagemsContext === undefined ||
        stratagemsContext.stratagems === undefined
    ) return <p>Something went wrong!</p>;

    const rows = stratagemsContext.stratagems.map((e) => {
        return (
            <tr>
                <td>{e.id}</td>
                <td>{e.stratagem}</td>
                <td>{e.code}</td>
            </tr>
        );
    });

    return (
        <>
            <h1>All Stratagems</h1>
            <Table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>code</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </Table>
        </>
    );
}
