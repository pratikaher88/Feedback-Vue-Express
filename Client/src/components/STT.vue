<template>

<div>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

        <div>
          <p v-if="error" class="grey--text">{{error}}</p>
          <p v-else class="mb-0" style="color:white;background-color:grey;padding:10px;border-radius:10px">
            <span  v-for="(sentence,index) in sentences" v-bind:key="index">
                
                <span v-if="sentences.length > 0">
                    {{sentence}}. 
                </span>
                
                </span>
            <span >{{runtimeTranscription}}</span>
          </p>
        </div>
        <br/>
        <div>
          <div
            dark
            @click.stop="toggle ? endSpeechRecognition() : startSpeechRecognition()"
            icon
            :color="!toggle ? 'grey' : (speaking ? 'red' : 'red darken-3')"
            :class="{'animated infinite pulse': toggle}">
            <!-- <v-icon>{{toggle ? 'mic_off' : 'mic'}}</v-icon> -->

            <div v-if="!toggle">
              <i class="fa fa-microphone fa-2x"/>
            </div>
            <div v-else>
              <i class="fa fa-microphone-slash fa-2x"/>
            </div>

          </div>
        </div>

</div>
  
</template>

<script>
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
let recognition = SpeechRecognition? new SpeechRecognition() : false

export default {
    name: 'Speech2Text',
    props: {
    lang: {
      type: String,
      default: 'en-US'
    }
    // },
    // text: {
    //   type: [String, null],
    //   required: true
    // }
  },
  data () {
    return {
      error: false,
      speaking: false,
      toggle: false,
      runtimeTranscription: '',
      sentences: []
    }
  },
  methods: {
    checkCompatibility () {
      if (!recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
      }
    },
    endSpeechRecognition () {
      recognition.stop()
      this.toggle = false
      this.$emit('speechend', {
        sentences: this.sentences,
        text: this.sentences.join('. ')
      })
    },
    startSpeechRecognition () {
      if (!recognition) {
        this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox'
        return false
      }
      this.toggle = true
      recognition.lang = this.lang
      recognition.interimResults = true

      recognition.addEventListener('speechstart', function() {
        this.speaking = true
      })

      recognition.addEventListener('speechend', function() {
        this.speaking = false
      })

      recognition.addEventListener('result', event => {
        const text = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('')
        this.runtimeTranscription = text
        this.$emit('sentTexts', this.runtimeTranscription)
      })

      recognition.addEventListener('end', () => {
        if (this.runtimeTranscription !== '') {
          this.sentences.push(this.capitalizeFirstLetter(this.runtimeTranscription))
          this.$emit('update:text', `${this.text}${this.sentences.slice(-1)[0]}. `)
        }
        this.runtimeTranscription = ''
        recognition.stop()
        // if (this.toggle) {
        //   // keep it going.
        //   recognition.start()
        // }
      })
      recognition.start()
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  mounted () {
    this.checkCompatibility()
  }
}

</script>

<style>

</style>