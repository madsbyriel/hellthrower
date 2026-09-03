use std::env;
use std::time::Duration;

use serde::Serialize;
use stratbase_client::{Binding, Client, Stratagem};

mod keys;

use keys::{
    activate_loadout, cancel_combo_recording, deactivate_loadout, set_app_focused,
    set_pointer_in_app, start_combo_recording, ManagedKeyState,
};

// ┌─────────────────────────────────────────────────────────────────────┐
// │ Stratbase server location.                                         │
// │                                                                    │
// │ The user can pick a location at runtime (Settings → "Server        │
// │ location", and from the locked-out boot error screen). When no     │
// │ location is configured, the STRATBASE_URL env var wins, falling    │
// │ back to the baked-in default below.                                │
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

/// The Stratbase location the app falls back to when the user has not
/// configured one: `$STRATBASE_URL` if set, otherwise the baked-in
/// default. Exposed to the frontend so it can show/seed the server
/// location editor.
#[tauri::command]
fn default_stratbase_url() -> String {
    stratbase_url()
}

/// Fetch every stratagem from the Stratbase API.
///
/// `base_url` is the location configured in the app; when it is absent or
/// empty, [`default_stratbase_url`] is used instead.
///
/// Errors are returned as plain strings so the frontend can fall back to
/// its localStorage cache (or its locked-out error screen when no cache
/// exists yet).
#[tauri::command]
async fn fetch_stratagems(base_url: Option<String>) -> Result<Vec<StratagemPayload>, String> {
    let http = reqwest::Client::builder()
        .connect_timeout(CONNECT_TIMEOUT)
        .timeout(REQUEST_TIMEOUT)
        .build()
        .map_err(|e| format!("failed to build HTTP client: {e}"))?;

    let base_url = match base_url {
        Some(url) if !url.trim().is_empty() => url.trim().to_string(),
        _ => stratbase_url(),
    };
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
            default_stratbase_url,
            start_combo_recording,
            cancel_combo_recording,
            activate_loadout,
            deactivate_loadout,
            set_app_focused,
            set_pointer_in_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
