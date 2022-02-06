#!/usr/bin/env node
// =-=-=-=-= Node modules =-=-=-=-=
import fs from 'fs';

// =-=-=-=-= App modules =-=-=-=-=
import { parseCommands } from './services/parseCommands.js'
import { createComponent } from './services/createComponent.js'
import { errors } from './error_messages.js'

// =-=-=-=-= App config =-=-=-=-=
const basePath = process.argv[1].split("/").slice(0, -3).join("/");

try {
  if (!fs.readdirSync(basePath).includes("crc_config.json"))
    throw errors.file.index.config_file_not_found;

  const config = JSON.parse(
    fs.readFileSync(`${basePath}/crc_config.json`, "utf8")
  );
  const componentInfos = parseCommands(process.argv, config);

  componentInfos.componentsNames.forEach((component) => {
    if (component.startsWith("-")) return;

    const props = {
      tests: componentInfos.tests,
      componentsNames: component,
      projectFolderAbsolutePath: basePath,
      componentFolderRelativePath: componentInfos.componentFolderRelativePath,
    };

    createComponent(props);
  });
} catch (error) {
  console.log(`\nERROR: ${error} \n`);
}
