import {
  DMMF,
  generatorHandler,
  GeneratorOptions,
} from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';

const { version } = require('../package.json');

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const outputLocation = path.join(
      options.generator.output?.value!,
      'database-types.ts',
    );

    const topImports = `import {
  Generated,
  ColumnType,
} from 'kysely'`;

    type EnumMap = Map<string, DMMF.EnumValue[]>;
    const enumMap: EnumMap = new Map();
    let enumsStringBuilder = '';
    for (const dataModelEnum of options.dmmf.datamodel.enums) {
      enumsStringBuilder += `export type ${
        dataModelEnum.name
      } = ${dataModelEnum.values.map(({ name }) => `"${name}"`).join(' | ')};`;
    }

    function prismaTypeToTypeScriptType(
      field: DMMF.Field,
      enumMap: EnumMap,
    ): string {
      // BigInt, Boolean, Bytes, DateTime, Decimal, Float, Int, JSON, String, $ModelName
      let typeBuilder = '';
      if (field.kind === 'enum') {
        if (!enumMap.has(field.type)) {
          throw new Error(`Enum ${field.type} not found`);
        }
        typeBuilder += field.type;
      }
      if (field.kind === 'object') {
        throw new Error('Object type not supported');
      }
      if (field.kind !== 'enum') {
        switch (field.type) {
          case 'BigInt':
            typeBuilder = 'number';
            break;
          case 'Boolean':
            typeBuilder = 'boolean';
            break;
          case 'Bytes':
            typeBuilder = 'string';
            break;
          case 'DateTime':
            typeBuilder = 'Date';
            break;
          case 'Decimal':
            typeBuilder = 'number';
            break;
          case 'Float':
            typeBuilder = 'number';
            break;
          case 'Int':
            typeBuilder = 'number';
            break;
          case 'JSON':
            typeBuilder = 'any'; // TODO: better type
            break;
          case 'String':
            typeBuilder = 'string';
            break;
          default:
            throw new Error(`Unknown type ${field.type}`);
        }
      }

      if (field.isList) {
        typeBuilder = `${typeBuilder}[]`;
      }

      if (field.isGenerated) {
        typeBuilder = `Generated<${typeBuilder}>`;
      } else if (!field.isRequired) {
        typeBuilder = `${typeBuilder} | null`;
      }

      if (field.type === 'DateTime') {
        if (field.hasDefaultValue) {
          typeBuilder = `ColumnType<${typeBuilder} | null, ${typeBuilder} | string, ${typeBuilder} | string>`;
        } else {
          typeBuilder = `ColumnType<${typeBuilder}, ${typeBuilder} | string, ${typeBuilder} | string>`;
        }
      }
      return typeBuilder;
    }

    const modelStrings = [];

    for (const model of options.dmmf.datamodel.models) {
      const { name, fields } = model;
      const fieldStrings: Array<string> = [];
      for (const field of fields) {
        const { kind } = field;
        if (kind === 'object' || kind === 'unsupported') {
          continue;
        }
        const typeScriptType = prismaTypeToTypeScriptType(field, enumMap);
        fieldStrings.push(`  ${field.name}: ${typeScriptType}`);
      }
      modelStrings.push(
        `export type ${name} = {\n${fieldStrings.join(';\n')}\n}`,
      );
    }

    let databaseStringBuilder = 'export type Database = {\n';
    for (const model of options.dmmf.datamodel.models) {
      databaseStringBuilder += `  ${model.name}: ${model.name};\n`;
    }
    databaseStringBuilder += '}';
    const modelString = [
      topImports,
      enumsStringBuilder,
      modelStrings.join('\n\n'),
      databaseStringBuilder,
    ].join('\n\n');

    await writeFileSafely(outputLocation, modelString);
  },
});
