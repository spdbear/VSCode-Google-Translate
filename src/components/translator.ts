const request = require("request");

const API_URL = "https://script.google.com/macros/s/AKfycbzm_9ytCpltZEvCMvDkYwbvSEJDQysKiZ58Vi7OdXFHpA3zfsY/exec";

  // Google App Script を利用した Google 翻訳

module.exports = {
  async doTranslate(text: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
    
    const option = {
      uri: API_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencode"
      },
      followAllRedirects: true,
      form: {
        text: text,
        target: "ja"
      }
    };
  
    request.post(
      option, 
      (error : object, response : any, body : string) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      }
    );
  
    });
  }
};
