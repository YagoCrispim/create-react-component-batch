function parseCommands(command, configInfos) {
  const aliasPosition = command.indexOf("-a");
  const aliasPath = __getAliasPath(aliasPosition, command, configInfos);
  const componentsNames = __getComponentsNames(aliasPosition, command);

  if (!aliasPath) throw "The alias path was not found.";
  if (!componentsNames.length)
    throw "The component(s) name(s) was not defined.";

  return {
    componentsNames: componentsNames,
    componentFolderRelativePath: aliasPath,
  };
}

function __getAliasPath(aliasPosition, command, configInfos) {
  if (aliasPosition < 0) return configInfos.component_folder;

  const alias = command[aliasPosition + 1];
  return configInfos.alias[alias];
}

function __getComponentsNames(aliasPosition, command) {
  return aliasPosition > 0 ? command.slice(2, aliasPosition) : command.slice(2);
}

module.exports = {
  parseCommands,
};
