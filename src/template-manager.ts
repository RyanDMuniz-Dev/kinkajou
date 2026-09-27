import { fileURLToPath } from "node:url";

export type TemplateName = "none";

export interface TemplateDefinition {
    readonly name: TemplateName;
    readonly description: string;
    readonly directory: string;
}

const TEMPLATE_REGISTRY: Record<TemplateName, TemplateDefinition> = {
    none: {
        name: "none",
        description: "Pure HTML, CSS and JavaScript",
        directory: fileURLToPath(
            new URL("../templates/none", import.meta.url)
        )
    }
}

export function isTemplateName(value: string): value is TemplateName {
    return Object.hasOwn(TEMPLATE_REGISTRY, value);
}

export function getTemplate(name: string): TemplateDefinition {
    if (!isTemplateName(name)) {
        const availableTemplates = Object.keys(TEMPLATE_REGISTRY)
            .map((template) => `  ${template}`)
            .join("\n");

        throw new Error(
            `Template "${name}" not found.\n\nAvailable templates:\n${availableTemplates}`
        )
    }

    return TEMPLATE_REGISTRY[name];
}