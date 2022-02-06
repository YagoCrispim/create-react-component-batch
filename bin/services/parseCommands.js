import { errors } from '../error_messages.js';

// TODO: Provável que vai quebrar
const alias_not_informed = errors.file.parser.alias_not_informed
const name_not_defined = errors.file.parser.name_not_defined

export function parseCommands(command, configInfos) {
  const aliasPosition = command.indexOf("-a");
  const aliasPath = __getAliasPath(aliasPosition, command, configInfos);
  const componentsNames = __getComponentsNames(aliasPosition, command);

  const generateTests =
    typeof configInfos.tests !== "undefined" ? configInfos.tests : true;

  if (!aliasPath) throw alias_not_informed;
  if (!componentsNames.length) throw name_not_defined;

  return {
    tests: generateTests,
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
  const namesArr = aliasPosition > 0
    ? command.slice(2, aliasPosition)
    : command.slice(2);
    
  return namesArr.map((name) => __capitalizeFirstLetter(name));
}

function __capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

