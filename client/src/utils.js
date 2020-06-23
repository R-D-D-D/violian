export default {
  // storing rhythm as a string
  generateRhythmString (rhythm) {
    return rhythm.title + '&' + rhythm.timeSignature + '&' + rhythm.noOfBars.toString() + '&' + rhythm.bpm.toString() + '&' + rhythm.rhythm.join('-')
  },

  generateRhythmsString (rhythms) {
    console.log(rhythms)
    var result = ''
    for (var i = 0; i < rhythms.length; i++) {
      if (i == rhythms.length - 1) {
        result += this.generateRhythmString(rhythms[i])
      } else {
        result += this.generateRhythmString(rhythms[i]) + '$'
      }
    }
    return result;
  },

  parseRhythmString (str) {
    var strArr = str.split('&')
    const obj = {
      title: strArr[0],
      timeSignature: strArr[1],
      noOfBars: strArr[2],
      bpm: strArr[3],
      rhythm: strArr[4].split('-')
    }
    return obj
  },

  parseRhythmsString (str) {
    var rhythms = str.split('$').map(rhythm => this.parseRhythmString(rhythm))
    return rhythms
  }
}
