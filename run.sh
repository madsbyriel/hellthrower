#!/usr/bin/env bash

set -e

WEBKIT_DISABLE_DMABUF_RENDERER=1 bun run tauri dev
