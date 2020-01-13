const translate = require("@vitalets/google-translate-api");

module.exports = {
  async doTranslate(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      translate(text, {to: "ja"}).then(
        (translated: any) => resolve(translated.text)
      ).catch((err: any) => reject(err));
    });
  }
};
