import { Button, Container, ListGroup } from "react-bootstrap";
import { useConfigProvider } from "../contexts/ConfigProvider";
import { Link } from "react-router-dom";

export interface ActivateLoadoutPageProps {
    onActivate: (index: number) => void;
}

export default function ActivateLoadoutPage({ onActivate }: ActivateLoadoutPageProps) {
    const { config } = useConfigProvider();

    let items = config.loadouts.map((e, i) => {
        return <ListGroup.Item>
            <Button onClick={() => onActivate(i)} variant="danger">Activate</Button> {e.name}
        </ListGroup.Item>
    });

    return <Container className="p-5">
        <h1>Welcome to the danger zone, {config.name}</h1>
        {items.length != 0 ?
            <ListGroup>
                {items}
            </ListGroup>
        :
            <h4>You have no loadouts to activate, to create one, <Link to="/create_loadout"><Button>click here</Button></Link></h4>
        }
    </Container>

}
