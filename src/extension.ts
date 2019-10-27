// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const request = require("request");


// Google App Script を利用した Google 翻訳
export async function doTranslate(text: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
  
  const option = {
    uri: "https://script.google.com/macros/s/AKfycbyCl1i6R5VVdzJ4NO4ydpizaa27K9JS_6JZTTDMd9w9WnuJFeM/exec",
    headers: {
      "Content-Type": "application/x-www-form-urlencode"
    },
    followAllRedirects: true,
    form: {
      text: text,
      target: "ja"
    }
  };

  request.post(option, function(error : object, response : any, body : string) {
    if (error) {
      reject(error);
    } else {
      resolve(body);
    }
  });

  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  
  let disposable = vscode.commands.registerCommand(
    "extension.engShaper", async() => {
      // The code you place here will be executed every time your command is executed
      let editor = vscode.window.activeTextEditor; // エディタ取得
      if (editor === undefined) {
        vscode.window.showInformationMessage("editor is undefined");
        return;
      }

      let doc = editor.document;            // ドキュメント取得
      let cur_selection = editor.selection; // 選択範囲取得

      // 選択範囲が空であれば全てを選択範囲にする
      if (editor.selection.isEmpty) {
        let startPos = new vscode.Position(0, 0);
        let endPos = new vscode.Position(doc.lineCount - 1, 10000);
        cur_selection = new vscode.Selection(startPos, endPos);
      }

      let text = doc.getText(cur_selection); // 取得されたテキスト

      /**
       * ここでテキストを加工します。
      **/

      // 改行周りの処理
      text = text
        // CRLFの場合にはLFに変換して処理を行う
        .replace(/\r\n/g, "\n")                 
        // 改行で split  
        .split("\n")                            
        // 改行のみの行は残す    
        .map(
          elem => (elem === "" ? "\n\n" : elem) 
        ) 
        // 改行をスペースに置換  
        .join(" ");                             
      
      // 文の区切りの後に改行を追加する
      text = text
        // 句点, 疑問符など
        .replace(/(\.|\?|\!|:|。|？|！|;)\s/g, "$1 \n")
        // 省略表現
        .replace(
          /(?<=Ref|Refs|et al|Fig|\svs|Sec|e\.g|etc|i\.e)\.\s\n/g,
          ". "
      ); 
      
      // 文の整形
      text = text
        // 単語間ハイフンを除去
        .replace(/(?<=[A-Za-z])\-\s/g, "")
        // 行頭スペースを除去
        .replace(/^ +/g, "")
        .replace(/\n +/g, "\n")
        // 行末スペースを除去
        .replace(/ +$/g, "")
        .replace(/ +\n/g, "\n")
        // 章番号の改行を除去
        .replace(/^([0-9A-Z.]+)\.\n/g, "$1. ")
        .replace(/\n([0-9A-Z.]+)\.\n/g, "$1. ");


      // Google 翻訳
      vscode.window.showInformationMessage("Translating...");
      try {
        let translated = await doTranslate(text);
        text = translated;

        vscode.window.showInformationMessage("Translated and shaped!");
      } catch (err) {
        vscode.window.showInformationMessage("Failed to translate. only shaped.");
      }
      
      //エディタ選択範囲にテキストを反映
      editor.edit(edit => {
        edit.replace(cur_selection, text);
      });
    }
  );

  context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {}
