import * as core from '@actions/core';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

export async function run(): Promise<void> {
  try {
    const smtpServer: string = core.getInput('smtp_server', { required: true });
    const smtpPort: string = core.getInput('smtp_port', { required: true });
    const username: string = core.getInput('username', { required: true });
    const password: string = core.getInput('password', { required: true });
    const to: string = core.getInput('to', { required: true });
    const from: string = core.getInput('from', { required: true });
    const subject: string = core.getInput('subject', { required: true });
    const workflowName: string = core.getInput('workflow_name', { required: true });
    const branch: string = core.getInput('branch', { required: true });
    const authorName: string = core.getInput('author_name') || 'N/A';
    const authorEmail: string = core.getInput('author_email') || 'N/A';
    const runUrl: string = core.getInput('run_url') || `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
    const errorMessage: string = core.getInput('error_message') || '';

    const transporter: Transporter = nodemailer.createTransport({
      host: smtpServer,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === '465', 
      auth: {
        user: username,
        pass: password
      }
    });

    let body: string = `
O pipeline de CI/CD falhou. Por favor, verifique os logs no GitHub Actions.
📌 Workflow: ${workflowName}
📌 Repositório: ${process.env.GITHUB_REPOSITORY}
📌 Branch: ${branch}
📌 Autor: ${authorName}`;

    if (authorEmail && authorEmail !== 'N/A') {
      body += ` - ${authorEmail}`;
    }

    body += `\n🔗 Logs: ${runUrl}`;
    body += `\n⏰ Timestamp: ${new Date().toISOString()}`;

    if (errorMessage) {
      body += `\n\n❌ Erro: ${errorMessage}`;
    }

    core.info('Sending email notification...');
    const info: SentMessageInfo = await transporter.sendMail({
      from,
      to,
      subject,
      text: body
    });

    core.info(`Email sent: ${info.messageId}`);
    core.setOutput('messageId', info.messageId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

if (require.main === module) {
  run();
}