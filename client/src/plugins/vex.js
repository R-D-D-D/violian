 /* eslint-disable */ 

// Handler until line 483 =================================================================================================================

Vex.UI = {};

const VF = Vex.Flow;

//Vex UI -> User Interface for VexFlow
/*
 * Vex.UI.Handler: this class is responsible for starting all the events needed for the VexFlow User Interface to work.
 */
Vex.UI.provisoryTickableStyle = {shadowBlur:0, shadowColor:'gray', fillStyle:'gray', strokeStyle:'gray'}; 
Vex.UI.highlightNoteStyle = {shadowBlur:15, shadowColor:'red', fillStyle:'black', strokeStyle:'black'};
Vex.UI.defaultNoteStyle = {shadowBlur:0, shadowColor:'black', fillStyle:'black', strokeStyle:'black'};
Vex.UI.scale = 1.5;

Vex.UI.Handler = function (containerId, options){
	this.container = document.getElementById(containerId);

	//Merge options with default options
	var defaultOptions = {
		canEdit: true,
		canPlay: true,
		canAddStaves: true,
		canChangeNoteValue: true,
		showToolbar: true,
		numberOfStaves: 4,
		canvasProperties: {
			id: containerId + "-canvas",
			width: 1225,
			height: 320,
			tabindex: 1
		}
	};

	this.options = mergeProperties(defaultOptions, options || {});
	this.canvas = this.createCanvas();
	this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
	this.ctx = this.renderer.getContext();
	this.staveList = this.createStaves();
	this.ctx.scale(1.5, 1.5);

	// if(this.options.showToolbar)
	// 	this.toolbar = new Vex.UI.Toolbar(this);

	this.currentNote = null;
	this.currentStave = null;
	//Tickable that will follow the mouse position
	this.provisoryTickable = null;
	
	this.mouseListener = new Vex.UI.MouseListener(this, this.canvas, this.staveList);
	
	// this.keyboardListener = new Vex.UI.KeyboardListener(this, this.canvas, this.staveList);
	
	this.noteMenu = new Vex.UI.NoteMenu(this, this.canvas, this.ctx);
	this.noteMenu.init();
	
	this.tipRenderer = new Vex.UI.TipRenderer(this.canvas);
	this.tipRenderer.init();
	
	// this.player = new Vex.UI.Player(this, this.staveList);
};

Vex.UI.Handler.prototype.createCanvas = function() {
	var canvas = document.createElement('canvas');
	//Attach all properties to element
	var props = Object.keys(this.options.canvasProperties);
	for(var i = 0; i<props.length; i++){
		canvas[props[i]] = this.options.canvasProperties[props[i]];
	}
	this.container.appendChild(canvas);

	return canvas;
};

Vex.UI.Handler.prototype.createStaves = function() {
	var staveList = [];
	var yPosition = 0;
	for(var i = 0; i < this.options.numberOfStaves; i++){
		//TODO make stave position more dinamic
		var stave = {};
		if ((i + 1) % 2 == 0) {
			stave = new Vex.Flow.Stave(410, yPosition, 400);
			yPosition += (stave.height * 1.2);
		} else {
			stave = new Vex.Flow.Stave(10, yPosition, 400);
			stave.addClef("treble").addTimeSignature('4/4');
		}
		stave.font = {
      family: 'sans-serif',
      size: 12,
      weight: '',
		};
		staveList.push(stave);
		stave.setContext(this.ctx);
		//Initially empty -> No Notes
		//TODO make it able to load notes
		stave.setTickables([]);
	}

	return staveList;
};


Vex.UI.Handler.prototype.init = function() {
	//Draw everything
	this.redraw();

	if(this.options.canEdit){
		//Start the Listeners
		this.mouseListener.startListening();
		// this.keyboardListener.startListening();
	}

	return this;
};

Vex.UI.Handler.prototype.redraw = function(notesInserted){
	this.ctx.clear();
	this.drawStaves();
	if (notesInserted) {
		this.drawNotes(undefined, true);
	} else {
		this.drawNotes();
	}
};

Vex.UI.Handler.prototype.redrawStave = function(stave){
	//get stave bounding box
	var box = stave.getBoundingBox();
	//TODO The +12 and +5 values are to erase part of a note that could be out of the bounding box. This values shouldn't be absolut. FIX!	
	// this.ctx.clear();
	// this.drawStaves();
	// for(var i = 0; i < this.staveList.length; i++){
	// 	this.drawNotes(this.staveList[i]);
	// }
	var idx = this.staveList.indexOf(stave);
	if ((idx + 1) % 2 == 0) {
		this.ctx.clearRect(box.getX(), box.getY(), box.getW() + 15, box.getH() + 5);
	} else {
		this.ctx.clearRect(box.getX() - 15, box.getY(), box.getW() + 16, box.getH());
	}
	this.drawStaves(stave);
	this.drawNotes(stave);
};

Vex.UI.Handler.prototype.drawStaves = function(stave){
	if (stave) {
		stave.draw();
	} else {
		for(var i = 0; i < this.staveList.length; i++){
			this.staveList[i].draw();
		}
	}
};

Vex.UI.Handler.prototype.drawNotes = function(stave, notesInserted){
	if(stave === undefined){
		//Draw Notes on all staves
		for(var i = 0; i < this.staveList.length; i++){
			this.drawNotes(this.staveList[i], notesInserted);
		}
	} else {
		//Draw notes on Stave passed as Arg
		var voice = new Vex.Flow.Voice(Vex.Flow.TIME4_4).setMode(Vex.Flow.Voice.Mode.SOFT);
		// disable strict timing, or else we won't be able to render BarNotes
		voice.setStrict(false);
		voice.addTickables(stave.getTickables());
		
    var formatter = new Vex.Flow.Formatter();
    if (stave.getTickables().length != 0) {
			formatter.joinVoices([voice]);
			formatter.formatToStave([voice], stave);
			voice.draw(this.ctx, stave);
			if (notesInserted) {
				this.drawBeams(stave, true);
			} else {
				this.drawBeams(stave);
			}
		}
	}
};

Vex.UI.Handler.prototype.drawBeams = function(stave, notesInserted){
	// for(var i = 0; i < stave.getBeams().length; i++){
	// 	stave.getBeams()[i].setContext(this.ctx).draw();
	// }
	
	if (notesInserted || stave.beams == null) {
		stave.beams = Vex.Flow.Beam.generateBeams(stave.getTickables());
	}

	for (var i = 0; i < stave.beams.length; i ++) {
		stave.beams[i].setContext(this.ctx).draw();
	}
};


Vex.UI.Handler.prototype.updateProvisoryKey = function(mousePos){
	
	if(this.provisoryTickable==null){
		this.provisoryTickable = new Vex.Flow.StaveNote({keys: ["d/4"], duration: "4"});		
	}

	
	
	if(this.currentStave!=null){
		if(!(this.provisoryTickable instanceof Vex.Flow.StaveNote) || this.provisoryTickable.noteType == "r"){
			//No need to update key if its not a note or if its a rest, just draw the tickable in the new mouse position
		}
		else{
			var noteName = NoteMap.getNoteName(this.currentStave, mousePos);
			if(noteName != this.provisoryTickable.keys[0]){
				
				this.provisoryTickable = this.provisoryTickable.clone({keys: [noteName]});
				if(this.provisoryTickable !== undefined){
					this.provisoryTickable.setStyle(Vex.UI.provisoryTickableStyle);
				}
				//Since we have a new note key, update the stem direction
				this.provisoryTickable.setStemDirection(getStemDirection(this.currentStave, mousePos.y));
				this.provisoryTickable.setStave(this.currentStave);
				this.provisoryTickable.setTickContext(new Vex.Flow.TickContext());
				
			}
		}
		this.drawProvisoryTickable(mousePos);
		
	}
	
};

Vex.UI.Handler.prototype.updateProvisoryDuration = function(newDur){
	var x_shift = null;
	if(this.provisoryTickable)
		x_shift = this.provisoryTickable.x_shift;
	this.provisoryTickable = this.provisoryTickable.clone({duration: newDur});
	if(x_shift)
		this.provisoryTickable.x_shift = x_shift;
	this.provisoryTickable.setStave(this.currentStave || this.staveList[0]);
	this.provisoryTickable.setTickContext(new Vex.Flow.TickContext());
	this.drawProvisoryTickable();
	
};

Vex.UI.Handler.prototype.updateProvisoryType = function(newType){
	var x_shift = null;
	if(this.provisoryTickable)
		x_shift = this.provisoryTickable.x_shift;
	
	switch(newType){
	case Vex.UI.TickableType.NOTE:
		this.provisoryTickable = new Vex.Flow.StaveNote({keys: ["d/4"], duration: "4" });
		break;
	case Vex.UI.TickableType.REST:
		var duration = "4";//TODO make it more configurable, or at least dinamic
		if(this.provisoryTickable)
			duration = this.provisoryTickable.duration;
		this.provisoryTickable = new Vex.Flow.StaveNote({ keys: ["b/4"], duration: duration + "r" });
		break;
	case Vex.UI.TickableType.BAR:
		this.provisoryTickable = new Vex.Flow.BarNote();
		break;
	case Vex.UI.TickableType.CLEF:
		this.provisoryTickable = new Vex.Flow.ClefNote("treble");
		this.provisoryTickable.clefKey = "treble";
		break;
	}
	
	//TODO Maybe this code below shouldn't be here... should we really draw in this method?
	this.provisoryTickable.setStave(this.currentStave || this.staveList[0]);
	this.provisoryTickable.setTickContext(new Vex.Flow.TickContext());
	if(this.provisoryTickable.setStyle !== undefined)
		this.provisoryTickable.setStyle(Vex.UI.provisoryTickableStyle);
	if(x_shift)
		this.provisoryTickable.x_shift = x_shift;
	
	this.drawProvisoryTickable();
};

Vex.UI.Handler.prototype.drawProvisoryTickable = function(mousePos){
	
	if(this.provisoryTickable && this.currentStave!=null){
		this.redrawStave(this.currentStave);
		if(mousePos!==undefined){
			if(this.provisoryTickable instanceof Vex.Flow.StaveNote){
				//Fix X position to set exactly where the mouse is
				//TODO the -5 value shouldnt be absolute! it should reflect half the note's Width
				this.provisoryTickable.x_shift= mousePos.x - this.provisoryTickable.getAbsoluteX() - 5;

			}else if (this.provisoryTickable instanceof Vex.Flow.BarNote){// if(this.provisoryTickable instanceof Vex.Flow.BarNote){
				const barline = new Vex.Flow.Barline(1);
				// barline.setX(mousePos.x 
				// 	- this.currentStave.getNoteStartX() 
				// 	- this.provisoryTickable.render_options.stave_padding);
				barline.setX(mousePos.x);
				barline.draw(this.currentStave);
			} else {
				this.provisoryTickable.getTickContext().setX(
					mousePos.x 
					- this.currentStave.getNoteStartX()
					- this.provisoryTickable.render_options.stave_padding
					);
			}
		}
		//Only draw Provisory note if not on a definitive note
		if(this.currentNote==null){
			var tempFillStyle = this.ctx.fillStyle;
			var tempStrokeStyle = this.ctx.strokeStyle;
			this.ctx.fillStyle = 'gray';
			this.ctx.strokeStyle = 'gray';

			if (this.provisoryTickable instanceof Vex.Flow.BarNote) {
				//this.provisoryTickable.draw();
			} else {
				this.provisoryTickable.draw();
			}

			this.ctx.fillStyle = tempFillStyle;
			this.ctx.strokeStyle = tempStrokeStyle;

		}	
	}
	
};

// Menu management
Vex.UI.Handler.prototype.openMenuForKey = function(keyName, mousePos){
	//We will open a new Menu: stop listening to the StaveMouseListener
	this.mouseListener.stopListening();
	this.noteMenu.setNote(this.currentNote);
	this.noteMenu.setKeyIndex(this.currentNote.indexOfKey(keyName));
	this.noteMenu.open(mousePos);
};

/**
 * This method is called by NoteMenu on close()
 */
Vex.UI.Handler.prototype.noteMenuClosed = function(){
	//Redraw the whole canvas
	this.redraw();
	//Resume listening the the mouse
	this.mouseListener.startListening();
};

Vex.UI.Handler.prototype.addAccidentalToNote = function(name, note, index){
	if(index === undefined || index == -1)
		index = 0;
	
	var accidental = new Vex.Flow.Accidental(name);
	note.addAccidental(index, accidental);
};

//Dots were moving up when the key is over a line. between lines works fine.
//Error provoked by modifiercontext.js on line 356 (or vexflow-min.js line 4007)
//Changed the line on min.js to stop shifting the dot when over a line to avoid the problem.
Vex.UI.Handler.prototype.addDotToNote = function(note){
	if (note.dots == 0) 
		note.addDotToAll();
};

//TODO Only create a new beam with next note if there isnt a beam already. Otherwise, merge beam or add note to beam.
Vex.UI.Handler.prototype.beamWithNextNote = function(note){
	var nextNote = this.currentStave.getNextNote(note);
	
	if(nextNote != null) {
		//Set the note array
		
		notes = [note, nextNote];
		
		nextNote.setStemDirection(note.getStemDirection());
		//Create beam
		var beam = new Vex.Flow.Beam(notes);
		
		this.currentStave.pushBeam(beam);
	}
};

Vex.UI.Handler.prototype.deleteNote = function(note){
	for(var i = 0; i < this.staveList.length; i++){
		var notes = this.staveList[i].getNotes();
		var referenceIndex = notes.indexOf(note);

		if(referenceIndex > -1){
			this.staveList[i].removeTickable(note);
		}
	}
};

Vex.UI.Handler.prototype.exportNotes = function() {
	var result = [];
	for(var i = 0; i < this.staveList.length; i++){
		for(var j = 0; j < this.staveList[i].getTickables().length; j++){
			var note = this.staveList[i].getTickables()[j];
			if (note instanceof Vex.Flow.StaveNote) {
				var dur = note.duration;
				var key = note.keys[0];
				var dot = note.dots;
				var noteType = note.noteType;
				var temp = key + "/" + dur;
				if (noteType == "r") {
					temp += "r";
				}
				if (dot == 1) {
					temp += "d";
				}
				result.push(temp);
			}
		}
	}
	return result;
};

Vex.UI.Handler.prototype.importNotes = function(notes, timeSignature) {
	var tickables = []
	var barNum = 0
	var barDuration = eval(timeSignature)
	var accumDuration = 0

	for (var j = 0; j < this.staveList.length; j++) {
		this.staveList[j].setTickables([])
	}

	for (var i = 0; i < notes.length; i++) {
		var noteArr = notes[i].split('/')
		var dur = noteArr[2]
		var isDot = false
		if (dur.includes("r")) {
			dur = dur.replace("r", "");
		}
		if (dur.includes("d")) {
			dur = dur.replace("d", "");
			isDot = true;
		}
		var staveNote = new Vex.Flow.StaveNote({clef: "treble", keys: [noteArr[0] + '/' + noteArr[1]], duration: noteArr[2] })
		dur = 1 / parseInt(dur)
		if (isDot)
			dur = dur * 1.5

		if (accumDuration + dur > barDuration) {
			this.staveList[barNum].setTickables(tickables)
			tickables = []
			barNum++;
			accumDuration = dur
		} else {
			accumDuration += dur
		}

		tickables.push(staveNote);
	}
	
	if (tickables.length > 0 && barNum + 1 <= this.options.numberOfStaves) {
		this.staveList[barNum].setTickables(tickables)
	}
	this.redraw()
};

Vex.UI.Handler.prototype.numBars = 4;
Vex.UI.Handler.prototype.timeSignature = '4/4';

Vex.UI.Handler.prototype.changeBars = function(newNumBars) {
	//console.log("newBar", newNumBars);
	if (newNumBars > this.numBars) {
		for (var j = this.numBars; j < newNumBars; j ++) {
			this.staveList[j].setTickables([]);
			this.staveList[j].usable = true;
		}
		this.redraw();
	} else if (newNumBars < this.numBars) {
		var tickables = [];
		var durationOfRest = this.timeSignature.split('/')[1] + 'r';
		for (var i = 0; i < parseInt(this.timeSignature.split('/')[0]); i++) {
			tickables.push(new Vex.Flow.StaveNote({clef: "treble", keys: ["b/4"], duration: durationOfRest }));
		}
		// loop through to fill up the empty bars with rest
		for (var j = newNumBars; j < this.staveList.length; j ++) {
			this.staveList[j].setTickables(tickables);
			this.staveList[j].usable = false;
		}
		this.redraw();
	} else {
		// do nothing cuz no change
	}

	this.numBars = newNumBars;
};

Vex.UI.Handler.prototype.setTimeSignature = function(timeSignature) {
	for(var i = 0; i < this.staveList.length; i++){
		if ((i + 1) % 2 == 1) 
			this.staveList[i].setTimeSignature(timeSignature);
	}
	this.timeSignature = timeSignature;
	this.redraw();
};

Vex.UI.Handler.prototype.highlightNote = function(idx) {
	console.log("called with", idx)
	if (idx == 0) {
		this.staveList[0].getTickables()[0].setHighlight(true);
		this.redraw();
	} else {
		var currStave = 0;
		var currNumNotes = this.staveList[currStave].getTickables().length;
		while (idx > currNumNotes) {
			idx -= currNumNotes;
			currStave ++;
			currNumNotes = this.staveList[currStave].getTickables().length;
		}
		if (currNumNotes > idx)
			this.staveList[currStave].getTickables()[idx].setHighlight(true);
			this.redraw();
	}
};

// Vex.UI.Handler.prototype.disableEdit = function() {
// 	for (var i = 0; i < this.staveList.length; i++) {
// 		this.staveList[i].usable = false;
// 	}
// };

// Vex.UI.Handler.prototype.enableEdit = function() {
// 	for (var i = 0; i < this.staveList.length; i++) {
// 		this.staveList[i].usable = true;
// 	}
// };


// NoteMenu until line 755 ===============================================================================================================

Vex.UI.NoteMenu = function (handler, canvas, ctx) {
	this.handler = handler;
	this.canvas = canvas;
	this.ctx = ctx;
	this.note=null;
	this.keyIndex = null;
	this.panelProps = null;
	this.buttons = [];
	this.accidentals = ['doubleFlat', 'flat', 'natural', 'sharp', 'doubleSharp'];
	this.canRender = false;
	this.currentButton = null;
	this.buttonRenderer = new Vex.UI.NoteMenuButtonRenderer();
};

Vex.UI.NoteMenu.prototype.init = function() {
  // nothing to do atm
}

Vex.UI.NoteMenu.prototype.setTipArea = function() {
	var leftPadding = 5;
	var rightPadding = 5;
	var bottomPadding = 5;
	var fontSize = 10;//in pixels
	
	
	//Getting the dimensions of the bounding box
	var _x = this.panelProps.x + leftPadding; //5 pixels right of the beginning of the panel
	var _y = this.panelProps.bottomY - bottomPadding - fontSize; //15 pixels before the end of the panel (vertically)
	var _width = this.panelProps.width - leftPadding - rightPadding;
	var _height = fontSize - bottomPadding;
	
	this.handler.tipRenderer.boundingBox = {x: _x, y: _y, width: _width, height: _height};
	this.handler.tipRenderer.backgroundColor = this.panelProps.backgroundColor;
};

Vex.UI.NoteMenu.prototype.open = function(mousePos){
	
	this.panelProps = this.drawMenuPanel(mousePos);
	this.buttonRenderer.panel = this.panelProps;
	this.buttonRenderer.context = this.ctx;

	if(this.buttonRenderer.ready){
		this.drawButtons();
		this.canvas.addEventListener('mouseup', this, false);
		this.canvas.addEventListener('mousemove', this, false);
		this.canvas.addEventListener('contextmenu', this, false);
		this.setTipArea();	
	}

};

Vex.UI.NoteMenu.prototype.close = function(){
	this.buttons = [];
	this.currentButton = null;
	this.canvas.removeEventListener('mouseup', this, false);
	this.canvas.removeEventListener('mousemove', this, false);
	this.canvas.removeEventListener('contextmenu', this, false);
	//Notify the handler that the panel was closed, so that the usual behavior can resume
	this.handler.noteMenuClosed();
};

Vex.UI.NoteMenu.prototype.handleEvent = function(evt){
	evt.preventDefault();
	switch(evt.type) {
		case "mouseup":
			this.handleMouseClick(evt);
			break;
		case "mousemove":
			this.handleMouseMove(evt);
			break;
	}
};

Vex.UI.NoteMenu.prototype.setNote = function(note){
	this.note=note;
};

Vex.UI.NoteMenu.prototype.setKeyIndex = function(index){
	this.keyIndex=index;
};


/**
 * Draws the panel that will hold the buttons for modifying the note key.
 * @param mousePos
 * @returns a properties object of the panel.
 */
Vex.UI.NoteMenu.prototype.drawMenuPanel = function(mousePos) {
	var canvas = this.canvas;
	var panelWidth = 200;
	var panelHeight = 100;
	var panelX = mousePos.x + 30; // 30 - chosen offset
	var panelY = mousePos.y;
	var panelPosition = 'right'; //relative to the key
	
	//Check if the panel fits in X Axis
	if((panelX + panelWidth) * Vex.UI.scale > canvas.width){
		//Reposition panel X to fit canvas - repositioning it to be 30 pixels left from key
		panelX = mousePos.x - panelWidth - 30; //30 - chosen offset
		
		panelPosition = 'left';
	}
	
	// console.log("pannelY", panelY);
	// console.log("canvas height", canvas.height);
	//Check if the panel fits in Y Axis
	if((panelY + panelHeight) * Vex.UI.scale > canvas.height){
		//Reposition panel Y to fit canvas
		panelY = (canvas.height / Vex.UI.scale) - panelHeight - 10; //10 - chosen offset
	}
	console.log("pannelY", panelY);
	console.log("canvas height", canvas.height);
	
	//Draw the Panel.
	var context = this.ctx;

    context.beginPath();
    context.rect(panelX, panelY, panelWidth, panelHeight);
    context.fillStyle = '#ddc';
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
    
    
    //Draw a line to link the panel to the key
    context.beginPath();
    context.moveTo(mousePos.x, mousePos.y);
    if(panelPosition == 'right')
    	context.lineTo(panelX, panelY);
    else
    	context.lineTo(panelX + panelWidth, panelY);
    context.stroke();
    
    return {
    	width: panelWidth,
    	height: panelHeight,
    	x: panelX,
    	y: panelY,
    	rightX: panelX + panelWidth,
    	bottomY: panelY + panelHeight,
    	backgroundColor: '#ddc',
    	position: panelPosition
    };
};


Vex.UI.NoteMenu.prototype.drawButtons = function(){
	
	//Close button
	this.buttons.push(this.buttonRenderer.closeButton());
	
	//Accidentals buttons
	for(var i = 0; i < this.accidentals.length; i++){
		this.buttons.push(this.buttonRenderer.accidentalButton(i));
	}
	
	//Dot button
	this.buttons.push(this.buttonRenderer.dotButton());
	
	//Beam button
	this.buttons.push(this.buttonRenderer.beamButton());

	//Tie button
	//this.buttons.push(this.buttonRenderer.tieButton());
	
	//Delete button
	this.buttons.push(this.buttonRenderer.deleteButton());
};

Vex.UI.NoteMenu.prototype.handleMouseClick = function(evt){
	if(evt.button == 0){//Left Button
		//get mouse position
		var mousePos = getMousePositionInCanvas(this.canvas, evt);
		
		//if clicked in one of the buttons, then call the action for that button
		for(var i = 0; i<this.buttons.length; i++){
			var button = this.buttons[i];
			if(isCursorWithinRectangle(button.props.x, button.props.y, button.props.width, button.props.height, mousePos.x, mousePos.y)){
				//call button action.

				button.callAction(this);

				break;
			}
		}		
	}
};

Vex.UI.NoteMenu.prototype.handleMouseMove = function(evt){
	//get mouse position
	var mousePos = getMousePositionInCanvas(this.canvas, evt);
	
	
	for(var i = 0; i<this.buttons.length; i++){
		button =  this.buttons[i];
		
		if(isCursorWithinRectangle(button.props.x, button.props.y, button.props.width, button.props.height, mousePos.x, mousePos.y)){
			//cursor is in this button
			//check if already current button
			if(this.currentButton == null || this.currentButton != button){
				
				//It isnt! change the current button to normal, and highlight the new button
				
				if(this.currentButton !=null)
					this.currentButton.highlight(this.canvas, null);
				
				//Highlight new button
				
				this.currentButton = button;
				//highlight the button
				this.currentButton.highlight(this.canvas, 'yellow');
				this.handler.tipRenderer.showTip(this.currentButton.props.tip);
				
			}
			
			
			break;
				
		} else {
			//it isnt in this button, make sure it isnt highlighted
			button.highlight(this.canvas, null);
		}
		
	}

};

Vex.UI.NoteMenu.prototype.addDoubleFlat = function(){
	this.handler.addAccidentalToNote("bb", this.note, this.keyIndex);
	this.close();
};

Vex.UI.NoteMenu.prototype.addFlat = function(){
	this.handler.addAccidentalToNote("b", this.note, this.keyIndex);
	this.close();
};

Vex.UI.NoteMenu.prototype.addNatural = function(){
	this.handler.addAccidentalToNote("n", this.note, this.keyIndex);
	this.close();
};

Vex.UI.NoteMenu.prototype.addSharp = function(){
	this.handler.addAccidentalToNote("#", this.note, this.keyIndex);
	this.close();
};

Vex.UI.NoteMenu.prototype.addDoubleSharp = function(){
	this.handler.addAccidentalToNote("##", this.note, this.keyIndex);
	this.close();
};

Vex.UI.NoteMenu.prototype.addDot = function(){
	this.handler.addDotToNote(this.note);
	this.close();
};


Vex.UI.NoteMenu.prototype.addBeam = function(){
	this.handler.beamWithNextNote(this.note);
	this.close();
};


Vex.UI.NoteMenu.prototype.deleteNote = function(){
	this.handler.deleteNote(this.note);
	this.close();
}

// MouseListener until line 1027 ==========================================================================================================

/*
 * Vex.UI.MouseListener: this class is responsible for handling all mouse events performed by the user within the canvas
 */

Vex.UI.MouseListener = function(handler, canvas, staveList) {
	this.handler = handler;
	this.canvas = canvas;
	this.staveList = staveList;
};


Vex.UI.MouseListener.prototype.handleEvent = function(evt){
	evt.preventDefault();
	switch(evt.type) {
		case "mouseup":
			this.handleMouseClick(evt);
			break;
		case "mousemove":
			this.handleMouseOver(evt);
			break;
		case "wheel":
			this.handleMouseWheel(evt);
			break;
		case "contextmenu":
			this.handleRightMouseClick(evt);
			break;
		case "mouseleave":
			this.handleMouseLeave(evt);
			break;
	}
};

Vex.UI.MouseListener.prototype.startListening = function(){
	this.canvas.addEventListener('mouseup', this, false);
	this.canvas.addEventListener('mousemove', this, false);
	this.canvas.addEventListener('wheel', this, false);
	this.canvas.addEventListener('contextmenu', this, false);
	this.canvas.addEventListener("mouseleave", this, false);
};

Vex.UI.MouseListener.prototype.stopListening = function(){
	this.canvas.removeEventListener('mouseup', this, false);
	this.canvas.removeEventListener('mousemove', this, false);
	this.canvas.removeEventListener('wheel', this, false);
	this.canvas.removeEventListener('contextmenu', this, false);
	this.canvas.removeEventListener("mouseleave", this, false);
};

Vex.UI.MouseListener.prototype.handleMouseLeave = function(evt){
	// console.log("in mouseleave")
	// if(this.handler.currentNote != null){
	// 	console.log(this.handler.currentNote);
	// 	var idx = this.currentStave.getTickables().indexOf(this.handler.currentNote);
	// 	this.handler.currentStave.getTickables()[idx].setHighlight(false);
	// }
	this.handler.redraw();
}

Vex.UI.MouseListener.prototype.handleMouseOver = function(evt){
	var mousePos = getMousePositionInCanvas(this.canvas, evt);
	var temp = findWhichStaveMouseOver(this.staveList, mousePos);
	// if (this.handler.currentStave)
	// 	console.log("current stave idx", this.staveList.indexOf(this.handler.currentStave));
	// if (temp)
	// 	console.log("next stave idx", this.staveList.indexOf(temp));
	if (temp && this.handler.currentStave && temp != this.handler.currentStave) {
		this.handler.redraw();
	}
	this.handler.currentStave = temp;
	this.handler.currentNote = findWhichNoteMouseOver(this.handler.currentStave, mousePos);
	this.handler.updateProvisoryKey(mousePos);
	//change color of currentNote
	if(this.handler.currentNote != null){
		this.handler.currentNote.setHighlight(true);
		this.handler.redraw();
	}
    
	//Private function
	function findWhichStaveMouseOver(staveList, mousePos){
		for(var i = 0; i < staveList.length; i++){
			var box = staveList[i].getBoundingBox();
			if(isCursorWithinRectangle(box.getX(), box.getY(), box.getW(), box.getH(), mousePos.x, mousePos.y) && staveList[i].usable)
				return staveList[i];
		}
		return null;
	}
	
	//Private function
	function findWhichNoteMouseOver(currentStave, mousePos){
		var noteList = [];
		if(currentStave != null)
			noteList = currentStave.getTickables();
		
		for(var i = 0; i < noteList.length; i++){
			if (noteList[i] instanceof Vex.Flow.StaveNote) {
				//return to default color. Unnecessary if currentNote does not change color
				if(noteList[i].setHighlight !== undefined)
					noteList[i].setHighlight(false);
				var noteBox = noteList[i].getBoundingBox();
				var staveBox = currentStave.getBoundingBox();
				//Use the Notes X and the Stave's Y for the bounding box 
				if(isCursorWithinRectangle(noteBox.getX(), staveBox.getY(), noteBox.getW(), staveBox.getH(), mousePos.x, mousePos.y))
					return noteList[i];
			}
		}
		return null;
	}
};


Vex.UI.MouseListener.prototype.handleMouseClick = function(evt){
	switch (evt.button) {
    case 0:
        this.handleLeftMouseClick(evt);
        break;
    case 1:
    	this.handleMiddleMouseClick(evt);
        break;
    case 2:
    	  //this.handleRightMouseClick(evt);
        break;
    default:
        alert('You have a strange Mouse!');
	}
	
	
};

Vex.UI.MouseListener.prototype.handleMouseWheel = function(evt){
	var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || evt.deltaY)));
	if(this.handler.currentNote!=null){
		var dur = this.handler.currentNote.duration;
		var isAlias = Vex.Flow.durationAliases[dur] !== undefined;
		if (isAlias){
			dur = Vex.Flow.durationAliases[dur];
		}
		if (delta>0)dur*=2;
		else dur/=2;
		
		if (dur<1) dur = 1;
		dur = "" + dur; //to string
		var newNote = this.handler.currentNote.clone({duration: dur});
		
		this.handler.currentStave.replaceTickable(this.handler.currentNote,newNote);
		this.handler.currentNote = newNote;
		this.handler.currentNote.setHighlight(true);
		this.handler.redraw();
	} else if(this.handler.provisoryTickable!=null){
		if(this.handler.provisoryTickable instanceof Vex.Flow.StaveNote){
			var dur = this.handler.provisoryTickable.duration;
			var isAlias = Vex.Flow.durationAliases[dur] !== undefined;
			if (isAlias){
				dur = Vex.Flow.durationAliases[dur];
			}
			if (delta>0)dur*=2;
			else dur/=2;
			
			if (dur<1) dur = 1;
			dur = "" + dur; //to string
			
			this.handler.updateProvisoryDuration(dur);
		}else if(this.handler.provisoryTickable instanceof Vex.Flow.BarNote){
			//See Vex.Flow.Barline.type. Types go from 1 to 6 (7 is Barline.type.NONE).
			var newType = ((this.handler.provisoryTickable.type + 5 + delta) % 6) + 1;
			this.handler.provisoryTickable.setType(newType);
			
			this.handler.drawProvisoryTickable();
		}else if(this.handler.provisoryTickable instanceof Vex.Flow.ClefNote){
			switch(this.handler.provisoryTickable.clefKey){
				case "treble":
					//Switch to bass
					this.handler.provisoryTickable.clefKey = "bass";
					this.handler.provisoryTickable.setClef("bass");
					break;
				case "bass":
					//For now, switch back to treble. later, we will use other types of clefs
					this.handler.provisoryTickable.clefKey = "treble";
					this.handler.provisoryTickable.setClef("treble");
			}


			this.handler.drawProvisoryTickable();
			
		}
	}
		
};

Vex.UI.MouseListener.prototype.handleLeftMouseClick = function(evt){
	if(this.handler.currentStave!=null && this.handler.currentStave.usable){
		//Find out the note representing the place clicked by the user
		var mousePos = getMousePositionInCanvas(this.canvas, evt);
		
		//Clicking cases:
		//Case 1: clicked a stave, but not into a note bounding box
		if(this.handler.currentNote==null){
			//This case inserts a note into the current stave, based on which position the user clicked
			
			var previousNote = getLastTickableBeforeXPosition(this.handler.currentStave, mousePos.x);
			//Find out the note immediately after the mouse X position
			var nextNote = getFirstTickableAfterXPosition(this.handler.currentStave, mousePos.x);
			
			//The provisory Note is now added in the stave list
			var newNote = this.handler.provisoryTickable.clone();
			//Add the note into the stave
			this.handler.currentStave.insertTickableBetween(newNote, previousNote, nextNote);
			
			//Redraw the stave
			this.handler.redraw(true);
			
		} else{
			//Case 2: clicked direclty into a note
			var clickedKeyName = NoteMap.getNoteName(this.handler.currentStave, mousePos);
			
			var keyIndex = this.handler.currentNote.indexOfKey(clickedKeyName);
			
			if(keyIndex == -1){
				//Case 2.1: Clicked a Key the Current note doesn't have
				
				//We should modify the current note to add new Key
				var newKeys = this.handler.currentNote.keys;
				newKeys.push(clickedKeyName);
				var oldNote = this.handler.currentNote;
				var newNote = oldNote.clone({ keys: newKeys});
				this.handler.currentStave.replaceTickable(oldNote, newNote);
				this.handler.currentNote = newNote;
				//Redraw the stave
				this.handler.redraw();

			}/*else{
				//no actions to be done here, since we passed the menu to the right click 
				//Case 2.2: Clicked a Key the current note already has

			}*/
		}
		
		
	}
};

Vex.UI.MouseListener.prototype.handleMiddleMouseClick = function(evt){
	//Middle mouse button is responsible for changing the provisory Tickable type
	var tickable = this.handler.provisoryTickable;
	var newType = null;
	
	if(tickable instanceof Vex.Flow.StaveNote){
		if(tickable.noteType == "n")
			newType = Vex.UI.TickableType.REST;
		else
			newType = Vex.UI.TickableType.BAR;
	} else if (tickable instanceof Vex.Flow.BarNote)
		newType = Vex.UI.TickableType.NOTE;
	
	this.handler.updateProvisoryType(newType);
};


Vex.UI.MouseListener.prototype.handleRightMouseClick = function(evt){
	if(this.handler.currentStave!=null){
		//Find out the note representing the place clicked by the user
		if(this.handler.currentNote!=null){
			var mousePos = getMousePositionInCanvas(this.canvas, evt);
			var clickedKeyName = NoteMap.getNoteName(this.handler.currentStave, mousePos);
				
			//We should render a toolbox for modifying current key.
			this.handler.openMenuForKey(clickedKeyName, mousePos);
		}
	}
};

// VexflowExtension until line 1551 =============================================================================================================
/*
 * New attibutes and methods to be used by the UI classes.
 */

/*
 * Vex.Flow.Stave extensions 
 */

Vex.Flow.Stave.prototype.tickables = [];

Vex.Flow.Stave.prototype.beams = [];

Vex.Flow.Stave.prototype.usable = true;

Vex.Flow.Stave.prototype.setTickables = function(tickables) {
	this.tickables = tickables;
};

Vex.Flow.Stave.prototype.getTickables = function() {
	return this.tickables;
};

Vex.Flow.Stave.prototype.getNotes = function() {
	var notes = [];
	
	for ( var i = 0; i < this.tickables.length; i++) {
		var tickable = this.tickables[i];
		if(tickable instanceof Vex.Flow.StaveNote)
			notes.push(tickable);
	}
	return notes;
};

Vex.Flow.Stave.prototype.insertTickableBetween = function(newTickable, previousTickable, nextTickable) {

	if(newTickable instanceof Vex.Flow.ClefNote){
		//If the stave has no clef modifiers, then add it. 
		if(this.getClefModifierIndex() < 0){
			this.addClef(newTickable.clefKey);
			return;
		}
		//If the stave already has a clef, but the user clicked before any other tickable, then replace the stave clef
		else if(previousTickable == null){
			this.replaceClef(newTickable.clefKey);
			return;
		}
		//Else add it as a normal ClefNote as long as the stave already has notes, so leave otherwise
		else if(this.getNotes().length == 0)
			return;
			
			
	} else if(newTickable instanceof Vex.Flow.BarNote){
		//If the BarNote is to be inserted after everything, then modify the end bar of the stave
		if(nextTickable == null){
			this.setEndBarType(newTickable.type);
			return;
		}
		//Else add it as a normal BarNote as long as the stave already has notes, so leave otherwise
		else if(this.getNotes().length == 0)
			return;
	}

	// if (previousTickable) {
	// 	if (previousTickable.getModifiers('annotations')[0].text == "L") 
	// 		newTickable.addModifier(0, new Vex.Flow.Annotation('R'));
	// 	else 
	// 		newTickable.addModifier(0, new Vex.Flow.Annotation('L'));
	// } else {
	// 	if (nextTickable) {
	// 		if (nextTickable.getModifiers('annotations')[0].text == "L") 
	// 			newTickable.addModifier(0, new Vex.Flow.Annotation('R'));
	// 		else 
	// 			newTickable.addModifier(0, new Vex.Flow.Annotation('L'));
	// 	} else {
	// 			newTickable.addModifier(0, new Vex.Flow.Annotation('L'));
	// 	}
	// }

	if (nextTickable==null) {
			this.pushTickable(newTickable);
	} else {
		var referenceIndex = this.tickables.indexOf(nextTickable);
		this.tickables.splice(referenceIndex, 0, newTickable);	
	}
};

Vex.Flow.Stave.prototype.getClefModifierIndex = function(){
	//Remove all clefs currently in the stave
	for(var i = 0; i < this.modifiers.length; i++){
		var modifier = this.modifiers[i];

		if(modifier instanceof Vex.Flow.Clef)
			return i;

	}
	return -1;

}

Vex.Flow.Stave.prototype.replaceClef = function(clef){
	var start_X= this.start_x ;
	this.clef = clef;
	var modifier = new Vex.Flow.Clef(clef);
	this.modifiers.splice(this.getClefModifierIndex(), 1);
	this.glyphs = [];
	this.addClef(clef);

	this.start_x = start_X;
}

Vex.Flow.Stave.prototype.getPreviousTickable = function(referenceTickable){
	var referenceIndex = this.tickables.indexOf(referenceTickable);
	if (referenceIndex == 0) return null;
	return this.tickables[referenceIndex-1];
};

Vex.Flow.Stave.prototype.getNextTickable = function(referenceTickable){
	var referenceIndex = this.tickables.indexOf(referenceTickable);
	if (referenceIndex == this.tickables.length - 1) return null;
	return this.tickables[referenceIndex+1];
};

Vex.Flow.Stave.prototype.getNextNote = function(referenceNote){
	var referenceIndex = this.tickables.indexOf(referenceNote);
	while(referenceIndex < this.tickables.length){
		referenceIndex++;
		if(this.tickables[referenceIndex] instanceof Vex.Flow.StaveNote)
			return this.tickables[referenceIndex];
	}
		
	return null;
};

Vex.Flow.Stave.prototype.replaceTickable = function(oldTickable,newTickable){
	//Replacing note in beam.
	if(oldTickable.beam!=null){
		var beam = oldTickable.beam;
		var referenceIndex = beam.tickables.indexOf(oldTickable);
		beam.notes[referenceIndex]=newTickable;
	}
	
	var referenceIndex = this.tickables.indexOf(oldTickable);
	this.tickables[referenceIndex]=newTickable;
};

Vex.Flow.Stave.prototype.removeTickable = function(tickable){
	this.tickables.splice(this.tickables.indexOf(tickable), 1);
}

Vex.Flow.Stave.prototype.pushTickable = function(newTickable){
	this.tickables.push(newTickable);
};

Vex.Flow.Stave.prototype.beams = [];

Vex.Flow.Stave.prototype.setBeams = function(beamList) {
	this.beams = beamList;
};

Vex.Flow.Stave.prototype.getBeams = function() {
	return this.beams;
};


Vex.Flow.Stave.prototype.pushBeam = function(newBeam){
	this.beams.push(newBeam);
};


/*
 * Vex.Flow.StaveNote extensions
 */
/**
 * @param keyName The name of the Key
 * @returns the index of the key in the Note, or -1 if it doesn't contain the key
 */
Vex.Flow.StaveNote.prototype.indexOfKey = function(keyName){
	return this.keys.indexOf(keyName);
};

Vex.Flow.StaveNote.prototype.letter = "R";


Vex.Flow.StaveNote.prototype.getPlayEvents = function(playInfo){
	//Prepare the notes to be sent
	var notes = [];
	
	for(var i = 0; i < this.keys.length; i++){
		notes.push(MIDI.keyToNote[this.keys[i].replace('/','')]);
	}

	//Set clef offset for notes
	for (var i = 0; i < notes.length; i++) {
		notes[i] += Vex.UI.ClefOffsets[playInfo.clef];
	};

	var keyPressTime = playInfo.defaultTime / this.duration;

	//Set the modifiers for this note (update note value)
	for (var i = 0; i < this.modifiers.length; i++) {
		var modifier = this.modifiers[i];
		if(modifier instanceof Vex.Flow.Accidental){
			var modValue;

			switch(modifier.type){
				case "bb":
				modValue = -2;
				break;
				case "b":
				modValue = -1;
				break;
				case "n":
				modValue = 0;
				break;
				case "#":
				modValue = 1;
				break;
				case "##":
				modValue = 2;
				break;
			}

			notes[modifier.index] += modValue;
		}else if(modifier instanceof Vex.Flow.Dot){
			keyPressTime *= 1.5;
		}
		

	};

	//	velocity is set as 127
	
	
	
	var events = [];
	

	events.push({
		type: 'channel',
		channel: 0,
		subtype: notes.length==1?'noteOn':'chordOn',
		noteNumber: notes.length==1?notes[0]:notes,
		velocity: 127,
		queuedTime: playInfo.delay,
		note: this
	});
	events.push({
		type: 'channel',
		channel: 0,
		subtype: notes.length==1?'noteOff':'chordOff',
		noteNumber: notes.length==1?notes[0]:notes,
		queuedTime: playInfo.delay + keyPressTime,
		note: this
	});

	
	//increment the delay 
	playInfo.delay = playInfo.delay + keyPressTime;
	
	return events;
};


//TODO Clone Ties
Vex.Flow.StaveNote.prototype.clone = function(newProps){
	var currentProps = {
			keys: this.keys,
			stem_direction: this.getStemDirection(),
			duration: this.duration,
			noteType: this.noteType
	} ;
	
	
	var mergedProps = mergeProperties(currentProps, newProps);
	mergedProps.duration = mergedProps.duration + mergedProps.noteType;
	
	var newNote = new Vex.Flow.StaveNote(mergedProps);
	
	//Setting the style as the same style as the note head
	newNote.setStyle(this.note_heads[0].style);
	 
	
	
	if(this.modifierContext!=null && this.getDots()!=null)
		newNote.addDotToAll();
	
	newNote.beam = this.beam;
	
	//Clone modifiers
	for (var i = 0; i < this.modifiers.length; i++) {
		if(this.modifiers[0] instanceof Vex.Flow.Accidental){
			newNote.addAccidental(this.modifiers[i].index, new Vex.Flow.Accidental(this.modifiers[i].type));
		}
		
	};

	return newNote;
};

Vex.Flow.StaveNote.prototype.setHighlight = function(highlight){
	if(highlight)
		this.setStyle(Vex.UI.highlightNoteStyle);
	else
		this.setStyle(Vex.UI.defaultNoteStyle);
};

/**
 * Return new note, from actions:
 * "UP"		=> up on stave
 * "DOWN"	=> down on stave
 * "SHARP"	=> add sharp
 * @param action
 * @returns
 */
Vex.Flow.StaveNote.prototype.change = function(action){
	var newKeys = new Array();
	//for each key
	for (var k in this.keys){
		var splitted = this.keys[k].split("/");
		splitted[0] = splitted[0].toUpperCase();
		//first char is the note
		var note = splitted[0].substring(0,1);
		var accidentals = splitted[0].substring(1);
		var octave = parseInt(splitted[1]);
		
		//search index of key in NoteMap.noteMap
		var index = 0;
		for (var x in NoteMap.noteMap){
			if (NoteMap.noteMap[x] == note){
				index = x;
				break;
			}
		}
		
		//do the ACTION
		if (action == "UP") //increment key
			index++; 
		else if (action == "DOWN") //descrease key
			index--;
		else if (action == "SHARP"){
		//TODO add other cases
			switch (accidentals){
				case "":
				case null:
				case undefined:
					accidentals = "#";
					break;
				case "#":
					accidentals = "##";
					break;
			}
			alert(accidentals);
		}
		//octave changes
		if (index == NoteMap.noteMap.length){
			index = 0;
			octave++;
		}else if (index < 0){
			index = NoteMap.noteMap.length-1;
			octave--;
		}
		//push new key
		note = NoteMap.noteMap[index];
		newKeys.push(note + accidentals+"/"+octave);
	}
	var dur = this.duration;
	var type = this.noteType;
	if (action == "PAUSE"){
		if (type == "n") type = "r";
		else if (type == "r") type = "n";
		dur = Vex.Flow.parseNoteDurationString(this.duration);
		var dots = "";
		for (var i=0;i<dur.dots;i++) dots+="d";
		dur = dur.duration+dots+type;
	}
	//create new note with new parameters
	return this.clone({keys: newKeys, duration:dur });
};

/*
 * Override the original draw flag to fix the color being drawed
 */
Vex.Flow.StaveNote.prototype.drawFlag = function(){
	if (!this.context) throw new Vex.RERR("NoCanvasContext",
	"Can't draw without a canvas context.");
	var ctx = this.context;
	var glyph = this.getGlyph();
	var render_flag = this.beam === null;
	var bounds = this.getNoteHeadBounds();

	var x_begin = this.getNoteHeadBeginX();
	var x_end = this.getNoteHeadEndX();

	if (glyph.flag && render_flag) {
		var note_stem_height = this.stem.getHeight();
		var flag_x, flag_y, flag_code;

		if (this.getStemDirection() === Vex.Flow.Stem.DOWN) {
			// Down stems have flags on the left.
			flag_x = x_begin;
			flag_y = bounds.y_top - note_stem_height;
			flag_code = glyph.code_flag_downstem;

		} else {
			// Up stems have flags on the left.
			flag_x = x_end;
			flag_y = bounds.y_bottom - note_stem_height;
			flag_code = glyph.code_flag_upstem;
		}

		//NOTE: The 2 lines below were added to the original code
		var ctxFillStyle = ctx.fillStyle; 
		ctx.fillStyle = this.note_heads[0].style.fillStyle;
		
		// Draw the Flag
		ctx.openGroup('flag', null, { pointerBBox: true });
		this.applyStyle(ctx, this.getFlagStyle() || false);
		this.flag.render(ctx, flag_x, flag_y);
		this.restoreStyle(ctx, this.getFlagStyle() || false);
		ctx.closeGroup();

		//NOTE: The 2 lines below were added to the original code
		//Reverting style
		ctx.fillStyle = ctxFillStyle;
	}
};
	

/*
 * Vex.Flow.Dot extensions
 */

/*
 * Overriding the Draw method so that the dot stops going up at every draw call
 */
Vex.Flow.Dot.prototype.draw= function() {
    if (!this.context) throw new Vex.RERR("NoContext",
      "Can't draw dot without a context.");
    if (!(this.note && (this.index != null))) throw new Vex.RERR("NoAttachedNote",
      "Can't draw dot without a note and index.");

    var line_space = this.note.stave.options.spacing_between_lines_px;

    var start = this.note.getModifierStartXY(this.position, this.index);

    // Set the starting y coordinate to the base of the stem for TabNotes
    if (this.note.getCategory() === 'tabnotes') {
      start.y = this.note.getStemExtents().baseY;
    }

    var dot_x = (start.x + this.x_shift) + this.width - this.radius;
    //This next commented line is the original Draw
    //var dot_y = start.y + this.y_shift + (this.dot_shiftY * line_space);
    //This next line is the modified Draw
    var dot_y = start.y + this.y_shift;
    var ctx = this.context;

    ctx.beginPath();
    ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
};

/*
 * Barnote Extensions
 */
Vex.Flow.BarNote.prototype.clone = function(){
	var newBarNote = new Vex.Flow.BarNote();
	newBarNote.setType(this.getType());
	newBarNote.setStave(this.getStave());
	newBarNote.setTickContext(this.getTickContext());
	return newBarNote;
};

Vex.Flow.BarNote.prototype.getPlayEvents = function(playInfo, currentEvents){
	var newEvents = [];

	function markBeginRepeatIndex(){
		//mark current index as repeating point
		playInfo.beginRepeatIndex = currentEvents.length + newEvents.length;
	}

	function addRepeatEvents(){
		//Add all events since repeat index
		for(var i = playInfo.beginRepeatIndex || 0; i < currentEvents.length; i++){
			newEvents.push(currentEvents[i]);
		}
	}

	switch(this.type){
		case Vex.Flow.Barline.type.REPEAT_BEGIN:		
			markBeginRepeatIndex();
		break;
		case Vex.Flow.Barline.type.REPEAT_END:
			addRepeatEvents();
		break;
		case Vex.Flow.Barline.type.REPEAT_BOTH:
			addRepeatEvents();
			markBeginRepeatIndex();
		break;
	}

	return newEvents;
}

/*
 * ClefNote Extensions
 */

Vex.Flow.ClefNote.prototype.clone = function (){
	var newClef = new Vex.Flow.ClefNote(this.clefKey);
	newClef.clefKey = this.clefKey;
	newClef.setTickContext(new Vex.Flow.TickContext());
	newClef.getTickContext().setX(this.getTickContext().getX());
	return newClef;
};


Vex.Flow.ClefNote.prototype.getPlayEvents = function (playInfo){
	//update current clef
	playInfo.clef = this.clefKey;
	return [];
};

// Util until line 1670 =====================================================================================================================

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getStyle(el,styleProp)
{
	var y = null;
	var x = document.getElementById(el);
	if (x.currentStyle)
		y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)
		y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
};

function getMousePositionInCanvas(canvas, evt) {
	//pegando apenas os valores de border e padding (eliminando coisas como cor e caracteres de pixel 'px'
	var border = getStyle(canvas.id, 'border-left-width');
	var borderValue = border!=null?border.substring(0, border.indexOf(border.match(/\D/))):0;
	var padding = getStyle(canvas.id, 'padding-left');
	var paddingValue = padding!=null?padding.substring(0, padding.indexOf(padding.match(/\D/))):0;
	var rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left - borderValue - paddingValue) / Vex.UI.scale,
		y: (evt.clientY - rect.top - borderValue - paddingValue) / Vex.UI.scale,
	};
};

function getAbsoluteMousePositionInCanvas(canvas, evt) {
	//pegando apenas os valores de border e padding (eliminando coisas como cor e caracteres de pixel 'px'
	var border = getStyle(canvas.id, 'border-left-width');
	var borderValue = border!=null?border.substring(0, border.indexOf(border.match(/\D/))):0;
	var padding = getStyle(canvas.id, 'padding-left');
	var paddingValue = padding!=null?padding.substring(0, padding.indexOf(padding.match(/\D/))):0;
	var rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left - borderValue - paddingValue),
		y: (evt.clientY - rect.top - borderValue - paddingValue),
	};
};


function isCursorWithinRectangle(x, y, width, height, mouseX, mouseY) {
    if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {
        return true;
    }
    return false;
};

function getFirstTickableAfterXPosition(stave, x){
	var note = null;
	
	for(var i = 0;  i<stave.getTickables().length; i++ ){
		if(x < stave.getTickables()[i].getAbsoluteX())
			note = stave.getTickables()[i];
		if(note!=null)
			break;
	}
	
	return note;
};

function getLastTickableBeforeXPosition(stave, x){
	var note = null;
	
	for(var i = stave.getTickables().length - 1;  i>=0; i-- ){
		if(x > stave.getTickables()[i].getAbsoluteX())
			note = stave.getTickables()[i];
		if(note!=null)
			break;
	}
	
	return note;
};

/**
 * 
 * @param obj1 The first object
 * @param obj2 The second object
 * @returns A new object representing the merged objects. If both objects passed as param have the same prop, then obj2 property is returned.
 */
function mergeProperties(obj1,obj2){
	var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function getStemDirection(stave, y){
	var reference = stave.getYForLine(2);
	
	if(y<reference)
		return Vex.Flow.StaveNote.STEM_DOWN;
	else
		return Vex.Flow.StaveNote.STEM_UP;
};

// Notemap until line 1717 ====================================================================================================
Vex.UI.NoteMap = function(){
	this.noteMap = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
};

Vex.UI.NoteMap.prototype.getNoteName = function(stave, mousePos){
	//Step 1: get mouse position relative to the stave
	var relativeMouseY = mousePos.y - stave.getBoundingBox().getY();
	
	//Step 2: get in which space within the staves the user clicked
	//using half the space between lines because we can click between a line (each line can hold 2 notes)
	var noteArea = Math.round(relativeMouseY / (stave.options.spacing_between_lines_px/2));
	
	//Step 3: use the map to get the note Name
	return this.toNoteName(noteArea, stave);
};

Vex.UI.NoteMap.prototype.toNoteName = function(noteArea, stave){
	var baseNote = this.getBaseNote(stave);
	var baseNoteValue = this.noteMap.indexOf(baseNote.note);
	
	var desiredNoteValue = (baseNoteValue - noteArea) % 7;
	//make it a positive value
	while (desiredNoteValue < 0) desiredNoteValue+=7;
	
	var desiredNoteOctave = baseNote.octave - (Math.floor(noteArea / 7));
	
	if( (desiredNoteValue == 5 || desiredNoteValue == 6))
		desiredNoteOctave--;
	
	return this.noteMap[desiredNoteValue] + '/' + desiredNoteOctave;
};

/**
  * For now, it seems the easiest way to map notes is to consider them as always in the treble clef.
  * For playing purposes, we are using Vex.UI.ClefOffsets to find out the correct note.
  */
Vex.UI.NoteMap.prototype.getBaseNote = function(stave){
	
	return {note:'G', octave: 6}; // represents 4 lines above the treble clef
	
};


//Init the variable, so that it can be used globally
var NoteMap = new Vex.UI.NoteMap();

// TipRenderer until line 1780==========================================================================================================
/**
 * Class responsible for rendering tips in the canvas.
 */

Vex.UI.TipRenderer = function(canvas){
	this.canvas = canvas;
	this.color = null;
	this.fontSize = null;
	this.fontName = null;
	this.style = null;
	this.context = null;
	this.lineWidth = null;
	this.textAlign = null;
	this.textBaseline = null;
	this.boundingBox= null;
	this.showingTip = null;
	this.backgroundColor = null;
};

Vex.UI.TipRenderer.prototype.init = function(){
	this.textAlign='left';
	this.textBaseline = 'middle';
	this.color = 'black';
	this.fontName = 'Calibri';
	this.lineWidth = 1;
	this.style = 'normal';
	this.fontSize = 10;
	this.boundingBox = {x:0,y:0,width:200,height:20};
	this.context = this.canvas.getContext('2d');
	this.showingTip = false;
	this.backgroundColor = 'white';
};


Vex.UI.TipRenderer.prototype.showTip = function(tip){
	
	if(this.showingTip)
		this.hideTip();
	
	var font = this.style + ' ' + this.fontSize + 'pt ' + this.fontName;
	
	this.context.font = font;
	this.context.fillStyle = this.color;
	this.context.textAlign = this.textAlign;
	this.context.lineWidth = this.lineWidth;
	this.context.textBaseline = this.textBaseline;
	this.context.fillText(tip, this.boundingBox.x, this.boundingBox.y);
	this.showingTip=true;
};


//TOOD needed to add this absolute (-5 and +10) values to be able to fully erase the written tip. FIX!
Vex.UI.TipRenderer.prototype.hideTip = function(){
	
	this.context.beginPath();
	this.context.rect(this.boundingBox.x, this.boundingBox.y - 5, this.boundingBox.width, this.boundingBox.height + 10);
	this.context.fillStyle = this.backgroundColor;
	this.context.fill();
	
	this.showingTip = false;
};

//NoteMenuButtonRenderer until line 2091 =========================================================================================
Vex.UI.NoteMenuButtonRenderer = function (panel, context){
	this.ready = false;
	var renderer = this;
	//Load Resources
	this.menuButtonsImg = new Image();
	this.menuButtonsImg.src = 'https://cdn.jsdelivr.net/gh/R-D-D-D/Ground-Zero/web_frontend/src/resources/noteMenuButtons.gif';
	this.menuButtonsImg.onload = function(){renderer.ready=true};
};

Vex.UI.NoteMenuButtonRenderer.prototype.closeButton = function (){
	var panelProps = this.panel;
	var context = this.context;
	
	
	var offset = 5; //offset between panel boundaries and button boundaries
	var drawingOffset = 4; //offset between button boundaries and the X for the close
	var buttonWidth = 15;
	var buttonX = panelProps.rightX - buttonWidth - offset; 
	var buttonY = panelProps.y + offset; 
	
	//Button Panel
	 context.beginPath();
	 context.rect(buttonX, buttonY, buttonWidth, buttonWidth);
	 context.fillStyle = 'red';
	 context.fill();
	 
	 //Button Content (the X)
	 context.beginPath();
	 context.lineWidth = 3;
	 //Part 1: the \
	 context.moveTo(buttonX + drawingOffset, buttonY + drawingOffset);
	 context.lineTo(buttonX + buttonWidth - drawingOffset, buttonY + buttonWidth - drawingOffset);
	 //Part 2: the /
	 context.moveTo(buttonX + drawingOffset, buttonY + buttonWidth - drawingOffset);
	 context.lineTo(buttonX + buttonWidth - drawingOffset, buttonY + drawingOffset);
	 context.strokeStyle = 'white';
	 context.stroke();
	 
	 return new Vex.UI.Button({
		 backgroundColor: 'red',
		 width: buttonWidth,
		 height: buttonWidth,
		 x: buttonX,
		 y: buttonY,
		 rightX: buttonX + buttonWidth,
		 bottomY: buttonY + buttonWidth,
		 name: 'closeButton',
		 action: 'close',
		 tip: 'Close the menu'
	 });
};

Vex.UI.NoteMenuButtonRenderer.prototype.closeButton = function (){
	var panelProps = this.panel;
	var context = this.context;
	
	
	var offset = 5; //offset between panel boundaries and button boundaries
	var drawingOffset = 4; //offset between button boundaries and the X for the close
	var buttonWidth = 15;
	var buttonX = panelProps.rightX - buttonWidth - offset; 
	var buttonY = panelProps.y + offset; 
	
	//Button Panel
	 context.beginPath();
	 context.rect(buttonX, buttonY, buttonWidth, buttonWidth);
	 context.fillStyle = 'red';
	 context.fill();
	 
	 //Button Content (the X)
	 context.beginPath();
	 context.lineWidth = 3;
	 //Part 1: the \
	 context.moveTo(buttonX + drawingOffset, buttonY + drawingOffset);
	 context.lineTo(buttonX + buttonWidth - drawingOffset, buttonY + buttonWidth - drawingOffset);
	 //Part 2: the /
	 context.moveTo(buttonX + drawingOffset, buttonY + buttonWidth - drawingOffset);
	 context.lineTo(buttonX + buttonWidth - drawingOffset, buttonY + drawingOffset);
	 context.strokeStyle = 'white';
	 context.stroke();
	 
	 return new Vex.UI.Button({
		 backgroundColor: 'red',
		 width: buttonWidth,
		 height: buttonWidth,
		 x: buttonX,
		 y: buttonY,
		 rightX: buttonX + buttonWidth,
		 bottomY: buttonY + buttonWidth,
		 name: 'closeButton',
		 action: 'close',
		 tip: 'Close the menu'
	 });
};

Vex.UI.NoteMenuButtonRenderer.prototype.accidentalButton = function (index) {
	var panelProps = this.panel;
	var context = this.context;
	var imageObj = this.menuButtonsImg;
	
	//Position of each accidental:
	var positions = [400,100,200,0,300];
	//Actions of each Accidental
	var actions = ['addDoubleFlat', 'addFlat', 'addNatural', 'addSharp', 'addDoubleSharp'];
	var tips = ['Add double flat to key', 'Add flat to key', 'Add natural to key', 'Add sharp to key', 'Add double sharp to key'];

	var initialOffsetX = 10; //offset between 1st button and paenl
	var offSetX = 5; // offset between buttons
	var offSetY = 10;

	//Source Specs
	var sourceX = positions[index];
	var sourceY = 0;
	var sourceWidth = 100;
	var sourceHeight = 100;

	//Destination Specs
	var destWidth = 25;
	var destHeight = destWidth;

	var destX = panelProps.x + initialOffsetX + index * (offSetX + destWidth);

	var destY = panelProps.y + offSetY;

	context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

	return new Vex.UI.Button({
		backgroundColor: 'white',
		x: destX,
		y: destY,
		rightX: destX + destWidth,
		bottomY: destY + destHeight,
		width: destWidth,
		height: destHeight,
		action: actions[index],
		tip: tips[index]
	});
};

Vex.UI.NoteMenuButtonRenderer.prototype.dotButton = function(){
	var panelProps = this.panel;
	var context = this.context;
	var imageObj = this.menuButtonsImg;
	
	//Position of each dot button in the sprite:
	var position = 700;

	var initialOffsetX = 10; //offset between 1st button and paenl
	//var offSetX = 5; // offset between buttons
	var offSetY = 10;

	//Source Specs
	var sourceX = position;
	var sourceY = 0;
	var sourceWidth = 100;
	var sourceHeight = 100;

	//Destination Specs
	var destWidth = 25;
	var destHeight = destWidth;

	var destX = panelProps.x + initialOffsetX;

	// 2 * offSetY + destHeight=> because its the 2nd row of buttons
	var destY = panelProps.y + (2 * offSetY) + destHeight;

	context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

	return new Vex.UI.Button({
		backgroundColor: 'white',
		x: destX,
		y: destY,
		rightX: destX + destWidth,
		bottomY: destY + destHeight,
		width: destWidth,
		height: destHeight,
		action: 'addDot',
		tip: 'Add dot to key'
	});
};

Vex.UI.NoteMenuButtonRenderer.prototype.beamButton = function (){
	var panelProps = this.panel;
	var context = this.context;
	var imageObj = this.menuButtonsImg;
	
	//Position of each dot button in the sprite:
	var position = 500;

	var initialOffsetX = 10; //offset between 1st button and paenl
	var offSetX = 5; // offset between buttons
	var offSetY = 10;

	//Source Specs
	var sourceX = position;
	var sourceY = 0;
	var sourceWidth = 100;
	var sourceHeight = 100;

	//Destination Specs
	var destWidth = 25;
	var destHeight = destWidth;
	
	//1 * (offSetX + destWidth) because its the 2nd button in the row.
	var destX = panelProps.x + initialOffsetX + (offSetX + destWidth);

	// 2 * offSetY + destHeight=> because its the 2nd row of buttons
	var destY = panelProps.y + (2 * offSetY) + destHeight;

	context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

	return new Vex.UI.Button({
		backgroundColor: 'white',
		x: destX,
		y: destY,
		rightX: destX + destWidth,
		bottomY: destY + destHeight,
		width: destWidth,
		height: destHeight,
		action: 'addBeam',
		tip: 'Beam with next note'
	});
};

Vex.UI.NoteMenuButtonRenderer.prototype.deleteButton = function(){
	var panelProps = this.panel;
	var context = this.context;
	var imageObj = this.menuButtonsImg;
	
	//Position of each dot button in the sprite:
	var position = 800;

	var initialOffsetX = 10; //offset between 1st button and paenl
	var offSetX = 5; // offset between buttons
	var offSetY = 10;

	//Source Specs
	var sourceX = position;
	var sourceY = 0;
	var sourceWidth = 100;
	var sourceHeight = 100;

	//Destination Specs
	var destWidth = 25;
	var destHeight = destWidth;
	
	//1 * (offSetX + destWidth) because its the 4nd button in the row.
	var destX = panelProps.x + initialOffsetX + 3*(offSetX + destWidth);

	// 2 * offSetY + destHeight=> because its the 2nd row of buttons
	var destY = panelProps.y + (2 * offSetY) + destHeight;

	context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

	return new Vex.UI.Button({
		backgroundColor: 'white',
		x: destX,
		y: destY,
		rightX: destX + destWidth,
		bottomY: destY + destHeight,
		width: destWidth,
		height: destHeight,
		action: 'deleteNote',
		tip: 'Remove key'
	});
};

Vex.UI.NoteMenuButtonRenderer.prototype.tieButton = function(){
	var panelProps = this.panel;
	var context = this.context;
	var imageObj = this.menuButtonsImg;
	
	//Position of each dot button in the sprite:
	var position = 600;

	var initialOffsetX = 10; //offset between 1st button and paenl
	var offSetX = 5; // offset between buttons
	var offSetY = 10;

	//Source Specs
	var sourceX = position;
	var sourceY = 0;
	var sourceWidth = 100;
	var sourceHeight = 100;

	//Destination Specs
	var destWidth = 25;
	var destHeight = destWidth;
	
	//1 * (offSetX + destWidth) because its the 3nd button in the row.
	var destX = panelProps.x + initialOffsetX + 2*(offSetX + destWidth);

	// 2 * offSetY + destHeight=> because its the 2nd row of buttons
	var destY = panelProps.y + (2 * offSetY) + destHeight;

	context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

	return new Vex.UI.Button({
		backgroundColor: 'white',
		x: destX,
		y: destY,
		rightX: destX + destWidth,
		bottomY: destY + destHeight,
		width: destWidth,
		height: destHeight,
		action: 'addTie',
		tip: 'Tie with next note'
	});
};

// Button ==================================================================================================================
/**
 * Class representing a button.
 */

Vex.UI.Button = function(props){
	this.props = props;
};


Vex.UI.Button.prototype.highlight = function (canvas, color){
		//If color == null remove highlight
		if(color==null)
			color = button.props.backgroundColor;
		var lineWidth = 4;
		var context = canvas.getContext('2d');
		context.beginPath();
		context.lineWidth = lineWidth;
		context.rect(button.props.x, button.props.y, button.props.width, button.props.height);
		context.strokeStyle = color;
		context.stroke();
};

//TODO Implement showTip
Vex.UI.Button.prototype.showTip = function () {
	
};

Vex.UI.Button.prototype.callAction = function (object) {
	object[this.props.action]();
};

Vex.UI.TickableType = {
	NOTE : "note",
	REST : "rest",
	BAR : "bar",
	CLEF : "clef"
};

export default Vex