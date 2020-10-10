<template lang="pug">
    <div>
    <Plotly :data="data" :layout="layout" :display-mode-bar="false" :static-plot="true" :responsive="true"></Plotly>
    <Plotly v-for="graph in graphs" :data="graph.data" :layout="graph.layout" :display-mode-bar="false" :static-plot="true" :responsive="true"></Plotly>
    </div>
</template>

<script>
import { Plotly } from "vue-plotly";
export default {
  name: "AutoEvaluation",
  components: {
    Plotly
  },
  methods: {
    getSecondsPerRow() {
      let timeSignature = 4;
      let bpm = 60;
      let barsPerRow = 4;
      return (60 / bpm) * timeSignature * barsPerRow;
    },
    getNumberFromMusicNote(noteNumber) {
      let octave = noteNumber[1] - "0";
      let note = noteNumber[0].charCodeAt(0) - "C".charCodeAt(0);
      if (note < 0) {
        note = note + 8;
      }
      return octave * 8 + note;
    },
    getLineSegmentForMusicNote(note) {
      let y = this.getLineSegmentYValForMusicNote(note);
      return {
        type: "line",
        x0: note.onset,
        y0: y,
        x1: note.onset + note.duration,
        y1: y,
        line: {
          color: "rgb(55, 128, 191)",
          width: 3
        }
      };
    },
    getLineSegmentYValForMusicNote(note) {
      let minY = this.getNumberFromMusicNote(this.minNoteNumber);
      let maxY = this.getNumberFromMusicNote(this.maxNoteNumber);
      let y = this.getNumberFromMusicNote(note.noteNumber);
      return (
        ((y - minY) / (maxY - minY)) *
        (this.maxNoteNumber[1] - this.minNoteNumber[1])
      );
    },
    splitIntoRows(notes) {
      let timePerRow = this.getSecondsPerRow();
      let newRowStartTime = 0;
      let rows = [];
      rows.push([]);
      for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        if (note.onset < newRowStartTime + timePerRow) {
          if (note.onset + note.duration <= newRowStartTime + timePerRow) {
            rows[rows.length - 1].push(note);
          } else {
            // split a note that lasts across two rows into two notes
            let noteCopy = { ...note };
            noteCopy.onset = newRowStartTime + timePerRow;
            noteCopy.duration =
              note.onset + note.duration - (newRowStartTime + timePerRow);
            note.duration = note.duration - noteCopy.duration;
            rows[rows.length - 1].push(note);
            notes[i] = noteCopy;
            newRowStartTime = newRowStartTime + timePerRow;
            rows.push([]);
            i--;
          }
        } else {
          newRowStartTime = newRowStartTime + timePerRow;
          rows.push([]);
          i--;
        }
      }
      return rows;
    },
    getTickValsForRow(rowIndex) {
      let ticks = [];
      for (let i = 0; i <= this.barsPerRow; i++) {
        ticks.push(i);
      }
      return ticks.map(tick => tick * 4 + rowIndex * this.secondsPerRow);
    },
    getAnnotationXValsForNotes(notes) {
      return notes.map(note => note.onset + note.duration / 2);
    },
    getAnnotationYValsForNotes(notes) {
      return notes.map(note => this.getLineSegmentYValForMusicNote(note) + 0.3);
    },
    getAnnotationsForNotes(notes) {
      return notes.map(note => note.noteNumber);
    },
    getGraphsForNotes(notes) {
      let rows = this.splitIntoRows(notes);
      let graphs = [];
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let graph = {
          data: [
            {
              x: this.getAnnotationXValsForNotes(row),
              y: this.getAnnotationYValsForNotes(row),
              text: this.getAnnotationsForNotes(row),
              mode: "text"
            }
          ],
          layout: {
            xaxis: {
              zeroline: false,
              range: [i * this.secondsPerRow, (i + 1) * this.secondsPerRow],
              tickvals: this.getTickValsForRow(i),
              tickfont: {
                family: "Old Standard TT, serif",
                size: 10,
                color: "Brown"
              },
              gridcolor: "#bdbdbd",
              gridwidth: 3
            },
            yaxis: {
              range: [0, 3],
              tickvals: [0, 1, 2, 3],
              ticktext: ["C3", "C4", "C5", "C6"],
              tickfont: {
                family: "Old Standard TT, serif",
                size: 10,
                color: "Brown"
              }
            },
            width: 1200,
            height: 250,
            shapes: row.map(note => this.getLineSegmentForMusicNote(note))
          }
        };
        graphs.push(graph);
      }
      return graphs;
    }
  },

  data() {
    return {
      minNoteNumber: "C3",
      maxNoteNumber: "C6",
      bpm: 60,
      timeSignature: 4,
      barsPerRow: 4,
      secondsPerRow: this.getSecondsPerRow(),
      transcribedNotes: [
        {
          onset: 0.3,
          noteNumber: "B3",
          duration: 5
        },
        {
          onset: 5.3,
          noteNumber: "A3",
          duration: 4
        },
        {
          onset: 10,
          noteNumber: "D3",
          duration: 8
        },
        {
          onset: 18,
          noteNumber: "E3",
          duration: 5
        },
        {
          onset: 23,
          noteNumber: "F3",
          duration: 4
        },
        {
          onset: 28,
          noteNumber: "G3",
          duration: 5
        },
        {
          onset: 33,
          noteNumber: "A3",
          duration: 3
        }
      ],
      graphs: [],
      data: [
        {
          x: [0.75, 1.8],
          y: [0.2, 0.6],
          text: ["A1", "A2"],
          mode: "text"
        }
      ],
      layout: {
        title: "My graph",
        xaxis: {
          range: [0, 4]
        },
        yaxis: {
          range: [0, 3],
          tickvals: [0, 1, 2, 3],
          ticktext: ["C3", "C4", "C5", "C6"]
        },
        width: 400,
        height: 250,
        shapes: [
          {
            type: "line",
            x0: 0.5,
            y0: 0.5,
            x1: 1,
            y1: 0.5,
            line: {
              color: "rgb(55, 128, 191)",
              width: 3
            }
          },
          {
            type: "line",
            x0: 1.5,
            y0: 1,
            x1: 2.2,
            y1: 1,
            line: {
              color: "rgb(127, 255, 212)",
              width: 3
            }
          },
          {
            type: "line",
            x0: 2.2,
            y0: 1.5,
            x1: 3,
            y1: 1.5,
            line: {
              color: "rgb(255, 127, 80)",
              width: 3
            },
            name: "A4"
          },
          {
            type: "line",
            x0: 3,
            y0: 1,
            x1: 3.3,
            y1: 1,
            line: {
              color: "rgb(255, 215, 0)",
              width: 3
            }
          }
        ]
      }
    };
  },
  created() {
    this.graphs = this.getGraphsForNotes(this.transcribedNotes);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
