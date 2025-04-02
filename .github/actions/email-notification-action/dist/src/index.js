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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core = __importStar(require("@actions/core"));
const nodemailer_1 = __importDefault(require("nodemailer"));
async function run() {
    try {
        const smtpServer = core.getInput('smtp_server', { required: true });
        const smtpPort = core.getInput('smtp_port', { required: true });
        const username = core.getInput('username', { required: true });
        const password = core.getInput('password', { required: true });
        const to = core.getInput('to', { required: true });
        const from = core.getInput('from', { required: true });
        const subject = core.getInput('subject', { required: true });
        const workflowName = core.getInput('workflow_name', { required: true });
        const branch = core.getInput('branch', { required: true });
        const authorName = core.getInput('author_name') || 'N/A';
        const authorEmail = core.getInput('author_email') || 'N/A';
        const runUrl = core.getInput('run_url') || `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
        const errorMessage = core.getInput('error_message') || '';
        const transporter = nodemailer_1.default.createTransport({
            host: smtpServer,
            port: parseInt(smtpPort, 10),
            secure: smtpPort === '465',
            auth: {
                user: username,
                pass: password
            }
        });
        let body = `
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
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text: body
        });
        core.info(`Email sent: ${info.messageId}`);
        core.setOutput('messageId', info.messageId);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(`Action failed with error: ${error.message}`);
        }
        else {
            core.setFailed('Action failed with an unknown error.');
        }
    }
}
if (require.main === module) {
    run();
}
