/* eslint-disable @typescript-eslint/no-explicit-any */
import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown"

/**
 * Determines if a field value is likely plain text or markdown that needs conversion to rich text
 * @param value - The field value to check
 * @returns true if the value appears to be plain text or markdown
 */
function isPlainTextOrMarkdown(value: any): value is string {
  return typeof value === "string"
}

/**
 * Determines if a field value is already a rich text document
 * @param value - The field value to check
 * @returns true if the value is already a rich text document
 */
function isRichTextDocument(value: any): boolean {
  return value && typeof value === "object" && value.nodeType === "document"
}

/**
 * Converts a field value to rich text format if needed
 * @param value - The field value (could be string or rich text document)
 * @param fieldType - The content type field type
 * @returns The converted rich text document or original value
 */
async function convertToRichText(value: any, fieldType: string): Promise<any> {
  // Only convert if the field type is RichText and the value is plain text/markdown
  if (fieldType === "RichText") {
    if (isRichTextDocument(value)) {
      // Value is already a rich text document, return as-is
      return value
    }

    if (isPlainTextOrMarkdown(value)) {
      // Convert markdown/plain text to rich text document
      try {
        return await richTextFromMarkdown(value)
      } catch (error) {
        // If markdown conversion fails, treat as plain text
        console.warn("Rich text conversion failed, treating as plain text:", error)
        try {
          return await richTextFromMarkdown(value)
        } catch (secondError) {
          console.error("Rich text conversion failed completely:", secondError)
          // Return a minimal valid rich text document with the original text as a paragraph
          return {
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "paragraph",
                data: {},
                content: [
                  {
                    nodeType: "text",
                    value: value,
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          }
        }
      }
    }
  }

  // For non-RichText fields or non-string values, return as-is
  return value
}

/**
 * Processes fields object and converts any RichText fields from markdown/plain text to rich text format
 * @param fields - The fields object from create/update entry request
 * @param contentTypeFields - Array of field definitions from the content type
 * @returns Processed fields object with converted rich text fields
 */
export async function processFieldsForRichText(
  fields: Record<string, any>,
  contentTypeFields: Array<{ id: string; type: string }>,
): Promise<Record<string, any>> {
  const processedFields = { ...fields }

  // Create a mapping of field IDs to their types for quick lookup
  const fieldTypeMap = contentTypeFields.reduce(
    (map, field) => {
      map[field.id] = field.type
      return map
    },
    {} as Record<string, string>,
  )

  // Process each field in the fields object
  for (const fieldId of Object.keys(processedFields)) {
    const fieldType = fieldTypeMap[fieldId]
    const fieldValue = processedFields[fieldId]

    if (fieldType === "RichText" && fieldValue) {
      // Process each locale in the field value
      for (const locale of Object.keys(fieldValue)) {
        processedFields[fieldId][locale] = await convertToRichText(fieldValue[locale], fieldType)
      }
    }
  }

  return processedFields
}
