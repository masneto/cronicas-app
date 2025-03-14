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
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Lista dos arquivos que precisam estar no repo
            const requiredFiles = [
                'package.json',
                'Dockerfile',
                'src/app.js',
                'src/server.js',
                'src/public/index.html',
                'src/public/style.css',
                'test/app.test.js'
            ];
            // Processo para validar cada arquivo.
            const missingFiles = [];
            for (const file of requiredFiles) {
                const filePath = path.join(process.env.GITHUB_WORKSPACE || '', file);
                if (!fs.existsSync(filePath)) {
                    missingFiles.push(file);
                }
            }
            // Em caso de arquivo faltante, falha a action 
            if (missingFiles.length > 0) {
                const errorMessage = `Os seguintes arquivos necessários estão faltando: ${missingFiles.join(', ')}`;
                core.setFailed(errorMessage);
                return;
            }
            // Verificando o package.json da aplicação
            const packageJsonPath = path.join(process.env.GITHUB_WORKSPACE || '', 'package.json');
            const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (!packageJsonContent.scripts ||
                !packageJsonContent.scripts.test ||
                !packageJsonContent.scripts.start) {
                core.setFailed('O arquivo package.json não contém os scripts necessários (test e start)');
                return;
            }
            // Verificação do arquivo Dockerfile
            const dockerfilePath = path.join(process.env.GITHUB_WORKSPACE || '', 'Dockerfile');
            const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
            if (!dockerfileContent.includes('HEALTHCHECK')) {
                core.warning('O Dockerfile não contém instrução HEALTHCHECK. Isso é recomendado para containers em produção.');
            }
            core.info('Todos os arquivos necessários foram encontrados e validados com sucesso.');
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(`Action falhou com erro: ${error.message}`);
            }
            else {
                core.setFailed(`Action falhou com um erro desconhecido.`);
            }
        }
    });
}
exports.run = run;
run();
