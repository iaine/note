  var Note = function() {

    function Note() {
        this.oscillators = Array();
    }

    //Return the minimum
    function min (dataArr) {
       return Math.min(...dataArr);
    }

    //Return the maximum
    function max (dataArr) {
        return Math.max(...dataArr);
    }

    function createNote(audioCtx, notes) {
        notes.map(n => play(audioCtx, n));
    }

    function getLastSlice(sliceid) {
      return (sliceid > 0) ? (slideid-1) : 0;
    }
  
    function play(audioCtx, noteArr) {
      for (let n in noteArr) {
          let oscillator[n] = audioCtx.createOscillator();

          let gainNode[n] = audioCtx.createGain();
          gainNode[n].connect(audioCtx.destination);
          gainNode[n].gain.setValueAtTime(n.volume, n.id);

          let m = getLastSlice(n);

          oscillator[n].type = "sine";
          oscillator[n].frequency.setValueAtTime(m.frequency, n.id);
          oscillator[n].frequency.exponentialRampToValueAtTime(n.frequency, audioCtx.currentTime + 0.03);
          oscillator[n].start(n.id);
          oscillator[n].stop(n.id + time);
          oscillator[n].connect(audioCtx.destination);
      }
    }

    // Start single note
    function start(audioCtx, frequency, note_length, volume, id) {
      let oscillator = audioCtx.createOscillator();

      let osc2 = audioCtx.createOscillator();  

      let gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(volume, id);
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, id);
      oscillator.frequency.exponentialRampToValueAtTime(frequency, audioCtx.currentTime + 0.03);
      oscillator.start(id);
      _model.push({'freq': frequency, 'gain': volume, 'duration': note_length, 'id':id  }); 
      oscillator.stop(id + note_length);

      /*osc2.frequency.setValueAtTime(2*frequency, id);
      osc2.frequency.exponentialRampToValueAtTime(2*frequency, audioCtx.currentTime + 0.03);
      osc2.start(id);
      _model.push({'freq': 2*frequency, 'gain': volume, 'duration': note_length, 'id':id  });
      osc2.stop(id + note_length);

      osc2.connect(audioCtx.destination);*/
      oscillator.connect(audioCtx.destination);
    };

    // Play two notes
    function altnote(context, witness, test, alignid) {
 
      oscillatorL = context.createOscillator();
      
      oscillatorL.frequency.setValueAtTime(witness['pitch'], alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witness['pitch'], context.currentTime + 0.03);
      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(test['pitch'], alignid);
      oscillatorR.frequency.exponentialRampToValueAtTime(test['pitch'], context.currentTime + 0.03);
      mergerNode = context.createChannelMerger(2); //create mergerNode with 2 inputs
      mergerNode.connect(context.destination);

      oscillatorL.connect(mergerNode, 0, 0);
      //connect output #0 of the oscillator to input #0 of the mergerNode
      oscillatorR.connect(mergerNode, 0, 1);
      //connect output #0 of the oscillator to input #1 of the mergerNode

      oscillatorL.start(alignid);
      oscillatorL.stop(alignid + witness['duration']);
      oscillatorR.start(alignid);
      oscillatorR.stop(alignid + test['duration']);
      
    };

    // Play two notes
    function pausenote(context, witness, test, alignid) {
      var witnesspause = 0;
      var testpause = 0;

      let volumeL = 0;
      let volumeR = 0;

      if (witness.pitch < 50.0){
         witnesspause =  230.0;
         volumeL = 0.5; 
      }else {
         witnesspause =  witness.pitch;
         //witnesspause =  100.0;
         volumeL = 0.1;
      }

      if (test.pitch < 50.0){
         testpause =  230.0;
         volumeR = 0.5;     
      }else { 
         testpause =  test.pitch;
         //test.pitch = 100.0;
         volumeR = 0.1;
      }
      var testpause = (test.pitch < 50.0)? 230.0 : test.pitch;

      let gainNodeL = context.createGain();
      gainNodeL.connect(context.destination);
      gainNodeL.gain.setValueAtTime(volumeL, alignid);

      let gainNodeR = context.createGain();
      gainNodeR.connect(context.destination);
      gainNodeR.gain.setValueAtTime(volumeR, alignid);

      console.log('test ' + witnesspause + ' witness ' + testpause);
      oscillatorL = context.createOscillator();
  
      oscillatorL.frequency.setValueAtTime(witnesspause, alignid);
      oscillatorL.frequency.exponentialRampToValueAtTime(witnesspause, context.currentTime + 0.03);

      oscillatorR = context.createOscillator();
      oscillatorR.frequency.setValueAtTime(testpause, alignid);
      oscillatorR.frequency.exponentialRampToValueAtTime(testpause, context.currentTime + 0.03);
      mergerNode = context.createChannelMerger(2); //create mergerNode with 2 inputs
      mergerNode.connect(context.destination);

      oscillatorL.connect(mergerNode, 0, 0);
      //connect output #0 of the oscillator to input #0 of the mergerNode
      oscillatorR.connect(mergerNode, 0, 1);
      //connect output #0 of the oscillator to input #1 of the mergerNode

      oscillatorL.start(alignid);
      oscillatorL.stop(alignid + witness['duration']);
      oscillatorR.start(alignid);
      oscillatorR.stop(alignid + test['duration']);

    };
    return {
        start:start,
        min:min,
        max:max, 
        altnote:altnote, 
        pausenote:pausenote
    }
  };
