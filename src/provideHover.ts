import path = require("path");
import * as fs from 'fs';
import * as mime from 'mime';
import { Hover, HoverProvider, MarkdownString, Position, TextDocument, workspace } from "vscode";
import { CONFIG } from './config';

export class TipProvide implements HoverProvider {
  private urlRegExp = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
  public provideHover(document: TextDocument, position: Position): Thenable<Hover> {
    return new Promise((resolve, reject) => {
      const urls = this.getUrls(document, position);
      if (urls) {
        const markdownString = this.getMarkdownString(urls);
        const item = new Hover(markdownString);
        resolve(item);
      } else {
        reject('');
      }
    });
  }

  private getUrls(document: TextDocument, position: Position) {
    const line = document.lineAt(position).text;
    const prefix = CONFIG.prefix || 'tip';
    const regexp = new RegExp(`${prefix}::\\((.*?)\\)`);
    const res = line.match(regexp);

    return res?.[1];
  }

  private getMarkdownString(urls: string) {
    const urlArr = urls.split(',');
    let root = workspace.rootPath || '';
    
    const markdownText = urlArr.reduce((str, url) => {
      if (!this.urlRegExp.test(url)) {
        let p = path.join(root, url);
        if (this.pathExists(p)) {
          const imgFile = fs.readFileSync(p);
          const type = mime.getType(url);
          url = `data:${type};base64,${imgFile.toString('base64')}`;
        }
      }
      str += `![](${url}|width=660)`;
      return str;
    }, '');

    return new MarkdownString(markdownText);
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}