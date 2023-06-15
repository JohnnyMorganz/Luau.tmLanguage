import * as vt from "vscode-textmate/release/main";
import path = require("path");
import fs = require("fs");
import oniguruma = require("vscode-oniguruma");

const grammarFileName = "Luau.tmLanguage";
const grammarPath = path.join(__dirname, "..", grammarFileName);

const wasmBin = fs.readFileSync(
  path.join(__dirname, "../node_modules/vscode-oniguruma/release/onig.wasm")
).buffer;
const vscodeOnigurumaLib: Promise<vt.IOnigLib> = oniguruma
  .loadWASM(wasmBin)
  .then(() => {
    return {
      createOnigScanner(patterns) {
        return new oniguruma.OnigScanner(patterns);
      },
      createOnigString(s) {
        return new oniguruma.OnigString(s);
      },
    };
  });

const registery = new vt.Registry({
  onigLib: vscodeOnigurumaLib,
  loadGrammar: function () {
    const path = grammarPath;
    if (path) {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (error, content) => {
          if (error) {
            reject(error);
          } else {
            const rawGrammar = vt.parseRawGrammar(content.toString(), path);
            resolve(rawGrammar);
          }
        });
      });
    }

    return Promise.resolve(null);
  },
});

const luauGrammar = registery.loadGrammar("source.luau");

function getInputFile(oriLines: string[]): string {
  return (
    "original file\n-----------------------------------\n" +
    oriLines.join("\n") +
    "\n-----------------------------------\n\n"
  );
}

interface Grammar {
  grammar: vt.IGrammar;
  ruleStack: Parameters<vt.IGrammar["tokenizeLine"]>[1];
}
function initGrammar(grammar: vt.IGrammar): Grammar {
  return { grammar, ruleStack: null };
}

function tokenizeLine(grammar: Grammar, line: string) {
  const lineTokens = grammar.grammar.tokenizeLine(line, grammar.ruleStack);
  grammar.ruleStack = lineTokens.ruleStack;
  return lineTokens.tokens;
}

function hasDiff<T>(
  first: T[],
  second: T[],
  hasDiffT: (first: T, second: T) => boolean
): boolean {
  if (first.length != second.length) {
    return true;
  }

  for (let i = 0; i < first.length; i++) {
    if (hasDiffT(first[i], second[i])) {
      return true;
    }
  }

  return false;
}

function makeTsScope(scope: string) {
  return scope.replace(/\.tsx/g, ".ts");
}

function hasDiffScope(first: string, second: string) {
  return makeTsScope(first) !== makeTsScope(second);
}

function getBaseline(grammar: Grammar, outputLines: string[]) {
  return outputLines.join("\n");
}

export function generateScopes(text: string, parsedFileName: path.ParsedPath) {
  const mainGrammar = luauGrammar;
  const oriLines = text.split(/\r\n|\r|\n/);

  return mainGrammar.then((mainIGrammar) =>
    generateScopesWorker(initGrammar(mainIGrammar!), oriLines)
  );
}

function validateTokenScopeExtension(grammar: Grammar, token: vt.IToken) {
  return !token.scopes.some((scope) => !isValidScopeExtension(grammar, scope));
}

function isValidScopeExtension(grammar: Grammar, scope: string) {
  return scope.endsWith(".luau");
}

function generateScopesWorker(
  mainGrammar: Grammar,
  oriLines: string[]
): string {
  let cleanLines: string[] = [];
  let baselineLines: string[] = [];
  let otherBaselines: string[] = [];
  for (const i in oriLines) {
    let line = oriLines[i];

    const mainLineTokens = tokenizeLine(mainGrammar, line);

    cleanLines.push(line);
    baselineLines.push(">" + line);
    otherBaselines.push(">" + line);

    for (let token of mainLineTokens) {
      writeTokenLine(mainGrammar, token, baselineLines);
    }
  }

  return getInputFile(cleanLines) + getBaseline(mainGrammar, baselineLines);
}

function writeTokenLine(
  grammar: Grammar,
  token: vt.IToken,
  outputLines: string[]
) {
  let startingSpaces = " ";
  for (let j = 0; j < token.startIndex; j++) {
    startingSpaces += " ";
  }

  let locatingString = "";
  for (let j = token.startIndex; j < token.endIndex; j++) {
    locatingString += "^";
  }
  outputLines.push(startingSpaces + locatingString);
  outputLines.push(
    `${startingSpaces}${token.scopes.join(" ")}${
      validateTokenScopeExtension(grammar, token)
        ? ""
        : " INCORRECT_SCOPE_EXTENSION"
    }`
  );
}
