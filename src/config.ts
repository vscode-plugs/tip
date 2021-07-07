import { workspace, WorkspaceConfiguration } from 'vscode';

export let CONFIG: WorkspaceConfiguration;

export const getConfig = () => {
  CONFIG = workspace.getConfiguration('tip');
};