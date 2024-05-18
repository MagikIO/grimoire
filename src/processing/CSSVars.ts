export function CSSVars<T extends TemplateStringsArray = TemplateStringsArray>(cssString: T): { originalString: T, extractedVariables: Record<string, string> } {
  const variableRegex = /--([\w-]+):\s*([^;]*)/g;
  const result: Record<string, string> = {};

  let match;
  while ((match = variableRegex.exec(cssString[0])) !== null) {
    const [, name, value] = match;
    result[name] = value.trim().toString();
  }

  return { originalString: cssString, extractedVariables: result };
}
