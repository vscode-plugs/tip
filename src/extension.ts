import * as vscode from 'vscode';
import { getConfig } from './config';
import { TipProvide } from './provideHover';

export function activate(context: vscode.ExtensionContext) {
	getConfig();
	vscode.workspace.onDidChangeConfiguration(() => {
		getConfig();
	});

	const tipProvide = new TipProvide();
	context.subscriptions.push(vscode.languages.registerHoverProvider('*', tipProvide));
	// context.subscriptions.push(vscode.languages.registerHoverProvider('markdown', tipProvide));
}

// this method is called when your extension is deactivated
export function deactivate() {}
