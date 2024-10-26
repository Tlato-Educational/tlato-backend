import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const packageJsonPath: string = join(process.cwd(), "package.json");
const packageJson: { dependencies: Record<string, string>, devDependencies: Record<string, string> } = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const dependencies: Map<string, string> = new Map(Object.entries(packageJson.dependencies));
const devDependencies: Map<string, string> = new Map(Object.entries(packageJson.devDependencies));

const dependencies_: Record<string, string> = Object.fromEntries(dependencies);
const devDependencies_: Record<string, string> = Object.fromEntries(devDependencies);

const dependenciesKeys = Object.entries(dependencies_).sort();
const devDependenciesKeys = Object.entries(devDependencies_).sort();

const joinedDep: Record<string, string> = Object.fromEntries(dependenciesKeys)
const joinedDevDep: Record<string, string> = Object.fromEntries(devDependenciesKeys)

writeFileSync(packageJsonPath, JSON.stringify({ ...packageJson, dependencies: joinedDep, devDependencies: joinedDevDep }, null, 2));
