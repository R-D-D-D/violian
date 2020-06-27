export default {
  // storing rhythm as a string
  generateRhythmString (rhythm) {
    if (rhythm != undefined)
      return rhythm.id.toString() + '&' + rhythm.title + '&' + rhythm.timeSignature + '&' + rhythm.noOfBars.toString() + '&' + rhythm.bpm.toString() + '&' + rhythm.rhythm.join('-')
    else
      return ''
    },

  generateRhythmsString (rhythms) {
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
    //console.log(str)
    var strArr = str.split('&')
    const obj = {
      id: parseInt(strArr[0]),
      title: strArr[1],
      timeSignature: strArr[2],
      noOfBars: strArr[3],
      bpm: strArr[4],
      rhythm: strArr[5] ? strArr[5].split('-') : []
    }
    return obj
  },

  parseRhythmsString (str) {
    if (str.length == 0)
      return []
    var rhythms = str.split('$').map(rhythm => this.parseRhythmString(rhythm))
    return rhythms
  },

  cloneRhythms (rhythms) {
    const result = []
    for (var i = 0; i < rhythms.length; i++) {
      const newRhythm = {}
      newRhythm.id = rhythms[i].id
      newRhythm.title = rhythms[i].title
      newRhythm.timeSignature = rhythms[i].timeSignature
      newRhythm.noOfBars = rhythms[i].noOfBars
      newRhythm.bpm = rhythms[i].bpm
      newRhythm.rhythm = [...(rhythms[i].rhythm)]
      result.push(newRhythm)
    }
    return result
  },

  cloneLesson (lesson) {
    return {
      id: lesson.id,
      name: lesson.name,
      TutorId: lesson.TutorId,
      rhythms: this.cloneRhythms(lesson.rhythms),
      date: lesson.date
    }
  }
}
