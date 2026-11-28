# <img align="top" src="https://static.wikia.nocookie.net/core-keeper/images/b/b8/Recall_Idol.png/revision/latest?cb=20220313041921" height="48"> Sync Keeper | Installer

World synchronisation solution for Core Keeper

This repository contains open-source code of the Sync Keeper installer.
Sync Keeper supports Windows and Linux.

# Usage

After using the code of this repository, you will have successfully installed Sync Keeper.

1. Go to [GitHub > gXLg > Sync Keeper Installer > Releases](https://github.com/gXLg/sync-keeper-installer/releases/latest)
2. Download the matching `sync-keeper-installer-*` binary:
   * `*-linux` for Linux
   * `*-win.exe` for Windows
   * Currently only supports `x64` architecture
3. Execute it by double-clicking, a terminal window should open titled `"Sync Keeper | Installer"`
4. Carefully read each prompt, type your answer and press <kbd>Enter</kbd>

## Host Address

> [!NOTE]
> When being asked for the **host adress**, type the adress of a hosted [`Sync Keeper Server`](https://github.com/gXLg/sync-keeper-server) instance

> [!TIP]
> Note, that inserting (pasting) text into console might not always work with <kbd>Ctrl</kbd> + <kbd>V</kbd>,
> since the terminal can have a custom handler for this key combination.
>
> On Linux, try <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to paste, or right-clicking the terminal to open the context menu, then select `Paste`.
>
> On Windows, try right-clicking the terminal to paste text directly.

## Game Folder

> [!NOTE]
> When being asked for the **game folder**, type the path of Core Keeper's save folder, usually it's of one of the following formats, depending on your platform:
> * Windows: `%USERPROFILE%\AppData\LocalLow\Pugstorm\Core Keeper\Steam\<user-id>`
>   * e.g. `C:\Users\GamerXL\AppData\LocalLow\Pugstorm\Core Keeper\Steam\3133769420`
> * Linux: `$HOME/.config/unity3d/Pugstorm/Core Keeper/Steam/<user-id>`
>   * e.g. `/home/gxlg/.config/unity3d/Pugstorm/Core Keeper/Steam/3133769420`

## Username

> [!NOTE]
> When being asked for the **username**, type your unique identifier which will be tied to the device.
> When playing on a world, your username will be shown to all your world friends who query the world metadata.

## Steam Hook

> [!IMPORTANT]
> The installer cannot modify your steam settings, so you will have to add the launch hook manually.
> Simply follow the instructions in the terminal.
