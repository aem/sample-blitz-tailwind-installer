import {
  Installer,
  addImport,
  paths,
  AddDependencyType,
  NewFileType,
  FileTransformType,
} from "@blitzjs/installer"
import { builders } from "ast-types/gen/builders"
import { ASTNode } from "ast-types/lib/types"
import { NamedTypes } from "ast-types/gen/namedTypes"
import * as path from "path"

enum Steps {
  addDep,
  addPostcssConfig,
  addSampleStyles,
  import,
}

export default new Installer(
  {
    packageName: "tailwind",
    packageDescription:
      "This recipe adds Tailwind CSS and necessary setup code to your application.",
    packageRepoLink: "https://github.com/blitz-js/installers",
    packageOwner: "adam@markon.codes",
  },
  [
    {
      stepId: Steps.addDep,
      stepType: AddDependencyType,
      stepName: "Add tailwind dependencies",
      explanation:
        "First, we'll install a few dependencies.\nThe 'tailwindcss' library powers tailwind itself, with some PostCSS plugins used to optimize the performance of your built site.",
      packages: [
        { name: "tailwindcss", version: "1" },
        { name: "@fullhuman/postcss-purgecss", isDevDep: true },
        { name: "postcss-preset-env", isDevDep: true },
      ],
    },
    {
      stepId: Steps.addPostcssConfig,
      stepType: NewFileType,
      stepName: "Add postcss config",
      explanation: "Configure the postcss processor",
      templatePath: path.join(__dirname, "templates", "postcss-config"),
      targetDirectory: ".",
      templateValues: {},
    },
    {
      stepId: Steps.addSampleStyles,
      stepType: NewFileType,
      stepName: "Add example style files",
      explanation: "We'll add some example styles to get you up and running",
      templatePath: path.join(__dirname, "templates", "styles"),
      targetDirectory: "./app",
      templateValues: {},
    },
    {
      stepId: Steps.import,
      stepType: FileTransformType,
      stepName: "Import styles into app",
      explanation:
        "Finally we need to import your styles into the app. For our sample files, we'll import them into your app root.",
      singleFileSearch: paths.app(),
      transform(ast: ASTNode, b: builders, t: NamedTypes) {
        const stylesImport = b.importDeclaration([], b.literal("app/styles/index.css"))
        if (t.File.check(ast)) {
          return addImport(ast, b, t, stylesImport)
        }
        throw new Error("Not given valid source file")
      },
    },
  ]
)
