import { Button, Container } from "react-bootstrap"
import { Loadout } from "../components/Types"

export interface ActivatedLoadoutPageProps {
    loadout: Loadout,
    onDeactivate: () => void,
}

export default function ActivatedLoadoutPage({ loadout, onDeactivate }: ActivatedLoadoutPageProps) {
    return <Container className="p-5">
        <h4>You have activated {loadout.name}, commence the spreading of freedom!</h4>
        <Button className="h-100 w-100" onClick={() => onDeactivate()}>Deactivate</Button>
    </Container>
}
