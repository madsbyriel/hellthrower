import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useConfigProvider } from "../contexts/ConfigProvider"
import { Link } from "react-router-dom";

export default function Home() {
    const { config, setConfig, saveConfig } = useConfigProvider();

    const onDelete = (index: number) => {
        let loadouts = config.loadouts.filter((_, i) => i != index);
        let c = {... config, loadouts: loadouts };

        setConfig(c)
        saveConfig(c)
    }

    let loadouts = config.loadouts.map((e, i) => {

        return <ListGroup.Item>
            <Row xs={12}>
                <Col xs={3}>
                    <p className="w-100 h-100">{e.name}</p>
                </Col>
                <Col xs={3}>
                    <Link to={`/view_loadout?index=${i}`}><Button className="w-100 h-100">
                        View
                    </Button></Link>
                </Col>
                <Col xs={3}>
                    <Link to={`/edit_loadout?index=${i}`}><Button variant="warning" className="w-100 h-100">
                        Edit
                    </Button></Link>
                </Col>
                <Col xs={3}>
                    <Button onClick={() => onDelete(i)} variant="danger" className="w-100 h-100">
                        Delete
                    </Button>
                </Col>


            </Row>
        </ListGroup.Item>
    })

    return (
        <Container className="p-5">
        <h1>Greetings {config.name}!</h1>

        {config.loadouts.length != 0 ? <>
            <h4>How would you like to spread democracy today?</h4>
            <ListGroup>
                {loadouts}
            </ListGroup>
            </> : <>
                <h4>
                    It would seem you have no loadouts yet! <Link to="/create_loadout"><Button>Click here</Button></Link> to get started spreading democracy more efficiently!
                </h4>
            </>
        }

        </Container>
    )
}
