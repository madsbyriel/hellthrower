import { createContext, useState } from "react";

export interface StratagemsContextType {
    stratagems: Stratagem[];
    setStratagems: (value: React.SetStateAction<Stratagem[]>) => void;
}

export interface Stratagem {
    id: number;
    stratagem: string;
    link: string;
    code: string[];
}

const strats = [
    {
        "stratagem": "MG-43 Machine Gun",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/e/e0/Machine_Gun_Stratagem_Icon.png/50px-Machine_Gun_Stratagem_Icon.png?3dfe18",
        "id": 0,
    },
    {
        "stratagem": "APW-1 Anti-Materiel Rifle",
        "code": [
            "D",
            "L",
            "L",
            "U",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/3c/Anti-Materiel_Rifle_Stratagem_Icon.png/50px-Anti-Materiel_Rifle_Stratagem_Icon.png?fcf5b1",
        "id": 1,
    },
    {
        "stratagem": "M-105 Stalwart",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/4/46/Stalwart_Stratagem_Icon.png/50px-Stalwart_Stratagem_Icon.png?b35d66",
        "id": 2,
    },
    {
        "stratagem": "EAT-17 Expendable Anti-Tank",
        "code": [
            "D",
            "D",
            "L",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/1/1c/Expendable_Anti-Tank_Stratagem_Icon.png/50px-Expendable_Anti-Tank_Stratagem_Icon.png?2634c5",
        "id": 3,
    },
    {
        "stratagem": "GR-8 Recoilless Rifle",
        "code": [
            "D",
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/70/Recoilless_Rifle_Stratagem_Icon.png/50px-Recoilless_Rifle_Stratagem_Icon.png?44fee2",
        "id": 4,
    },
    {
        "stratagem": "FLAM-40 Flamethrower",
        "code": [
            "D",
            "L",
            "U",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/75/Flamethrower_Stratagem_Icon.png/50px-Flamethrower_Stratagem_Icon.png?f36171",
        "id": 5,
    },
    {
        "stratagem": "AC-8 Autocannon",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/e/ef/Autocannon_Stratagem_Icon.png/50px-Autocannon_Stratagem_Icon.png?fcd624",
        "id": 6,
    },
    {
        "stratagem": "MG-206 Heavy Machine Gun",
        "code": [
            "D",
            "L",
            "U",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/d/d9/Heavy_Machine_Gun_Stratagem_Icon.png/50px-Heavy_Machine_Gun_Stratagem_Icon.png?910281",
        "id": 7,
    },
    {
        "stratagem": "RL-77 Airburst Rocket Launcher",
        "code": [
            "D",
            "U",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/ad/RL-77_Airburst_Rocket_Launcher_Stratagem_Icon.png/50px-RL-77_Airburst_Rocket_Launcher_Stratagem_Icon.png?ccc753",
        "id": 8,
    },
    {
        "stratagem": "MLS-4X Commando",
        "code": [
            "D",
            "L",
            "U",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/78/Commando_Stratagem_Icon.png/50px-Commando_Stratagem_Icon.png?30c1d0",
        "id": 9,
    },
    {
        "stratagem": "RS-422 Railgun",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/35/Railgun_Stratagem_Icon.png/50px-Railgun_Stratagem_Icon.png?91c54b",
        "id": 10,
    },
    {
        "stratagem": "FAF-14 Spear",
        "code": [
            "D",
            "D",
            "U",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/5/54/Spear_Stratagem_Icon.png/50px-Spear_Stratagem_Icon.png?a47c14",
        "id": 11,
    },
    {
        "stratagem": "StA-X3 W.A.S.P. Launcher",
        "code": [
            "D",
            "D",
            "U",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/af/StA-X3_W.A.S.P._Launcher_Stratagem_Icon.png/50px-StA-X3_W.A.S.P._Launcher_Stratagem_Icon.png?c5c842",
        "id": 12,
    },
    {
        "stratagem": "Orbital Gatling Barrage",
        "code": [
            "L",
            "D",
            "L",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/f/f6/Orbital_Gatling_Barrage_Stratagem_Icon.png/50px-Orbital_Gatling_Barrage_Stratagem_Icon.png?17a44b",
        "id": 13,
    },
    {
        "stratagem": "Orbital Airburst Strike",
        "code": [
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/2/28/Orbital_Airburst_Strike_Stratagem_Icon.png/50px-Orbital_Airburst_Strike_Stratagem_Icon.png?d48d6a",
        "id": 14,
    },
    {
        "stratagem": "Orbital 120mm HE Barrage",
        "code": [
            "L",
            "L",
            "D",
            "L",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/4/40/Orbital_120mm_HE_Barrage_Stratagem_Icon.png/50px-Orbital_120mm_HE_Barrage_Stratagem_Icon.png?e120a8",
        "id": 15,
    },
    {
        "stratagem": "Orbital 380mm HE Barrage",
        "code": [
            "L",
            "D",
            "U",
            "U",
            "L",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/1/12/Orbital_380mm_HE_Barrage_Stratagem_Icon.png/50px-Orbital_380mm_HE_Barrage_Stratagem_Icon.png?7ed57e",
        "id": 16,
    },
    {
        "stratagem": "Orbital Walking Barrage",
        "code": [
            "L",
            "D",
            "L",
            "D",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/5/53/Orbital_Walking_Barrage_Stratagem_Icon.png/50px-Orbital_Walking_Barrage_Stratagem_Icon.png?c596dd",
        "id": 17,
    },
    {
        "stratagem": "Orbital Laser",
        "code": [
            "L",
            "D",
            "U",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/d/d8/Orbital_Laser_Stratagem_Icon.png/50px-Orbital_Laser_Stratagem_Icon.png?4dbbd2",
        "id": 18,
    },
    {
        "stratagem": "Orbital Napalm Barrage",
        "code": [
            "L",
            "L",
            "D",
            "L",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/9/97/Orbital_Napalm_Barrage_Stratagem_Icon.png/50px-Orbital_Napalm_Barrage_Stratagem_Icon.png?e6fc05",
        "id": 19,
    },
    {
        "stratagem": "Orbital Railcannon Strike",
        "code": [
            "L",
            "U",
            "D",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/6f/Orbital_Railcannon_Strike_Stratagem_Icon.png/50px-Orbital_Railcannon_Strike_Stratagem_Icon.png?e99667",
        "id": 20,
    },
    {
        "stratagem": "Eagle Strafing Run",
        "code": [
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/f/f3/Eagle_Strafing_Run_Stratagem_Icon.png/50px-Eagle_Strafing_Run_Stratagem_Icon.png?e6ad30",
        "id": 21,
    },
    {
        "stratagem": "Eagle Airstrike",
        "code": [
            "U",
            "L",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/72/Eagle_Airstrike_Stratagem_Icon.png/50px-Eagle_Airstrike_Stratagem_Icon.png?685944",
        "id": 22,
    },
    {
        "stratagem": "Eagle Cluster Bomb",
        "code": [
            "U",
            "L",
            "D",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/4/4f/Eagle_Cluster_Bomb_Stratagem_Icon.png/50px-Eagle_Cluster_Bomb_Stratagem_Icon.png?4c4860",
        "id": 23,
    },
    {
        "stratagem": "Eagle Napalm Airstrike",
        "code": [
            "U",
            "L",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/4/42/Eagle_Napalm_Airstrike_Stratagem_Icon.png/50px-Eagle_Napalm_Airstrike_Stratagem_Icon.png?ab5aa8",
        "id": 24,
    },
    {
        "stratagem": "LIFT-850 Jump Pack",
        "code": [
            "D",
            "U",
            "U",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/f/f5/Jump_Pack_Stratagem_Icon.png/50px-Jump_Pack_Stratagem_Icon.png?b2b166",
        "id": 25,
    },
    {
        "stratagem": "Eagle Smoke Strike",
        "code": [
            "U",
            "L",
            "U",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/05/Eagle_Smoke_Strike_Stratagem_Icon.png/50px-Eagle_Smoke_Strike_Stratagem_Icon.png?1cd323",
        "id": 26,
    },
    {
        "stratagem": "Eagle 110mm Rocket Pods",
        "code": [
            "U",
            "L",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/e/ef/Eagle_110mm_Rocket_Pods_Stratagem_Icon.png/50px-Eagle_110mm_Rocket_Pods_Stratagem_Icon.png?f9934d",
        "id": 27,
    },
    {
        "stratagem": "Eagle 500kg Bomb",
        "code": [
            "U",
            "L",
            "D",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/e/e5/Eagle_500kg_Bomb_Stratagem_Icon.png/50px-Eagle_500kg_Bomb_Stratagem_Icon.png?ff6faf",
        "id": 28,
    },
    {
        "stratagem": "M-102 Fast Recon Vehicle",
        "code": [
            "L",
            "D",
            "L",
            "D",
            "L",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/00/M-102_Fast_Recon_Vehicle_Stratagem_Icon.png/50px-M-102_Fast_Recon_Vehicle_Stratagem_Icon.png?8cb2ad",
        "id": 29,
    },
    {
        "stratagem": "Orbital Precision Strike",
        "code": [
            "L",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/2/2a/Orbital_Precision_Strike_Stratagem_Icon.png/50px-Orbital_Precision_Strike_Stratagem_Icon.png?561f51",
        "id": 30,
    },
    {
        "stratagem": "Orbital Gas Strike",
        "code": [
            "L",
            "L",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/c/cd/Orbital_Gas_Strike_Stratagem_Icon.png/50px-Orbital_Gas_Strike_Stratagem_Icon.png?5d9ba4",
        "id": 31,
    },
    {
        "stratagem": "Orbital EMS Strike",
        "code": [
            "L",
            "L",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/1/16/Orbital_EMS_Strike_Stratagem_Icon.png/50px-Orbital_EMS_Strike_Stratagem_Icon.png?77534f",
        "id": 32,
    },
    {
        "stratagem": "Orbital Smoke Strike",
        "code": [
            "L",
            "L",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/b/bc/Orbital_Smoke_Strike_Stratagem_Icon.png/50px-Orbital_Smoke_Strike_Stratagem_Icon.png?a063f8",
        "id": 33,
    },
    {
        "stratagem": "E/MG-101 HMG Emplacement",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/03/HMG_Emplacement_Stratagem_Icon.png/50px-HMG_Emplacement_Stratagem_Icon.png?5f9e66",
        "id": 34,
    },
    {
        "stratagem": "FX-12 Shield Generator Relay",
        "code": [
            "D",
            "D",
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/e/e4/Shield_Generator_Relay_Stratagem_Icon.png/50px-Shield_Generator_Relay_Stratagem_Icon.png?64b940",
        "id": 35,
    },
    {
        "stratagem": "A/ARC-3 Tesla Tower",
        "code": [
            "D",
            "U",
            "L",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/8/8f/Tesla_Tower_Stratagem_Icon.png/50px-Tesla_Tower_Stratagem_Icon.png?81457b",
        "id": 36,
    },
    {
        "stratagem": "E/GL-21 Grenadier Battlement",
        "code": [
            "D",
            "L",
            "D",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/3f/GL-21_Grenadier_Battlement_Stratagem_Icon.png/50px-GL-21_Grenadier_Battlement_Stratagem_Icon.png?747ef0",
        "id": 37,
    },
    {
        "stratagem": "MD-6 Anti-Personnel Minefield",
        "code": [
            "D",
            "L",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/b/bb/Anti-Personnel_Minefield_Stratagem_Icon.png/50px-Anti-Personnel_Minefield_Stratagem_Icon.png?6887f0",
        "id": 38,
    },
    {
        "stratagem": "B-1 Supply Pack",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "U",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/61/Supply_Pack_Stratagem_Icon.png/50px-Supply_Pack_Stratagem_Icon.png?90980d",
        "id": 39,
    },
    {
        "stratagem": "GL-21 Grenade Launcher",
        "code": [
            "D",
            "L",
            "U",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/c/cf/Grenade_Launcher_Stratagem_Icon.png/50px-Grenade_Launcher_Stratagem_Icon.png?b2eee9",
        "id": 40,
    },
    {
        "stratagem": "LAS-98 Laser Cannon",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/c/c3/Laser_Cannon_Stratagem_Icon.png/50px-Laser_Cannon_Stratagem_Icon.png?95398f",
        "id": 41,
    },
    {
        "stratagem": "MD-I4 Incendiary Mines",
        "code": [
            "D",
            "L",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/4/40/Incendiary_Mines_Stratagem_Icon.png/50px-Incendiary_Mines_Stratagem_Icon.png?b0bff9",
        "id": 42,
    },
    {
        "stratagem": 'AX/LAS-5 "Guard Dog" Rover',
        "code": [
            "D",
            "U",
            "L",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/6f/Guard_Dog_Rover_Stratagem_Icon.png/50px-Guard_Dog_Rover_Stratagem_Icon.png?7ad22e",
        "id": 43,
    },
    {
        "stratagem": "SH-20 Ballistic Shield Backpack",
        "code": [
            "D",
            "L",
            "D",
            "D",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/37/Ballistic_Shield_Backpack_Stratagem_Icon.png/50px-Ballistic_Shield_Backpack_Stratagem_Icon.png?ace094",
        "id": 44,
    },
    {
        "stratagem": "ARC-3 Arc Thrower",
        "code": [
            "D",
            "L",
            "D",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/1/10/Arc_Thrower_Stratagem_Icon.png/50px-Arc_Thrower_Stratagem_Icon.png?63ff8b",
        "id": 45,
    },
    {
        "stratagem": "MD-17 Anti-Tank Mines",
        "code": [
            "D",
            "L",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/b/ba/MD-17_Anti-Tank_Mines_Stratagem_Icon.png/50px-MD-17_Anti-Tank_Mines_Stratagem_Icon.png?589106",
        "id": 46,
    },
    {
        "stratagem": "LAS-99 Quasar Cannon",
        "code": [
            "D",
            "D",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/8/87/Quasar_Cannon_Stratagem_Icon.png/50px-Quasar_Cannon_Stratagem_Icon.png?3e527d",
        "id": 47,
    },
    {
        "stratagem": "SH-32 Shield Generator Pack",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/9/99/Shield_Generator_Pack_Stratagem_Icon.png/50px-Shield_Generator_Pack_Stratagem_Icon.png?d35b0f",
        "id": 48,
    },
    {
        "stratagem": "MD-8 Gas Mines",
        "code": [
            "D",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/1/13/Gas_Minefield_Stratagem_Icon.png/50px-Gas_Minefield_Stratagem_Icon.png?3b8000",
        "id": 49,
    },
    {
        "stratagem": "A/MG-43 Machine Gun Sentry",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/5/5a/Machine_Gun_Sentry_Stratagem_Icon.png/50px-Machine_Gun_Sentry_Stratagem_Icon.png?3998e1",
        "id": 50,
    },
    {
        "stratagem": "A/G-16 Gatling Sentry",
        "code": [
            "D",
            "U",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/2/28/Gatling_Sentry_Stratagem_Icon.png/50px-Gatling_Sentry_Stratagem_Icon.png?b959a4",
        "id": 51,
    },
    {
        "stratagem": "A/M-12 Mortar Sentry",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/ad/Mortar_Sentry_Stratagem_Icon.png/50px-Mortar_Sentry_Stratagem_Icon.png?1252af",
        "id": 52,
    },
    {
        "stratagem": 'AX/AR-23 "Guard Dog"',
        "code": [
            "D",
            "U",
            "L",
            "U",
            "L",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/73/Guard_Dog_Stratagem_Icon.png/50px-Guard_Dog_Stratagem_Icon.png?61d1b4",
        "id": 53,
    },
    {
        "stratagem": "A/AC-8 Autocannon Sentry",
        "code": [
            "D",
            "U",
            "L",
            "U",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/a7/Autocannon_Sentry_Stratagem_Icon.png/50px-Autocannon_Sentry_Stratagem_Icon.png?bae013",
        "id": 54,
    },
    {
        "stratagem": "A/MLS-4X Rocket Sentry",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/62/Rocket_Sentry_Stratagem_Icon.png/50px-Rocket_Sentry_Stratagem_Icon.png?f65e40",
        "id": 55,
    },
    {
        "stratagem": "A/M-23 EMS Mortar Sentry",
        "code": [
            "D",
            "U",
            "L",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/a8/AM-23_EMS_Mortar_Sentry_Stratagem_Icon.png/50px-AM-23_EMS_Mortar_Sentry_Stratagem_Icon.png?f0de8a",
        "id": 56,
    },
    {
        "stratagem": "EXO-45 Patriot Exosuit",
        "code": [
            "L",
            "D",
            "L",
            "U",
            "L",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/30/EXO-45_Patriot_Exosuit_Stratagem_Icon.png/50px-EXO-45_Patriot_Exosuit_Stratagem_Icon.png?64a72f",
        "id": 57,
    },
    {
        "stratagem": "EXO-49 Emancipator Exosuit",
        "code": [
            "L",
            "D",
            "L",
            "U",
            "L",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/8/82/EXO-49_Emancipator_Exosuit_Stratagem_Icon.png/50px-EXO-49_Emancipator_Exosuit_Stratagem_Icon.png?6f2e3c",
        "id": 58,
    },
    {
        "stratagem": "TX-41 Sterilizer",
        "code": [
            "D",
            "L",
            "U",
            "D",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/2/29/Sterilizer_Stratagem_Icon.png/50px-Sterilizer_Stratagem_Icon.png?5f6a3c",
        "id": 59,
    },
    {
        "stratagem": 'AX/TX-13 "Guard Dog" Dog Breath',
        "code": [
            "D",
            "U",
            "L",
            "U",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/2/20/Guard_Dog_Dog_Breath_Stratagem_Icon.png/50px-Guard_Dog_Dog_Breath_Stratagem_Icon.png?9e6385",
        "id": 60,
    },
    {
        "stratagem": "SH-51 Directional Shield",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/b/b7/SH-51_Directional_Shield_Stratagem_Icon.png/50px-SH-51_Directional_Shield_Stratagem_Icon.png?4e63ec",
        "id": 61,
    },
    {
        "stratagem": "E/AT-12 Anti-Tank Emplacement",
        "code": [
            "D",
            "U",
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/62/E_AT-12_Anti-Tank_Emplacement_Stratagem_Icon.png/50px-E_AT-12_Anti-Tank_Emplacement_Stratagem_Icon.png?3fbc70",
        "id": 62,
    },
    {
        "stratagem": "A/FLAM-40 Flame Sentry",
        "code": [
            "D",
            "U",
            "L",
            "D",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/0e/A_FLAM-40_Flame_Sentry_Stratagem_Icon.png/50px-A_FLAM-40_Flame_Sentry_Stratagem_Icon.png?c4c859",
        "id": 63,
    },
    {
        "stratagem": "B-100 Portable Hellbomb",
        "code": [
            "D",
            "L",
            "U",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/aa/Portable_Hellbomb_Stratagem_Icon.png/50px-Portable_Hellbomb_Stratagem_Icon.png?c9a263",
        "id": 64,
    },
    {
        "stratagem": "LIFT-860 Hover Pack",
        "code": [
            "D",
            "U",
            "U",
            "D",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/5/5d/Hover_Pack_Stratagem_Icon.png/50px-Hover_Pack_Stratagem_Icon.png?a00cb1",
        "id": 65,
    },
    {
        "stratagem": "Reinforce",
        "code": [
            "U",
            "D",
            "L",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/5/5c/Reinforce_Stratagem_Icon.png/50px-Reinforce_Stratagem_Icon.png?653984",
        "id": 66,
    },
    {
        "stratagem": "SoS Beacon",
        "code": [
            "U",
            "D",
            "L",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/3d/SOS_Beacon_Stratagem_Icon.png/50px-SOS_Beacon_Stratagem_Icon.png?21c230",
        "id": 67,
    },
    {
        "stratagem": "Resupply",
        "code": [
            "D",
            "D",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/6/64/Resupply_Stratagem_Icon.png/50px-Resupply_Stratagem_Icon.png?874804",
        "id": 68,
    },
    {
        "stratagem": "Eagle Rearm",
        "code": [
            "U",
            "U",
            "L",
            "U",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/08/Eagle_Rearm_Stratagem_Icon.png/50px-Eagle_Rearm_Stratagem_Icon.png?1d2fc1",
        "id": 69,
    },
    {
        "stratagem": "SSSD Delivery",
        "code": [
            "D",
            "D",
            "D",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/5/53/Start_Upload_Stratagem_Icon.svg?4c4715",
        "id": 70,
    },
    {
        "stratagem": "Prospecting Drill",
        "code": [
            "D",
            "D",
            "L",
            "L",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/02/Prospecting_Drill_Stratagem_Icon.png/50px-Prospecting_Drill_Stratagem_Icon.png?1ab95c",
        "id": 71,
    },
    {
        "stratagem": "Super Earth Flag",
        "code": [
            "D",
            "U",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/3/3c/Super_Earth_Flag_Stratagem_Icon.png/50px-Super_Earth_Flag_Stratagem_Icon.png?4c5f80",
        "id": 72,
    },
    {
        "stratagem": "NUX-223 Hellbomb",
        "code": [
            "D",
            "U",
            "L",
            "D",
            "U",
            "L",
            "D",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/a/a0/Hellbomb_Stratagem_Icon.png/50px-Hellbomb_Stratagem_Icon.png?6c240b",
        "id": 73,
    },
    {
        "stratagem": "Upload Data",
        "code": [
            "L",
            "L",
            "U",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/5/53/Start_Upload_Stratagem_Icon.svg?4c4715",
        "id": 74,
    },
    {
        "stratagem": "Seismic Probe",
        "code": [
            "U",
            "U",
            "L",
            "L",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/74/Seismic_Probe_Stratagem_Icon.png/50px-Seismic_Probe_Stratagem_Icon.png?e1a0e3",
        "id": 75,
    },
    {
        "stratagem": "Orbital Illumination Flare",
        "code": [
            "L",
            "L",
            "L",
            "L",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/f/f9/Orbital_Illumination_Flare_Stratagem_Icon.png/50px-Orbital_Illumination_Flare_Stratagem_Icon.png?9a63e8",
        "id": 76,
    },
    {
        "stratagem": "SEAF Artillery",
        "code": [
            "L",
            "U",
            "U",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/f/f7/SEAF_Artillery_Stratagem_Icon.png/50px-SEAF_Artillery_Stratagem_Icon.png?19a114",
        "id": 77,
    },
    {
        "stratagem": "Dark Fluid Vessel",
        "code": [
            "U",
            "L",
            "L",
            "D",
            "U",
            "U",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/7/7b/Dark_Fluid_Vessel_Stratagem_Icon.png/50px-Dark_Fluid_Vessel_Stratagem_Icon.png?ddd0df",
        "id": 78,
    },
    {
        "stratagem": "Tectonic Drill",
        "code": [
            "U",
            "D",
            "U",
            "D",
            "U",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/02/Prospecting_Drill_Stratagem_Icon.png/50px-Prospecting_Drill_Stratagem_Icon.png?1ab95c",
        "id": 79,
    },
    {
        "stratagem": "Hive Breaker Drill",
        "code": [
            "L",
            "U",
            "D",
            "L",
            "D",
            "D",
        ],
        "link":
            "https://helldivers.wiki.gg/images/thumb/0/02/Prospecting_Drill_Stratagem_Icon.png/50px-Prospecting_Drill_Stratagem_Icon.png?1ab95c",
        "id": 80,
    },
];

export const StratagemsContext = createContext<
    StratagemsContextType | undefined
>(undefined);

export function defaultStratagemsContext(): StratagemsContextType {
    const [stratagems, setStratagems] = useState<Stratagem[]>(
        strats.sort((a, b) => {
            if (a.stratagem < b.stratagem) {
                return -1
            }
            else if (a.stratagem > b.stratagem) {
                return 1
            }
            return 0
        }),
    );

    return {
        stratagems: stratagems,
        setStratagems: setStratagems,
    };
}
