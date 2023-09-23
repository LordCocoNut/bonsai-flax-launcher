# WARNING

Very early stage. This project has been created as my own tool and im releasing to the public. I recommend having your projects backuped if there is any issue with the launcher that could possibly damage your files. The tool doesnt manipulate project files explicitly, but im not gonna take any responsiblity for damage done by using this tool.

# Flax Game Engine Launcher (flax-launcher)

Simple unofficial Flax engine launcher that allows you to manage flax and its projects on linux without entering the terminal or manually downloading the engine.

## Instlalation

Download the build, unzip and run FlaxEngineLauncher binary. To install an engine, go to the engine page, click download and wait for the process to finish. After installation is complete, you can create project by going to projects page and clicking "create project" button. Keep in mind, that the name is being parsed to lowercase and whitespaces are replaced with underscores. You can also copy your project to the **projects** folder and they should apear in the list on relaunch.

## How it works

- The launcher creates ~/.flax-engine folder that is used as a center for the engine installation and your projects
- Triggering download will download the zip file from the official webpage and extracts it into **editor** subfolder
- Created projects are located under **projects** folder

## Known bugs

- exiting launcher during engine download doesnt require confirmation
- project list is not refreshed when new project is created

## Keep in mind
- creating project may take some time, please be patient after submitting the project creation
