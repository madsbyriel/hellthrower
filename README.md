# Hellthrower

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## Project Setup

Needs to have groups `input` and `uinput` created. The group `input` should already exist. Check by running `groups` in a terminal.

***Adding `uinput` group:***
```bash
sudo groupadd uinput
```

***Add your user to the input and the uinput group:***
```bash
sudo usermod -aG input $USER
sudo usermod -aG uinput $USER
```

***Make sure the uinput device file has the right permissions:***
Add a udev rule (in either `/etc/udev/rules.d` or `/lib/udev/rules.d`) with the following content:
```text
KERNEL=="uinput", MODE="0660", GROUP="uinput", OPTIONS+="static_node=uinput"
```
File names typically look like this: `37-uinput.rules`

***Make sure the uinput drivers are loaded:***
You may need to run this command whenever you start kanata for the first time.
```bash
sudo modprobe uinput
```
