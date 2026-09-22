import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { expect, test } from 'vitest';
import { generateOpenapi } from '../../src/openapi/generateOpenapi';

test('OpenAPI preserves template components except schemas and replaces paths', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'frourio-openapi-'));
  const template = path.join(dir, 'template.json');
  const output = path.join(dir, 'openapi.json');
  const components = {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } },
    responses: { Unauthorized: { description: 'Authentication required' } },
    parameters: { Limit: { name: 'limit', in: 'query', schema: { type: 'integer' } } },
    headers: { RequestId: { schema: { type: 'string' } } },
    requestBodies: { Message: { content: { 'text/plain': { schema: { type: 'string' } } } } },
    examples: { Message: { value: 'hello' } },
    links: { Next: { operationId: 'next' } },
    callbacks: {},
    pathItems: { Health: { get: { responses: { 200: { description: 'OK' } } } } },
    'x-custom': { enabled: true },
  };
  const security = [{ bearerAuth: [] }];

  try {
    writeFileSync(
      template,
      JSON.stringify({
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
        security,
        components: { ...components, schemas: { TemplateOnly: { type: 'string' } } },
        paths: { '/template-only': { get: { responses: { 200: { description: 'OK' } } } } },
      }),
    );

    generateOpenapi({
      appDir: path.resolve('projects/basic/app'),
      basePath: undefined,
      root: undefined,
      template,
      output,
    });

    const doc = JSON.parse(readFileSync(output, 'utf8'));
    const baseline = JSON.parse(readFileSync('projects/basic/public/openapi.json', 'utf8'));
    const { schemas, ...preservedComponents } = doc.components;

    expect(preservedComponents).toEqual(components);
    expect(schemas).toEqual(baseline.components.schemas);
    expect(schemas).not.toHaveProperty('TemplateOnly');
    expect(doc.paths).toEqual(baseline.paths);
    expect(doc.security).toEqual(security);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}, 100000);
