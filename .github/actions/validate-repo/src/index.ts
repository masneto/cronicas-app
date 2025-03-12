import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

export async function run(): Promise<void> {
  try {
    // Lista dos arquivos que precisam estar no repo
    const requiredFiles = [
      'package.json',
      'Dockerfile',
      'src/app.js',
      'src/server.js',
      'src/public/index.html',
      'src/public/style.css',
      'test/app.test.js',
      '.aws/task-definition.json'
    ];
    
    // Processo para validar cada arquivo
    const missingFiles: string[] = [];
    
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
    
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action falhou com erro: ${error.message}`);
    } else {
      core.setFailed(`Action falhou com um erro desconhecido.`);
    }
  }
}

run();