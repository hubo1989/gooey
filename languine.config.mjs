export default {
  version: "0.5.0",
  locale: {
    source: "en",
    targets: ["zh-CN","zh-TW","ja","ko","es","fr","de","pt","ru","it"]
  },
  files: {
    json: {
      include: ["src/locales/[locale].json"]
    }
  },
  openai: {
    model: "gemini-2.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
  }
}