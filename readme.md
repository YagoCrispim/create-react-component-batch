# Create React Component

### This is a CLI tool to create one or many complete React components with one single command.

## Component folder content

```
  |- Header/
      |- Header.tsx
      |- styles.ts        (using styled-components)
      |- Header.test.tsx  (using @testing-library/react)
```

## Configuration

- Inside the project root folder must be created a file called crc_config.json.

  - Example:

    ```
    todo_list
      |- src/
          |- components/
          |- App.js
          |- App.css
      |- crc_config.json
      |- package.json
    ```

- This configuration file must include the following informations:

  - **component_folder**: Path to components folder.

  ```json
  {
    "component_folder": "src/Components"
  }
  ```

## Command

- Creation of a new component:

  ```bash
    npx crc Header # This command creates the component called Header inside the component_folder defined in crc_config.json

    npx crc Header Body Footer Sidebar Modal # This command creates components in batch inside the component_folder.
  ```

## Alias(Optional)

- Alias are used to shorten the path to a component folder.

- The alias must be defined in the crc_config.json file inside the "alias" property.

- Example using atomic design:

  ```json

  -- crc_config.json --

  {
    "component_folder": "src/Components",
    "alias": {
      "at": "src/Components/atoms",
      "ml": "src/Components/molecules",
      "or": "src/Components/organisms",
      "pages": "src/Pages"
    }
  }
  ```

- **To use the alias the flag "-a" must be used.**

- Example of a command using alias. Creation of a new atom:
  ```bash
    npx crc InputText -a at # Creates the component called InputText inside the src/Components/atoms folder
  ```

## Components dependencies

- All components created with crc use the following dependencies:

  - **typescript**

  - **@testing-library/react**: The library used to create components.

  - **styled-components**: The library used to create styles.
