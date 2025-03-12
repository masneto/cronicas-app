"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const index_1 = require("../src/index");
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
    test('Deve falhar quando arquivos obrigatórios estão ausentes', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.existsSync.mockImplementation((filePath) => !filePath.includes('Dockerfile'));
        yield (0, index_1.run)();
        expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('Os seguintes arquivos necessários estão faltando'));
    }));
    test('Deve falhar quando package.json não contém os scripts necessários', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockImplementation((filePath) => {
            if (filePath.includes('package.json')) {
                return JSON.stringify({ scripts: { start: 'node server.js' } });
            }
            return '';
        });
        yield (0, index_1.run)();
        expect(core.setFailed).toHaveBeenCalledWith('O arquivo package.json não contém os scripts necessários (test e start)');
    }));
    test('Deve gerar um warning se o Dockerfile não contiver HEALTHCHECK', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockImplementation((filePath) => {
            if (filePath.includes('package.json')) {
                return JSON.stringify({ scripts: { test: 'jest', start: 'node server.js' } });
            }
            if (filePath.includes('Dockerfile')) {
                return 'FROM node:20';
            }
            return '';
        });
        yield (0, index_1.run)();
        expect(core.warning).toHaveBeenCalledWith('O Dockerfile não contém instrução HEALTHCHECK. Isso é recomendado para containers em produção.');
    }));
    test('Deve passar quando todos os arquivos estão presentes e válidos', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockImplementation((filePath) => {
            if (filePath.includes('package.json')) {
                return JSON.stringify({ scripts: { test: 'jest', start: 'node server.js' } });
            }
            if (filePath.includes('Dockerfile')) {
                return 'FROM node:20\nHEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1';
            }
            return '';
        });
        yield (0, index_1.run)();
        expect(core.setFailed).not.toHaveBeenCalled();
        expect(core.warning).not.toHaveBeenCalled();
        expect(core.info).toHaveBeenCalledWith('Todos os arquivos necessários foram encontrados e validados com sucesso.');
    }));
    test('Deve falhar com erro desconhecido', () => __awaiter(void 0, void 0, void 0, function* () {
        fs.existsSync.mockImplementation(() => {
            throw new Error('Erro desconhecido');
        });
        yield (0, index_1.run)();
        expect(core.setFailed).toHaveBeenCalledWith('Action falhou com erro: Erro desconhecido');
    }));
});
