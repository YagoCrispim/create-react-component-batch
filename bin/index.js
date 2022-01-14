#!/usr/bin/env node
const fs = require("fs");

const { parseCommands } = require("./services/parseCommands");
const { createComponent } = require("./services/createComponent");
const { config_file_not_found } = require("./error_messages.json").file.index;
const basePath = process.argv[1].split("/").slice(0, -3).join("/");

try {
  if (!fs.readdirSync(basePath).includes("crc_config.json"))
    throw config_file_not_found;

  const config = require(`${basePath}/crc_config.json`);
  const componentInfos = parseCommands(process.argv, config);

  componentInfos.componentsNames.forEach((component) => {
    if (component.startsWith("-")) return;

    const props = {
      componentsNames: component,
      projectFolderAbsolutePath: basePath,
      componentFolderRelativePath: componentInfos.componentFolderRelativePath,
    };

    createComponent(props);
  });
} catch (error) {
  console.log(`\nERROR: ${error} \n`);
}
