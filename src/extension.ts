// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.engShaper",
    () => {
      // The code you place here will be executed every time your command is executed
      let editor: vscode.TextEditor | undefined =
        vscode.window.activeTextEditor; // エディタ取得
      if (editor === undefined) {
        vscode.window.showInformationMessage("editor is undefined");
        return;
      }
      let doc = editor.document; // ドキュメント取得
      let cur_selection = editor.selection; // 選択範囲取得
      if (editor.selection.isEmpty) {
        // 選択範囲が空であれば全てを選択範囲にする
        let startPos = new vscode.Position(0, 0);
        let endPos = new vscode.Position(doc.lineCount - 1, 10000);
        cur_selection = new vscode.Selection(startPos, endPos);
      }

      let text = doc.getText(cur_selection); //取得されたテキスト

      /**
       * ここでテキストを加工します。
       **/
      text = text.replace(/\r\n/g,"\n"); // CRLFの場合にはLFに変換して処理を行う
      text = text
        .split("\n") // 改行を除去
        .map(elem => (elem === "" ? "\n\n" : elem)) // 改行のみの行は残す
        .join(" "); // 改行をスペースに置換
      text = text.replace(/(\.|\?|\!|:|。|？|！|;)\s/g, "$1 \n"); // 文末に改行を付加
      text = text.replace(
        /(?<=Ref|Refs|et al|Fig|\svs|Sec|e\.g|etc|i\.e)\.\s\n/g,
        ". "
      ); // 略称後の改行を除去
      text = text.replace(/(?<=[A-Za-z])\-\s/g, ""); // 単語間ハイフンを除去
      text = text.replace(/^ +/g, ""); // 行頭スペースを除去
      text = text.replace(/\n +/g, "\n"); // 行頭スペースを除去
      text = text.replace(/ +$/g, ""); // 行末スペースを除去
      text = text.replace(/ +\n/g, "\n"); // 行末スペースを除去
      text = text.replace(/^([0-9A-Z.]+)\.\n/g, "$1. "); // 章番号の改行を除去
      text = text.replace(/\n([0-9A-Z.]+)\.\n/g, "$1. "); // 章番号の改行を除去
      //エディタ選択範囲にテキストを反映
      editor.edit(edit => {
        edit.replace(cur_selection, text);
      });
      // Display a message box to the user
      vscode.window.showInformationMessage("Shaped!");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
