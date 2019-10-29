module.exports = {
  doShape(text: string): string {
    
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
    
    return text;
  }
};
