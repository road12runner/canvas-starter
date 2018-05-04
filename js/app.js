console.log('hello');

var Desktop = {Top: 0, Left: 0, Bottom: 153, Right: 241};

var template = {
	width: Desktop.Right - Desktop.Left,
	height: Desktop.Bottom - Desktop.Top
};

var canvas = document.getElementById('ssg-canvas');
var ctx = canvas.getContext('2d');
console.log(ctx.canvas.width, ctx.canvas.height);

var middlePoint = {
	x: ctx.canvas.width / 2 ,
	y: ctx.canvas.height / 2
};

//ctx.fillRect(middlePoint.x, middlePoint.y, 2, 2);

template.x = middlePoint.x - template.width / 2;
template.y = middlePoint.y - template.height / 2;


var card = {
	x : template.x - 20,
	y : template.y - 20,
	rotate: 0,
	height: template.height + 40,
	width: template.width + 40
};





var cardImage = new Image();
cardImage.src = 'https://uat.serversidegraphics.com/PCS/API/v1/designers/689b8821-897b-4c92-9d47-2d9bc76d8e35/Images/17236.Jpg';
// cardImage.onload = function() {
// 	ctx.drawImage(this, card.x, card.y, card.width, card.height);
//
//
// 	roundRect(ctx, template.x -1 , template.y - 1 , template.width + 1 , template.height + 1, 6);
// };

var templateImage = new Image();
templateImage.src = 'https://uat.serversidegraphics.com/PCS/API/v1/designers/689b8821-897b-4c92-9d47-2d9bc76d8e35/Templates/11993.png';
// templateImage.onload = function () {
// 	ctx.drawImage(this, template.x, template.y, template.width, template.height);
// };


setTimeout( drawCard, 2000);


// if (Modernizr.touch) {
// 	$doodleCanvas.on("touchstart", startDrawing);
// 	$doodleCanvas.on("touchend", stopDrawing);
// 	$doodleCanvas.on("touchmove", keepDrawing);
// }


canvas.addEventListener('mousedown', startEvent);
canvas.addEventListener('mousemove', keepEvent);
canvas.addEventListener('mouseup', finishEvent);

var isMoving = false;
var isScaling = false;

var moveCoords = null;
function  startEvent(e) {
	isMoving = true;
	var pos = getPosition(e);
	console.log('startEvent', pos);
	moveCoords = pos;


	var hitLeftTopCorner = (pos.x >= card.x - 5 && pos.x <= card.x + 5) && (pos.y >= card.y - 5 && pos.y <= card.y + 5);
	isScaling = hitLeftTopCorner == true;
	if (isScaling) {
		isMoving = false;
	}

	//todo if inside of card

	console.log(hitLeftTopCorner);
}


function  keepEvent(e) {
	if (isMoving) {
		//console.log('keepEvent', getPosition(e));
		var newCoords = getPosition(e);
		var deltaX =  newCoords.x - moveCoords.x;
		var deltaY = newCoords.y - moveCoords.y;

		card.x += deltaX;
		card.y += deltaY;
		console.log(card);
		drawCard();

		moveCoords = newCoords;
	}

	if (isScaling) {
		//console.log('keepEvent', getPosition(e));
		var newCoords = getPosition(e);
		var deltaX =  newCoords.x - moveCoords.x;
		var deltaY = newCoords.y - moveCoords.y;
		console.log(deltaX, deltaY);

		card.rotate -= getAngle(card.x + deltaX, card.y + deltaY, newCoords.x, newCoords.y);


		card.x += deltaX;
		card.y += deltaY;
		card.width -= deltaX;
		card.height -= deltaY;
		console.log(card);




		drawCard();

		moveCoords = newCoords;
	}


}

function  finishEvent(e) {
	isMoving = false;
	isScaling = false;
	console.log('finishEvent',e);
}

function getPosition(event) {

	var rect = event.currentTarget.getBoundingClientRect();
	var eventX = event.touches ? event.touches[0].clientX : event.clientX;
	var eventY = event.touches ? event.touches[0].clientY : event.clientY;
	return {
		x: eventX - rect.left,
		y: eventY - rect.top
	};
}



function drawCard() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//	if (card.rotate !== 0) {
		ctx.save();
		ctx.translate(card.x + card.width/2, card.y + card.height /2);
		ctx.rotate(10 * Math.PI/180);
		ctx.drawImage(cardImage, -card.width/2,-card.height/2, card.width, card.height);
		ctx.restore();
	// } else {
	// 	ctx.drawImage(cardImage, card.x, card.y, card.width, card.height);
	// }

	ctx.drawImage(templateImage, template.x, template.y, template.width, template.height);
	roundRect(ctx, template.x -1 , template.y - 1 , template.width + 1 , template.height + 1, 6);
	roundRect(ctx, card.x -1 , card.y - 1 , card.width + 1 , card.height + 1, 2);
	//draw circle
	ctx.beginPath();
	ctx.arc(card.x - 1, card.y - 2, 5, 0 , 2*Math.PI);
	ctx.stroke();
	//draw circle
	ctx.beginPath();
	ctx.arc(card.x + card.width - 1, card.y - 2, 5, 0 , 2*Math.PI);
	ctx.stroke();


	ctx.beginPath();
	ctx.moveTo(card.x + card.width/2 , card.y);
	ctx.lineTo(card.x + card.width/2 , card.y - 30);
	ctx.stroke();

	//draw circle
	ctx.beginPath();
	ctx.arc(card.x + card.width /2, card.y - 30, 5, 0 , 2*Math.PI);
	ctx.stroke();


}


function getAngle( cX, cY, mX, mY ){
	var angle = Math.atan2(mY - cY, mX - cX);
	return angle;
}

function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}

}



