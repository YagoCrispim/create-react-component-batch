#!/usr/bin/env node

const fs = require("fs");
const { parseCommands } = require("./services/parseCommands");
const { createComponent } = require("./services/createComponent");

try {
  const basePath = process.argv[1].split("/").slice(0, -3).join("/");
  const config = require(`${basePath}/crc_config.json`);
  const componentInfos = parseCommands(process.argv, config);

  !fs.readdirSync(basePath).includes("crc_config.json") &&
    (console.error(
      "ERROR: The config file(crc_config.json) was not detected in the root directory."
    ),
    process.exit(1));

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
