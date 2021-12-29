const fs = require("fs");
const path = require("path");

const baseDir = __dirname.split("/").slice(0, -1).join("/");
const pathToTemplatesFolder = path.join(baseDir, "templates");

// prettier-ignore
function createComponent({
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath,
}) {
  const path = `${projectFolderAbsolutePath}/${componentFolderRelativePath}/${componentsNames}`
  
  createFolder(componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
  __throwErrorIfFileExistsInsideFolder(path, componentsNames)
  copyFilesFromTemplateToComponentFolder(componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
  parseFilecontent(componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
  changeFileName(componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
}

function __throwErrorIfFileExistsInsideFolder(path, fileName) {
  const filesInside = fs.readdirSync(path);

  filesInside.forEach((file) => {
    const componentsNames = file.split(".")[0];

    if (componentsNames === fileName) throw "Component(s) already exists.";
  });
}

function createFolder(
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const componentPath = path.join(
    projectFolderAbsolutePath, componentFolderRelativePath, componentsNames);

  try {
    fs.mkdirSync(componentPath, { recursive: true });
  } catch (err) {
    throw err.message;
  }
}

function copyFilesFromTemplateToComponentFolder(
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const templateFolder = pathToTemplatesFolder;
  const filesToCopy = fs.readdirSync(templateFolder);

  filesToCopy.forEach((file) => {
    const filePath = path.join(pathToTemplatesFolder, file);
    const newFilePath = path.join(
      projectFolderAbsolutePath, componentFolderRelativePath, componentsNames, file);

    fs.copyFileSync(filePath, newFilePath);
  });
}

function parseFilecontent(
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const componentPath = path.join(projectFolderAbsolutePath, componentFolderRelativePath, componentsNames);
  const files = fs.readdirSync(componentPath);

  files.forEach((file) => {
    const filePath = path.join(componentPath, file);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const newFileContent = fileContent
      .replace(/{{component_name}}/g, componentsNames)
      .replace(/"{{component_name}}"/g, `"${componentsNames}"`);

    fs.writeFileSync(filePath, newFileContent);
  });
}

function changeFileName(
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const files = fs.readdirSync(pathToTemplatesFolder);

  files.forEach((file) => {
    const newFileName = file
      .replace(/component-template$/g, `${componentsNames}.tsx`)
      .replace(/-template_styled$/g, ".ts")
      .replace(/component-template_test$/g, `${componentsNames}.test.tsx`);

    const newFilePath = path.join(
      projectFolderAbsolutePath, componentFolderRelativePath, componentsNames, newFileName);

    const pathFileTemplateInCompFolder = path.join(
      projectFolderAbsolutePath, componentFolderRelativePath, componentsNames, file);

    fs.renameSync(pathFileTemplateInCompFolder, newFilePath);
  });
}

module.exports = {
  createComponent,
  createFolder,
  copyFilesFromTemplateToComponentFolder,
  parseFilecontent,
  changeFileName,
};
