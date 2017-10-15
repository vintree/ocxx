exports.cut = (options) => {
    const { key, wordCount, text } = options
    const wordCountMap = {
        1: 36,
        2: 13
    }
    const count = wordCount ? wordCount : wordCountMap[key]
    return text.length > count ? `${text.slice(0, count)}...` : text
}