//! Payloads crossing the Tauri command/event boundary for the key engine.

use serde::{Deserialize, Serialize};

use keyrs::Key;

use crate::keys::combo::parse_key;

/// Which physical keys represent the four stratagem code directions.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DirectionKeys {
    pub up: String,
    pub left: String,
    pub down: String,
    pub right: String,
}

/// One binding from a loadout: a trigger chord and the code to emit.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BindingConfig {
    /// Trigger combination — any set of keyrs key names.
    pub combo: Vec<String>,
    /// Code to emit, as direction names ("up" | "left" | "down" | "right").
    pub code: Vec<String>,
    /// Display name, used for trigger feedback events.
    #[serde(default)]
    pub name: Option<String>,
}

/// Everything the engine needs to arm a loadout.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActivationConfig {
    pub direction_keys: DirectionKeys,
    pub bindings: Vec<BindingConfig>,
}

/// A binding after validation: real `Key`s, ready for the engine.
#[derive(Debug, Clone)]
pub struct ParsedBinding {
    pub combo: Vec<Key>,
    pub code: Vec<Key>,
    pub name: String,
}

/// Parse a keyrs key name back into a [`Key`] (round-trip of `Key::to_string`).
pub fn parse_binding(
    config: &BindingConfig,
    dirs: &ParsedDirections,
) -> Result<ParsedBinding, String> {
    let combo = config
        .combo
        .iter()
        .map(|name| {
            parse_key(name).ok_or_else(|| format!("unknown key {name:?} in combo"))
        })
        .collect::<Result<Vec<Key>, String>>()?;
    if combo.is_empty() {
        return Err("binding has an empty combo".to_string());
    }

    let code = config
        .code
        .iter()
        .map(|dir| match dir.as_str() {
            "up" => Ok(dirs.up),
            "left" => Ok(dirs.left),
            "down" => Ok(dirs.down),
            "right" => Ok(dirs.right),
            other => Err(format!("unknown code direction {other:?}")),
        })
        .collect::<Result<Vec<Key>, String>>()?;
    if code.is_empty() {
        return Err("binding has an empty code".to_string());
    }

    Ok(ParsedBinding {
        combo,
        code,
        name: config.name.clone().unwrap_or_else(|| "stratagem".to_string()),
    })
}

/// The four direction keys after validation.
#[derive(Debug, Clone, Copy)]
pub struct ParsedDirections {
    pub up: Key,
    pub left: Key,
    pub down: Key,
    pub right: Key,
}

impl ParsedDirections {
    pub fn parse(dirs: &DirectionKeys) -> Result<Self, String> {
        let parsed = Self {
            up: parse_key(&dirs.up).ok_or_else(|| format!("unknown key {:?} for UP", dirs.up))?,
            left: parse_key(&dirs.left)
                .ok_or_else(|| format!("unknown key {:?} for LEFT", dirs.left))?,
            down: parse_key(&dirs.down)
                .ok_or_else(|| format!("unknown key {:?} for DOWN", dirs.down))?,
            right: parse_key(&dirs.right)
                .ok_or_else(|| format!("unknown key {:?} for RIGHT", dirs.right))?,
        };

        // Colliding direction keys would make emitted codes ambiguous.
        let keys = [parsed.up, parsed.left, parsed.down, parsed.right];
        for (i, a) in keys.iter().enumerate() {
            for b in keys.iter().skip(i + 1) {
                if a == b {
                    return Err(format!("direction keys must be distinct: {a}"));
                }
            }
        }

        Ok(parsed)
    }
}

// ── Events emitted to the frontend ─────────────────────────────────────

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordUpdate {
    pub pressed: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordComplete {
    pub combo: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecordError {
    pub message: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TriggerEvent {
    pub stratagem: String,
}
