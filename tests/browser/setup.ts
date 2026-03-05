import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';
import { patchFilePrototype } from '../../projects/basic/tests/setupMswHandlers';

beforeAll(patchFilePrototype);

afterEach(cleanup);
