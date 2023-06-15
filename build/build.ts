import fs = require("fs");
import path = require("path");
import yaml = require("js-yaml");
import plist = require("plist");

enum Extension {
  TmLanguage = "tmLanguage",
  TmTheme = "tmTheme",
  YamlTmLanguage = "YAML-tmLanguage",
  YamlTmTheme = "YAML-tmTheme",
}

function file(extension: Extension) {
  return path.join(__dirname, "..", `Luau.${extension}`);
}

function writePlistFile(grammar: TmGrammar | TmTheme, fileName: string) {
  const text = plist.build(grammar);
  fs.writeFileSync(fileName, text);
}

function readYaml(fileName: string) {
  const text = fs.readFileSync(fileName, "utf8");
  return yaml.load(text);
}

function transformGrammarRule(
  rule: any,
  propertyNames: string[],
  transformProperty: (ruleProperty: string) => string
) {
  for (const propertyName of propertyNames) {
    const value = rule[propertyName];
    if (typeof value === "string") {
      rule[propertyName] = transformProperty(value);
    }
  }

  for (var propertyName in rule) {
    const value = rule[propertyName];
    if (typeof value === "object") {
      transformGrammarRule(value, propertyNames, transformProperty);
    }
  }
}

function transformGrammarRepository(
  grammar: TmGrammar,
  propertyNames: string[],
  transformProperty: (ruleProperty: string) => string
) {
  const repository = grammar.repository;
  for (let key in repository) {
    transformGrammarRule(repository[key], propertyNames, transformProperty);
  }
}

function getLuauGrammar(
  getVariables: (luauGrammarVariables: MapLike<string>) => MapLike<string>
) {
  const luauGrammarBeforeTransformation = readYaml(
    file(Extension.YamlTmLanguage)
  ) as TmGrammar;
  return updateGrammarVariables(
    luauGrammarBeforeTransformation,
    getVariables(luauGrammarBeforeTransformation.variables as MapLike<string>)
  );
}

function replacePatternVariables(
  pattern: string,
  variableReplacers: VariableReplacer[]
) {
  let result = pattern;
  for (const [variableName, value] of variableReplacers) {
    result = result.replace(variableName, value);
  }
  return result;
}

type VariableReplacer = [RegExp, string];
function updateGrammarVariables(
  grammar: TmGrammar,
  variables: MapLike<string>
) {
  delete grammar.variables;
  const variableReplacers: VariableReplacer[] = [];
  for (const variableName in variables) {
    // Replace the pattern with earlier variables
    const pattern = replacePatternVariables(
      variables[variableName],
      variableReplacers
    );
    variableReplacers.push([new RegExp(`{{${variableName}}}`, "gim"), pattern]);
  }
  transformGrammarRepository(grammar, ["begin", "end", "match"], (pattern) =>
    replacePatternVariables(pattern, variableReplacers)
  );
  return grammar;
}

function buildGrammar() {
  const luauGrammar = getLuauGrammar((grammarVariables) => grammarVariables);

  // Write Luau.tmLanguage
  writePlistFile(luauGrammar, file(Extension.TmLanguage));
}

function buildTheme() {
  const luauTheme = readYaml(file(Extension.YamlTmTheme)) as TmTheme;

  // Write Luau.tmTheme
  writePlistFile(luauTheme, file(Extension.TmTheme));
}

buildGrammar();
buildTheme();
