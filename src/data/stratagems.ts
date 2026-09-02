import type { ArrowDir, Stratagem } from "../types";

type Row = [id: string, name: string, code: ArrowDir[]];

const ROWS: Row[] = [
  // ── Support weapons ────────────────────────────────────────────────
  ["machine-gun", "Machine Gun", ["down", "left", "down", "up", "right"]],
  ["anti-materiel-rifle", "Anti-Materiel Rifle", ["down", "left", "right", "up", "down"]],
  ["stalwart", "Stalwart", ["down", "left", "down", "up", "up", "left"]],
  ["expendable-anti-tank", "Expendable Anti-Tank", ["down", "down", "left", "up", "right"]],
  ["recoilless-rifle", "Recoilless Rifle", ["down", "left", "right", "right", "left"]],
  ["flamethrower", "Flamethrower", ["down", "left", "up", "down", "up"]],
  ["autocannon", "Autocannon", ["down", "left", "down", "up", "up", "right"]],
  ["heavy-machine-gun", "Heavy Machine Gun", ["down", "left", "up", "down", "down"]],
  ["airburst-rocket-launcher", "Airburst Rocket Launcher", ["down", "up", "up", "left", "right"]],
  ["railgun", "Railgun", ["down", "right", "down", "up", "left", "right"]],
  ["spear", "Spear", ["down", "down", "up", "down", "down"]],
  ["grenade-launcher", "Grenade Launcher", ["down", "left", "up", "left", "down"]],
  ["quasar-cannon", "Quasar Cannon", ["down", "down", "up", "left", "right"]],
  ["arc-thrower", "Arc Thrower", ["down", "right", "up", "left", "down"]],
  ["commando", "Commando", ["down", "left", "up", "down", "right"]],
  ["wasp-launcher", "W.A.S.P. Launcher", ["down", "down", "up", "down", "right"]],

  // ── Mission & calls ────────────────────────────────────────────────
  ["reinforce", "Reinforce", ["up", "down", "right", "left", "up"]],
  ["sos-beacon", "SOS Beacon", ["up", "down", "right", "up"]],
  ["resupply", "Resupply", ["down", "down", "up", "right"]],
  ["seaf-artillery", "SEAF Artillery", ["right", "up", "up", "down"]],
  ["hellbomb", "Hellbomb", ["down", "up", "left", "down", "up", "right", "down", "up"]],

  // ── Orbital ────────────────────────────────────────────────────────
  ["orbital-precision", "Orbital Precision Strike", ["right", "right", "up"]],
  ["orbital-gatling", "Orbital Gatling Barrage", ["right", "down", "left", "up", "up"]],
  ["orbital-airburst", "Orbital Airburst Strike", ["right", "right", "right"]],
  ["orbital-120mm", "Orbital 120MM HE Barrage", ["right", "right", "down", "left", "right", "down"]],
  ["orbital-380mm", "Orbital 380MM HE Barrage", ["right", "down", "up", "up", "left", "down", "down"]],
  ["orbital-walking", "Orbital Walking Barrage", ["right", "down", "right", "down", "right", "down"]],
  ["orbital-laser", "Orbital Laser", ["right", "down", "up", "right", "down"]],
  ["orbital-railcannon", "Orbital Railcannon Strike", ["right", "up", "down", "down", "right"]],
  ["orbital-gas", "Orbital Gas Strike", ["right", "right", "down", "right"]],
  ["orbital-ems", "Orbital EMS Strike", ["right", "right", "left", "down"]],
  ["orbital-smoke", "Orbital Smoke Strike", ["right", "right", "up", "right"]],

  // ── Eagle ──────────────────────────────────────────────────────────
  ["eagle-strafing", "Eagle Strafing Run", ["up", "right", "right"]],
  ["eagle-airstrike", "Eagle Airstrike", ["up", "right", "down", "right"]],
  ["eagle-cluster", "Eagle Cluster Bomb", ["up", "right", "down", "down", "right"]],
  ["eagle-napalm", "Eagle Napalm Airstrike", ["up", "right", "down", "up"]],
  ["eagle-smoke", "Eagle Smoke Strike", ["up", "up", "down", "right"]],
  ["eagle-rocket-pods", "Eagle 110MM Rocket Pods", ["up", "right", "up", "left"]],
  ["eagle-500kg", "Eagle 500KG Bomb", ["up", "right", "down", "down", "down"]],
  ["eagle-rearm", "Eagle Rearm", ["up", "up", "left", "up", "right"]],

  // ── Backpacks & emplacements ───────────────────────────────────────
  ["jump-pack", "Jump Pack", ["down", "up", "up", "down", "up"]],
  ["supply-pack", "Supply Pack", ["down", "left", "down", "up", "up", "down"]],
  ["shield-generator-pack", "Shield Generator Pack", ["down", "up", "left", "right", "left", "right"]],
  ["ballistic-shield", "Ballistic Shield Backpack", ["down", "left", "down", "down", "up", "left"]],
  ["hmg-emplacement", "HMG Emplacement", ["down", "up", "left", "right", "right", "left"]],
  ["anti-tank-emplacement", "Anti-Tank Emplacement", ["down", "up", "left", "left", "up", "down"]],
  ["anti-personnel-mines", "Anti-Personnel Minefield", ["down", "left", "up", "right"]],
  ["incendiary-mines", "Incendiary Mines", ["down", "left", "left", "down"]],
  ["shield-generator-relay", "Shield Generator Relay", ["down", "down", "left", "right", "left", "right"]],
  ["tesla-tower", "Tesla Tower", ["down", "up", "right", "up", "left", "right"]],

  // ── Sentries & drones ──────────────────────────────────────────────
  ["mg-sentry", "Machine Gun Sentry", ["down", "up", "right", "right", "up"]],
  ["gatling-sentry", "Gatling Sentry", ["down", "up", "right", "left"]],
  ["mortar-sentry", "Mortar Sentry", ["down", "up", "right", "right", "down"]],
  ["autocannon-sentry", "Autocannon Sentry", ["down", "up", "right", "up", "left", "up"]],
  ["rocket-sentry", "Rocket Sentry", ["down", "up", "right", "right", "left"]],
  ["ems-mortar-sentry", "EMS Mortar Sentry", ["down", "up", "right", "down", "right"]],
  ["guard-dog", "Guard Dog", ["down", "up", "left", "up", "right", "down"]],
  ["guard-dog-rover", "Guard Dog Rover", ["down", "up", "left", "up", "right", "right"]],
];

export const STRATAGEMS: Stratagem[] = ROWS.map(([id, name, code]) => ({
  id,
  name,
  code,
}));

export const STRATAGEM_BY_ID: ReadonlyMap<string, Stratagem> = new Map(
  STRATAGEMS.map((s) => [s.id, s]),
);
