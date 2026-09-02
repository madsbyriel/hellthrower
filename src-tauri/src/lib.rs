use std::env;
use std::time::Duration;

use serde::Serialize;
use stratbase_client::{Binding, Client, Stratagem};

mod keys;

use keys::{
    activate_loadout, cancel_combo_recording, deactivate_loadout, start_combo_recording,
    ManagedKeyState,
};

// ┌─────────────────────────────────────────────────────────────────────┐
// │ TEMPLATE ENDPOINT — replace with the real Stratbase URL later.      │
// │ Can also be overridden at runtime via the STRATBASE_URL env var.    │
// └─────────────────────────────────────────────────────────────────────┘
const DEFAULT_STRATBASE_URL: &str = "http://localhost:8000";

const CONNECT_TIMEOUT: Duration = Duration::from_secs(3);
const REQUEST_TIMEOUT: Duration = Duration::from_secs(8);

fn stratbase_url() -> String {
    env::var("STRATBASE_URL")
        .map(|url| url.trim_end_matches('/').to_string())
        .unwrap_or_else(|_| DEFAULT_STRATBASE_URL.to_string())
}

/// The shape the frontend expects: arrow directions as lowercase strings.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct StratagemPayload {
    name: String,
    binding: Vec<String>,
}

impl From<Stratagem> for StratagemPayload {
    fn from(stratagem: Stratagem) -> Self {
        let binding = stratagem
            .binding
            .into_iter()
            .map(|b| match b {
                Binding::Up => "up",
                Binding::Down => "down",
                Binding::Left => "left",
                Binding::Right => "right",
            })
            .map(str::to_string)
            .collect();
        Self {
            name: stratagem.name,
            binding,
        }
    }
}

/// Fetch every stratagem from the Stratbase API.
///
/// Errors are returned as plain strings so the frontend can fall back to
/// its localStorage cache (or its locked-out error screen when no cache
/// exists yet).
#[tauri::command]
async fn fetch_stratagems() -> Result<Vec<StratagemPayload>, String> {
    let http = reqwest::Client::builder()
        .connect_timeout(CONNECT_TIMEOUT)
        .timeout(REQUEST_TIMEOUT)
        .build()
        .map_err(|e| format!("failed to build HTTP client: {e}"))?;

    let base_url = stratbase_url();
    let client = Client::with_http_client(base_url.clone(), http)
        .map_err(|e| format!("invalid Stratbase base URL {base_url:?}: {e}"))?;

    let stratagems = client
        .stratagems()
        .await
        .map_err(|e| format!("Stratbase request failed: {e}"))?;

    Ok(stratagems.into_iter().map(StratagemPayload::from).collect())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(ManagedKeyState::default())
        .invoke_handler(tauri::generate_handler![
            fetch_stratagems,
            start_combo_recording,
            cancel_combo_recording,
            activate_loadout,
            deactivate_loadout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
