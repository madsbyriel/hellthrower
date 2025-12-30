export class Config {
    name: string;
    error: string;
    loadouts: Loadout[];

    constructor() {
        this.name = ""
        this.error = ""
        this.loadouts = []
    }
}

export class Loadout
{
    name: string;
    bindings: StratBinding[]

    constructor() {
        this.name = "";
        this.bindings = [];
    }
}

export class StratBinding
{
    key_bindings: KeyBinding[];
    stratagem: Stratagem;

    constructor() {
        this.stratagem = new Stratagem();
        this.key_bindings = [];
    }
}

export class KeyBinding
{
    name: string;
    code: number;

    constructor() {
        this.name = "";
        this.code = 0;
    }
}

export class KeyResponse {
    name: string;
    error: string;
    code: number;

    constructor() {
        this.name = "";
        this.error = "";
        this.code = 0;
    }
}

export class Stratagem {
    name: string;
    binding: string[];

    constructor() {
        this.name = ""
        this.binding = []
    }
}
