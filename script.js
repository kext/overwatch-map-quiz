const maps = [{"n":"blizzard-world","i":17},{"n":"busan-downtown","i":11},{"n":"busan-meka-base","i":12},{"n":"busan-sanctuary","i":9},{"n":"dorado","i":17},{"n":"eichenwalde","i":11},{"n":"hanamura","i":9},{"n":"havana","i":21},{"n":"hollywood","i":13},{"n":"horizon-lunar-colony","i":13},{"n":"ilios-lighthouse","i":8},{"n":"ilios-ruins","i":7},{"n":"ilios-well","i":7},{"n":"junkertown","i":16},{"n":"kings-row","i":13},{"n":"lijiang-tower-control-center","i":8},{"n":"lijiang-tower-garden","i":8},{"n":"lijiang-tower-night-market","i":8},{"n":"nepal-sanctum","i":9},{"n":"nepal-shrine","i":8},{"n":"nepal-village","i":8},{"n":"numbani","i":13},{"n":"oasis-city-center","i":10},{"n":"oasis-gardens","i":11},{"n":"oasis-university","i":9},{"n":"paris","i":16},{"n":"rialto","i":16},{"n":"route-66","i":14},{"n":"temple-of-anubis","i":11},{"n":"volskaya-industries","i":10},{"n":"watchpoint-gibraltar","i":18},{"n":"circuit-royal","i":12},{"n":"shambali-monastery","i":13},{"n":"midtown","i":16},{"n":"paraiso","i":18},{"n":"colosseo","i":10},{"n":"esperanca","i":13},{"n":"new-queen-street","i":14}]
const en = () => ({
  "title": "Overwatch Map Quiz",
  "question": n => "Question " + n,
  "answers": "Answers",
  "correct": n => n + " correct",
  "wrong": n => n + " wrong",
  "nextQuestion": "Next Question",
  "whichMapIs": s => "Which map is " + s + "?",
  "whichMapIsThis": "Which map is this?",
  "map": {
    "blizzard-world": "Blizzard World",
    "busan-downtown": "Busan Downtown",
    "busan-meka-base": "Busan MEKA Base",
    "busan-sanctuary": "Busan Sanctuary",
    "dorado": "Dorado",
    "eichenwalde": "Eichenwalde",
    "hanamura": "Hanamura",
    "havana": "Havana",
    "hollywood": "Hollywood",
    "horizon-lunar-colony": "Horizon Lunar Colony",
    "ilios-lighthouse": "Ilios Lighthouse",
    "ilios-ruins": "Ilios Ruins",
    "ilios-well": "Ilios Well",
    "junkertown": "Junkertown",
    "kings-row": "King’s Row",
    "lijiang-tower-control-center": "Lijiang Tower Control Center",
    "lijiang-tower-garden": "Lijiang Tower Garden",
    "lijiang-tower-night-market": "Lijiang Tower Night Market",
    "nepal-sanctum": "Nepal Sanctum",
    "nepal-shrine": "Nepal Shrine",
    "nepal-village": "Nepal Village",
    "numbani": "Numbani",
    "oasis-city-center": "Oasis City Center",
    "oasis-gardens": "Oasis Gardens",
    "oasis-university": "Oasis University",
    "paris": "Paris",
    "rialto": "Rialto",
    "route-66": "Route 66",
    "temple-of-anubis": "Temple of Anubis",
    "volskaya-industries": "Volskaya Industries",
    "watchpoint-gibraltar": "Watchpoint: Gibraltar",
    "circuit-royal": "Circuit Royal",
    "shambali-monastery": "Shambali Monastery",
    "midtown": "Midtown",
    "paraiso": "Paraíso",
    "colosseo": "Colosseo",
    "esperanca": "Esperança",
    "new-queen-street": "New Queen Street",
  },
})
const pad = n => (n < 10 ? '0' : '') + n
const rnd = n => Math.floor(Math.random() * n)
const image = m => 'img/' + m.n + '/' + pad(rnd(m.i) + 1) + '.jpg'
const sample = a => a[rnd(a.length)]
const sampleN = (a, n) => {
  const r = []
  while (r.length < n && r.length < a.length) {
    const i = rnd(a.length)
    if (!r.includes(i)) {
      r.push(i)
    }
  }
  return r.map(i => a[i])
}
const question = (number) => {
  const selection = sampleN(maps, 4)
  const correct = rnd(selection.length)
  if (rnd(2) < 1) {
    const text = l => l.whichMapIs(l.map[selection[correct].n])
    const answers = selection.map(m => ({
      img: image(m)
    }))
    return {
      number,
      answers,
      correct,
      text,
      selected: -1,
    }
  } else {
    const text = l => l.whichMapIsThis
    const img = image(selection[correct])
    const answers = selection.map(m => ({
      text: l => l.map[m.n],
    }))
    return {
      number,
      answers,
      correct,
      text,
      img,
      selected: -1,
    }
  }
}
const app = Vue.createApp({
  data() {
    return {
      locale: en(),
      correct: 0,
      wrong: 0,
      question: question(1),
      nextQuestion: question(2),
    }
  },
  computed: {
    score() {
      return Math.round(100 * this.correct / (this.correct + this.wrong)) | 0
    },
    preload() {
      let p = []
      if (this.nextQuestion.img) {
        p.push(this.nextQuestion.img)
      }
      for (let i = 0; i < this.nextQuestion.answers.length; ++i) {
        const a = this.nextQuestion.answers[i]
        if (a.img && !p.includes(a.img)) p.push(a.img)
      }
      return p
    },
  },
  methods: {
    answer(n) {
      if (this.question.selected < 0) {
        this.question.selected = n
        if (n === this.question.correct) {
          this.correct += 1
        } else {
          this.wrong += 1
        }
      }
    },
    newQuestion() {
      this.question = this.nextQuestion
      this.nextQuestion = question(this.question.number + 1)
    },
    answerClass(i) {
      return {
        wrong: i === this.question.selected && i !== this.question.correct,
        correct: this.question.selected >= 0 && i === this.question.correct,
      }
    }
  }
}).mount('#quiz')
document.querySelector('body').classList.remove('loading')
