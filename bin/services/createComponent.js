import fs from 'fs'
// TODO: Vai dar erro aqui
import path, {dirname} from 'path'
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const baseDir = __dirname.split("/").slice(0, -1).join("/");
const pathToTemplatesFolder = path.join(baseDir, "templates");

// prettier-ignore
export function createComponent({
  tests,
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath,
}) {
  const path = `${projectFolderAbsolutePath}/${componentFolderRelativePath}/${componentsNames}`
  
  createFolder(componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
  __throwErrorIfFileExistsInsideFolder(path, componentsNames)
  copyFilesFromTemplateToComponentFolder(tests, componentsNames, projectFolderAbsolutePath, componentFolderRelativePath);
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

export function createFolder(
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

export function copyFilesFromTemplateToComponentFolder(
  tests,
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const templateFolder = pathToTemplatesFolder;
  const filesToCopy = fs.readdirSync(templateFolder);

  filesToCopy.forEach((file) => {
    if (file.includes('test') && !tests) return

    const filePath = path.join(pathToTemplatesFolder, file);
    const newFilePath = path.join(
      projectFolderAbsolutePath, componentFolderRelativePath, componentsNames, file);

    fs.copyFileSync(filePath, newFilePath);
  });
}

export function parseFilecontent(
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

export function changeFileName(
  componentsNames,
  projectFolderAbsolutePath,
  componentFolderRelativePath
) {
  const files = fs.readdirSync(
    `${projectFolderAbsolutePath}/${componentFolderRelativePath}/${componentsNames}/`
  );

    path.join(
      projectFolderAbsolutePath,
      componentFolderRelativePath,
      componentsNames
    );


  files.forEach((file) => {
    const newFileName = file
      .replace(/component-template$/g, `${componentsNames}.tsx`)
      .replace(/-template_styled$/g, ".ts")
      .replace(/component-template_test$/g, `${componentsNames}.test.tsx`);

    const newFilePath = path.join(
      projectFolderAbsolutePath,
      componentFolderRelativePath,
      componentsNames,
      newFileName
    );

    const pathFileTemplateInCompFolder = path.join(
      projectFolderAbsolutePath,
      componentFolderRelativePath,
      componentsNames,
      file
    );

    fs.renameSync(pathFileTemplateInCompFolder, newFilePath);
  });
}

