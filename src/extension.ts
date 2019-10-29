// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const translator = require("./components/translator");
const shaper = require("./components/shaper");


class Editor {
  editor: vscode.TextEditor | undefined;
  selection: vscode.Selection | undefined;
  text: string;

  constructor() {
    this.editor = vscode.window.activeTextEditor;
    this.text = "";

    if (this.editor === undefined) {
      vscode.window.showErrorMessage("editor is undefined");
    
    } else {
      // 選択範囲のテキストを取得
      this.selection = this.editor.selection;

      if (this.selection.isEmpty) {
        let startPos = new vscode.Position(0, 0);
        let endPos = new vscode.Position(this.editor.document.lineCount - 1, 10000);
        this.selection = new vscode.Selection(startPos, endPos);
      }

      this.text = this.editor.document.getText(this.selection);
    }
  }

  async filterText(...filters: ((text: string) => Promise<string>)[]) {
    for (let filter of filters) {
      this.text = await filter(this.text);
    }
    
    // エディタ選択範囲にテキストを反映
    if (this.editor !== undefined) {
      this.editor.edit((edit: vscode.TextEditorEdit) => {
        if (this.selection !== undefined) {
          edit.replace(this.selection, this.text);
        }
      });
    }
  }
}


const commands = {
  // extension.shape: 整形のみ
  "extension.shape": async () => {
    let editor = new Editor();
    editor.filterText(
      shaper.doShape
    );
    vscode.window.showInformationMessage("Shaped !");
  },
  // extension.shapeAndTranslate: 整形＆翻訳
  "extension.shapeAndTranslate": async () => {
    let editor = new Editor();
    editor.filterText(
      shaper.doShape,
      async (text: string) => { 
        // Google 翻訳
        vscode.window.showInformationMessage("Translating...");
        
        try {
          let translated = await translator.doTranslate(text);
          vscode.window.showInformationMessage("Translated and shaped!");
          return translated;
        
        } catch (err) {
          vscode.window.showWarningMessage("Failed to translate. only shaped.");
        }
        
      }
    );
  }
};


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  
  for (const [command, callback] of Object.entries(commands)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        command, callback
      )
    );
  }
}


// this method is called when your extension is deactivated
export function deactivate() {}
