import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { run } from '../src/index';

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
}));
jest.mock('fs');

describe('GitHub Action - File Validation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Deve falhar quando arquivos obrigatórios estão ausentes', async () => {
    (fs.existsSync as jest.Mock).mockImplementation((filePath) => !filePath.includes('Dockerfile'));

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('Os seguintes arquivos necessários estão faltando'));
  });

  test('Deve falhar quando package.json não contém os scripts necessários', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      if (filePath.includes('package.json')) {
        return JSON.stringify({ scripts: { start: 'node server.js' } });
      }
      return '';
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('O arquivo package.json não contém os scripts necessários (test e start)');
  });

  test('Deve gerar um warning se o Dockerfile não contiver HEALTHCHECK', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      if (filePath.includes('package.json')) {
        return JSON.stringify({ scripts: { test: 'jest', start: 'node server.js' } });
      }
      if (filePath.includes('Dockerfile')) {
        return 'FROM node:20';
      }
      return '';
    });

    await run();

    expect(core.warning).toHaveBeenCalledWith('O Dockerfile não contém instrução HEALTHCHECK.  Isso é recomendado para containers em produção.');
  });

  test('Deve passar quando todos os arquivos estão presentes e válidos', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      if (filePath.includes('package.json')) {
        return JSON.stringify({ scripts: { test: 'jest', start: 'node server.js' } });
      }
      if (filePath.includes('Dockerfile')) {
        return 'FROM node:20\nHEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1';
      }
      return '';
    });

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.warning).not.toHaveBeenCalled();
    expect(core.info).toHaveBeenCalledWith('Todos os arquivos necessários foram encontrados e validados com sucesso.');
  });

  test('Deve falhar com erro desconhecido', async () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => {
      throw new Error('Erro desconhecido');
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Action falhou com erro: Erro desconhecido');
  });
});