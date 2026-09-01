import type {
  ArrowDir,
  DangerLevel,
  Stratagem,
  StratagemCategory,
} from "../types";

type Row = [
  id: string,
  name: string,
  category: StratagemCategory,
  code: ArrowDir[],
  description: string,
  danger?: DangerLevel,
];

const ROWS: Row[] = [
  // ── Patriotic Administration Center ────────────────────────────────
  ["machine-gun", "Machine Gun", "Patriotic Administration Center", ["down", "left", "down", "up", "right"], "Fully automatic support weapon. 900 rounds of managed democracy per minute."],
  ["anti-materiel-rifle", "Anti-Materiel Rifle", "Patriotic Administration Center", ["down", "left", "right", "up", "down"], "High-caliber sniper rifle. Deletes armor plates and self-esteem."],
  ["stalwart", "Stalwart", "Patriotic Administration Center", ["down", "left", "down", "up", "up", "left"], "Light machine gun with a bottomless appetite for bugs."],
  ["expendable-anti-tank", "Expendable Anti-Tank", "Patriotic Administration Center", ["down", "down", "left", "up", "right"], "Disposable rocket launcher. Comes in pairs, because freedom needs volume."],
  ["recoilless-rifle", "Recoilless Rifle", "Patriotic Administration Center", ["down", "left", "right", "right", "left"], "Shoulder-fired anti-armor. Team reload advised, not required."],
  ["flamethrower", "Flamethrower", "Patriotic Administration Center", ["down", "left", "up", "down", "up"], "Sets everything in front of you on fire. Everything."],
  ["autocannon", "Autocannon", "Patriotic Administration Center", ["down", "left", "down", "up", "up", "right"], "Rapid-fire explosive rounds for crowd control and property damage."],
  ["heavy-machine-gun", "Heavy Machine Gun", "Patriotic Administration Center", ["down", "left", "up", "down", "down"], "Belt-fed punishment with a slow reload you will respect."],
  ["airburst-rocket-launcher", "Airburst Rocket Launcher", "Patriotic Administration Center", ["down", "up", "up", "left", "right"], "Proximity rockets. Friendly fire is not friendly.", "yellow"],
  ["railgun", "Railgun", "Patriotic Administration Center", ["down", "right", "down", "up", "left", "right"], "Charge-and-fire kinetic penetrator. Do not overcharge. Do overcharge.", "yellow"],
  ["spear", "Spear", "Patriotic Administration Center", ["down", "down", "up", "down", "down"], "Lock-on anti-tank missiles that occasionally miss. Dramatically."],
  ["grenade-launcher", "Grenade Launcher", "Patriotic Administration Center", ["down", "left", "up", "left", "down"], "Belt-fed 40mm grenades. Problem: crowd. Solution: explosions."],
  ["quasar-cannon", "Quasar Cannon", "Patriotic Administration Center", ["down", "down", "up", "left", "right"], "Infinite ammo laser cannon. Cooldown included at no extra cost."],
  ["arc-thrower", "Arc Thrower", "Patriotic Administration Center", ["down", "right", "up", "left", "down"], "Chains lightning through targets. Democracy is conductive."],
  ["commando", "Commando", "Patriotic Administration Center", ["down", "left", "up", "down", "right"], "Four-shot laser-guided launcher. Expire after use."],
  ["wasp-launcher", "W.A.S.P. Launcher", "Patriotic Administration Center", ["down", "down", "up", "down", "right"], "Swarm missiles. One trigger pull, many problems solved."],
  ["reinforce", "Reinforce", "Patriotic Administration Center", ["up", "down", "right", "left", "up"], "Summons a replacement Helldiver. Managed Democracy thanks you for your sacrifice."],
  ["sos-beacon", "SOS Beacon", "Patriotic Administration Center", ["up", "down", "right", "up"], "Calls for reinforcements from the community. Freedom requires numbers."],
  ["resupply", "Resupply", "Patriotic Administration Center", ["down", "down", "up", "right"], "Resupply pod. Ammo, stims and democracy delivered at terminal velocity."],
  ["seaf-artillery", "SEAF Artillery", "Patriotic Administration Center", ["right", "up", "up", "down"], "Loads the big gun. Shell variety not guaranteed.", "yellow"],

  // ── Orbital Cannons ────────────────────────────────────────────────
  ["orbital-precision", "Orbital Precision Strike", "Orbital Cannons", ["right", "right", "up"], "A single shell of surgical democracy."],
  ["orbital-gatling", "Orbital Gatling Barrage", "Orbital Cannons", ["right", "down", "left", "up", "up"], "Sustained orbital fire. Excellent for encouraging retreat."],
  ["orbital-airburst", "Orbital Airburst Strike", "Orbital Cannons", ["right", "right", "right"], "Aerial burst shrapnel over a wide area. Keep your head down.", "yellow"],
  ["orbital-120mm", "Orbital 120MM HE Barrage", "Orbital Cannons", ["right", "right", "down", "left", "right", "down"], "Cluster of high-explosive shells. Area denial, delivered.", "yellow"],
  ["orbital-380mm", "Orbital 380MM HE Barrage", "Orbital Cannons", ["right", "down", "up", "up", "left", "down", "down"], "Prolonged saturation bombardment. Danger close means very far.", "red"],
  ["orbital-walking", "Orbital Walking Barrage", "Orbital Cannons", ["right", "down", "right", "down", "right", "down"], "A creeping wall of explosions advancing on the enemy.", "yellow"],
  ["orbital-laser", "Orbital Laser", "Orbital Cannons", ["right", "down", "up", "right", "down"], "A giant laser that tracks the largest target. Three uses. Choose wisely.", "red"],
  ["orbital-railcannon", "Orbital Railcannon Strike", "Orbital Cannons", ["right", "up", "down", "down", "right"], "Locks onto the biggest thing in the area and deletes it.", "red"],
  ["orbital-gas", "Orbital Gas Strike", "Orbital Cannons", ["right", "right", "down", "right"], "Corrosive gas. Bugs cough, bots rust, Helldivers hold their breath."],

  // ── Hangar ─────────────────────────────────────────────────────────
  ["eagle-strafing", "Eagle Strafing Run", "Hangar", ["up", "right", "right"], "Cannon strafing line from an Eagle. Fast, loud, patriotic."],
  ["eagle-airstrike", "Eagle Airstrike", "Hangar", ["up", "right", "down", "right"], "A line of bombs. The classic. The dependable."],
  ["eagle-cluster", "Eagle Cluster Bomb", "Hangar", ["up", "right", "down", "down", "right"], "Scatters bomblets across a wide area. Point away from face.", "yellow"],
  ["eagle-napalm", "Eagle Napalm Airstrike", "Hangar", ["up", "right", "down", "up"], "Blankets the ground in fire. The bugs hate this one trick.", "yellow"],
  ["eagle-smoke", "Eagle Smoke Strike", "Hangar", ["up", "up", "down", "right"], "Conceals your retreat. Tactical. Cowardly. Effective."],
  ["eagle-rocket-pods", "Eagle 110MM Rocket Pods", "Hangar", ["up", "right", "up", "left"], "Rocket barrage aimed at the largest armored target."],
  ["eagle-500kg", "Eagle 500KG Bomb", "Hangar", ["up", "right", "down", "down", "down"], "One bomb. Half a ton. Run.", "red"],
  ["eagle-rearm", "Eagle Rearm", "Hangar", ["up", "up", "left", "up", "right"], "Recalls the Eagle for rearming. Patience is patriotic."],
  ["jump-pack", "Jump Pack", "Hangar", ["down", "up", "up", "down", "up"], "Personal jetpack. Gravity is now optional."],

  // ── Bridge ─────────────────────────────────────────────────────────
  ["orbital-ems", "Orbital EMS Strike", "Bridge", ["right", "right", "left", "down"], "Stuns and slows everything in the radius, Helldivers included."],
  ["orbital-smoke", "Orbital Smoke Strike", "Bridge", ["right", "right", "up", "right"], "Orbital smoke screen. For when discretion beats firepower."],
  ["hellbomb", "Hellbomb", "Bridge", ["down", "up", "left", "down", "up", "right", "down", "up"], "Deploy the bomb. Activate it. Run.", "red"],

  // ── Engineering Bay ────────────────────────────────────────────────
  ["anti-personnel-mines", "Anti-Personnel Minefield", "Engineering Bay", ["down", "left", "up", "right"], "Mines. For enemies. Probably.", "yellow"],
  ["incendiary-mines", "Incendiary Mines", "Engineering Bay", ["down", "left", "left", "down"], "Fire mines. Warmer, meaner, brighter.", "yellow"],
  ["shield-generator-relay", "Shield Generator Relay", "Engineering Bay", ["down", "down", "left", "right", "left", "right"], "Projects a protective dome. Mostly for the enemy to shoot at."],
  ["tesla-tower", "Tesla Tower", "Engineering Bay", ["down", "up", "right", "up", "left", "right"], "Zaps anything that moves nearby. Including you.", "yellow"],
  ["hmg-emplacement", "HMG Emplacement", "Engineering Bay", ["down", "up", "left", "right", "right", "left"], "Mounted heavy machine gun. Become the bunker."],
  ["anti-tank-emplacement", "Anti-Tank Emplacement", "Engineering Bay", ["down", "up", "left", "left", "up", "down"], "Mounted anti-tank cannon. For very large regrets."],
  ["supply-pack", "Supply Pack", "Engineering Bay", ["down", "left", "down", "up", "up", "down"], "Backpack full of resupplies. Sharing is caring."],
  ["shield-generator-pack", "Shield Generator Pack", "Engineering Bay", ["down", "up", "left", "right", "left", "right"], "Personal energy shield. Absorbs one embarrassing mistake."],
  ["ballistic-shield", "Ballistic Shield Backpack", "Engineering Bay", ["down", "left", "down", "down", "up", "left"], "A shield. For pushing forward. Slowly."],

  // ── Robotics Workshop ──────────────────────────────────────────────
  ["mg-sentry", "Machine Gun Sentry", "Robotics Workshop", ["down", "up", "right", "right", "up"], "Automated machine gun. Enthusiastic, if brief."],
  ["gatling-sentry", "Gatling Sentry", "Robotics Workshop", ["down", "up", "right", "left"], "More gun. Faster. The turret equivalent of caffeine."],
  ["mortar-sentry", "Mortar Sentry", "Robotics Workshop", ["down", "up", "right", "right", "down"], "Indirect fire support with an occasional friendly reminder."],
  ["autocannon-sentry", "Autocannon Sentry", "Robotics Workshop", ["down", "up", "right", "up", "left", "up"], "Heavy rounds. Heavy commitment."],
  ["rocket-sentry", "Rocket Sentry", "Robotics Workshop", ["down", "up", "right", "right", "left"], "Rockets. For the biggest targets and the biggest misses.", "yellow"],
  ["ems-mortar-sentry", "EMS Mortar Sentry", "Robotics Workshop", ["down", "up", "right", "down", "right"], "Stuns enemies at range. Everyone else gets a light massage."],
  ["guard-dog", "Guard Dog", "Robotics Workshop", ["down", "up", "left", "up", "right", "down"], "Laser drone bodyguard. Loyal, precise, slightly judgy."],
  ["guard-dog-rover", "Guard Dog Rover", "Robotics Workshop", ["down", "up", "left", "up", "right", "right"], "Rifle drone. The louder sibling."],
];

export const STRATAGEMS: Stratagem[] = ROWS.map(([id, name, category, code, description, danger]) => ({
  id,
  name,
  category,
  code,
  description,
  danger: danger ?? "none",
}));

export const STRATAGEM_BY_ID: ReadonlyMap<string, Stratagem> = new Map(
  STRATAGEMS.map((s) => [s.id, s]),
);
