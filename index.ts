import { Installer, addImport, paths } from "@blitzjs/installer"
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
    packageName: "tailwindcss",
    packageDescription: "This installer adds tailwindcss and necessary setup code to your application.",
    packageRepoLink: "https://github.com/blitz-js/installers",
    packageOwner: "adam@markon.codes",
  },
  [
    {
      stepId: Steps.addDep,
      stepName: "Add tailwind dependencies",
      explanation: "Install tailwind and related postcss dependencies",
      packages: [
        { name: "tailwindcss", version: "1", isDevDep: false },
        { name: "@fullhuman/postcss-purgecss" },
        { name: "postcss-preset-env" },
      ],
    },
    {
      stepId: Steps.addPostcssConfig,
      stepName: "Add postcss config",
      explanation: "Configure the postcss processor",
      templatePath: path.join(__dirname, "templates", "postcss-config"),
      targetDirectory: ".",
      templateValues: {},
    },
    {
      stepId: Steps.addSampleStyles,
      stepName: "Add example style files",
      explanation: "We'll add some example styles to get you up and running",
      templatePath: path.join(__dirname, "templates", "styles"),
      targetDirectory: "./app",
      templateValues: {},
    },
    {
      stepId: Steps.import,
      stepName: "Import styles into app",
      explanation:
        "Finally we need to import your styles into the app. For our sample files, we'll import them into your app root.",
      singleFileSearch: paths.document(),
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
