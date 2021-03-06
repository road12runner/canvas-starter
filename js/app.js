

var Desktop = {Top: 0, Left: 0, Bottom: 153, Right: 241};

var template = {
	width: Desktop.Right - Desktop.Left,
	height: Desktop.Bottom - Desktop.Top
};

var canvas = document.getElementById('ssg-canvas');
var ctx = canvas.getContext('2d');


var middlePoint = {
	x: ctx.canvas.width / 2 ,
	y: ctx.canvas.height / 2
};

//ctx.fillRect(middlePoint.x, middlePoint.y, 2, 2);

template.x = middlePoint.x - template.width /2;
template.y = middlePoint.y - template.height /2;

window.requestAnimationFrame(drawCard);

var ACTIONS = {
	NOTHING: 'nothing',
	ROTATION: 'rotation',
	SCALING: 'scaling',
	MOVING: 'moving'
};

var card = {
	selected: true,
	action: ACTIONS.NOTHING,
	borderColor: 'rgb(49, 183, 219)',
	x : template.x - 20,
	y : template.y - 20,
	imageLoaded: false,
	rotation: 0,
	height: template.height + 40,
	width: template.width + 40,
	origHeight: template.height + 40,
	origWidth: template.width + 40,
	hoverCorners: {
		leftTop: false,
		rightTop: false,
		leftBottom: false,
		rightBottom: false,
		rotatePoint: false
	},
	getOriginPoint: function() {
		return {
			x: this.x + this.width /2,
			y: this.y + this.height /2
		}
	},
	getLeftTopCorner: function() {
		if (this.rotation === 0) {
			return {
				x: this.x,
				y: this.y
			}
		} else {

			var pointOffset = {
				x: this.x - this.getOriginPoint().x,
				y: this.y - this.getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = this.rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians),

			};
			
			return {
				x: rotatePoint.x + this.getOriginPoint().x,
				y: rotatePoint.y + this.getOriginPoint().y
			};
		}
	},
	getRightTopCorner: function() {
		if (this.rotation === 0) {
			return {
				x: this.x + this.width,
				y: this.y
			}
		} else {
			var pointOffset = {
				x: this.x + this.width - this.getOriginPoint().x,
				y: this.y - this.getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = this.rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + this.getOriginPoint().x,
				y: rotatePoint.y + this.getOriginPoint().y
			};
		}
	},
	getLeftBottomCorner: function() {
		if (this.rotation === 0) {
			return {
				x: this.x,
				y: this.y + this.height
			}
		} else {
			var pointOffset = {
				x: this.x - this.getOriginPoint().x,
				y: this.y + this.height - this.getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = this.rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + this.getOriginPoint().x,
				y: rotatePoint.y + this.getOriginPoint().y
			};
		}
	},
	getRightBottomCorner: function() {
		if (this.rotation === 0) {
			return {
				x: this.x + this.width,
				y: this.y + this.height
			}
		} else {
			var pointOffset = {
				x: this.x + this.width - this.getOriginPoint().x,
				y: this.y + this.height - this.getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = this.rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + this.getOriginPoint().x,
				y: rotatePoint.y + this.getOriginPoint().y
			};
		}
	},
	getRotationPoint: function() {

		if (this.rotation === 0) {
			return {
				x: this.x + this.width/2,
				y: this.y - 30
			}
		} else {
			var pointOffset = {
				x: this.x + this.width /2 - this.getOriginPoint().x,
				y: this.y  - 30 - this.getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = this.rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + this.getOriginPoint().x,
				y: rotatePoint.y + this.getOriginPoint().y
			};
		}
		
	},
	render: function(ctx) {
		if (!this.imageLoaded) {
			return;
		}
		var originX = this.x + this.width/2;
		var originY = this.y + this.height /2;
		ctx.save();
		ctx.translate(originX, originY);
		if (this.rotation !== 0) {
			ctx.rotate( this.rotation * Math.PI/180);
		}
		ctx.globalAlpha = 0.4;
		ctx.drawImage(this.img, - this.width / 2,- this.height / 2, this.width, this.height);
		ctx.globalAlpha = 1;
		
		
		
		if (this.selected) {
			// draw border
			ctx.strokeStyle = this.borderColor;
			roundRect(ctx, - this.width / 2,- this.height / 2, this.width, this.height, 2);
			
			// draw left top corner
			
			ctx.beginPath();
			ctx.arc( - this.width / 2,- this.height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = this.hoverCorners.leftTop ? this.borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			// draw right top corner
			ctx.beginPath();
			ctx.arc(  this.width / 2,- this.height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = this.hoverCorners.rightTop? this.borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			
			//draw left bottom corner
			ctx.beginPath();
			ctx.fillStyle = this.hoverCorners.leftBottom? this.borderColor : 'white';
			ctx.arc(  -this.width / 2, this.height / 2, 5, 0 , 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			
			
			//draw right bottom corner
			ctx.beginPath();
			ctx.arc(  this.width / 2, this.height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = this.hoverCorners.rightBottom? this.borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			//draw rotation point
			ctx.beginPath();
			ctx.moveTo(0 , -this.height /2 );
			ctx.lineTo(0 , -this.height / 2 - 30);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(  0 , -this.height / 2 - 30, 5, 0 , 2*Math.PI);
			ctx.fillStyle = this.hoverCorners.rotatePoint? this.borderColor : 'white';
			ctx.fill();
			ctx.stroke();
		}
		
		ctx.restore();
		ctx.save();

		
		roundRect(ctx, template.x, template.y, template.width, template.height);
		ctx.clip();
		
		
		ctx.translate(originX, originY);
		
		if (this.rotation !== 0) {
			ctx.rotate( this.rotation * Math.PI/180);
		}
		
		ctx.drawImage(this.img, - this.width / 2,- this.height / 2, this.width, this.height);
		
		ctx.restore();
		
		// console.log(ctx.isPointInPath(template.x, template.y));
		// console.log(ctx.isPointInPath(template.x + template.width, template.y));
		// console.log(ctx.isPointInPath(template.x, template.y + template.height));
		// console.log(ctx.isPointInPath(template.x + template.width, template.y + template.height));

		
		// var cardRotatePoint = card.getRotationPoint();
		// ctx.translate(cardRotatePoint.x, cardRotatePoint.y);
		// ctx.rotation(Math.PI/4);
		//
		// ctx.beginPath();
		// ctx.arc( 0 , 0, 5, 0 , 2*Math.PI);
		// ctx.stroke();
		//
		// //ctx.drawImage(cardImage, -card.width/2,-card.height/2, card.width, card.height);
		// roundRect(ctx, - card.width / 2, - card.height / 2, card.width, card.height, 2);
		
	},
	setImage: function(url) {
		var that = this;
		that.img = new Image();
		that.img.crossOrigin = 'Anonymous';
		that.img.src = url;
		that.img.onload = function() {
			that.imageLoaded = true;
		}
	},
	hitTest: function(pos) {
		// in case mouse within  the card area move card
		// in case mouse is corners - scale
		// do rotation
	},
	hover: function(pos) {
		
		if (!this.selected) {
			return;
		}
		// just to highlight corners
		if (this.action === ACTIONS.NOTHING) {
			
			this.hoverCorners.leftTop = isInside(pos, this.getLeftTopCorner());
			this.hoverCorners.rightTop = isInside(pos, this.getRightTopCorner());
			this.hoverCorners.leftBottom = isInside(pos, this.getLeftBottomCorner());
			this.hoverCorners.rightBottom = isInside(pos, this.getRightBottomCorner());
			this.hoverCorners.rotatePoint = isInside(pos, this.getRotationPoint());
		}else if (this.action === ACTIONS.SCALING) {

			var centerPoint = this.getOriginPoint();
			var dx1 = Math.abs(centerPoint.x - this.mousePos.x);
			var dy1 = Math.abs(centerPoint.y - this.mousePos.y);

			var dx2 = Math.abs(centerPoint.x - pos.x);
			var dy2 = Math.abs(centerPoint.y - pos.y);



			var deltaX =  dx1 - dx2;
			var deltaY = dy1 - dy1;

			card.x +=  deltaX;
			card.y +=  deltaY;

			var ratio = this.width / this.height;
			card.width -=  deltaX *2;
			card.height -= deltaX * 2 / ratio;

			this.mousePos = pos;
			
		} else if (this.action === ACTIONS.ROTATION) {
			var oldAngle = getMyAngle(this.mousePos, this.getOriginPoint());
			var angle = getMyAngle(pos, this.getOriginPoint());
			this.rotation += angle - oldAngle;
			
			this.mousePos = pos;
			
		} else if(this.action === ACTIONS.MOVING) {
			
			var deltaX =  pos.x - this.mousePos.x;
			var deltaY = pos.y - this.mousePos.y;
			
			card.x += deltaX;
			card.y += deltaY;
			
			this.mousePos = pos;
		}
	},
	pinch: function(e){
		if (!this.touchPinch) {
			this.touchPinch = e.scale;
		} else {
			
			var delta = 1 - (this.touchPinch - e.scale);
			var newWidth = card.width * delta;
			var newHeight = card.height * delta;
			card.width = newWidth;
			card.height = newHeight;
			//drawCard();
			this.touchPinch = e.scale;
		}
	},
	rotate: function(e){
		if (!this.touchRotate) {
			this.touchRotate = e.angle;
		} else {
			
			var delta = this.touchRotate - e.angle;
			card.rotation += delta;
			this.touchRotate = e.angle;
			//drawCard();
			$('#hammer-container').append( 'angle: ' + delta).append('<br>');
			
		}
	},

	onClick: function(pos) {
		
		
		if (this.hoverCorners.leftTop
			|| this.hoverCorners.leftBottom
			|| this.hoverCorners.rightTop
			|| this.hoverCorners.rightBottom) {
			this.action = ACTIONS.SCALING;
			this.mousePos = pos;
		} else if (this.hoverCorners.rotatePoint) {
			this.action = ACTIONS.ROTATION;
			this.mousePos = pos;
		} else if (pos.x >= this.x && pos.x <= this.x + this.width
			&& pos.y >= this.y && pos.y <= this.y + this.height) {
			this.action = ACTIONS.MOVING;
			this.mousePos = pos;
		} else {
			this.action = ACTIONS.NOTHING;
		}
 	
		console.log(this.action);
	},
	onFinish: function() {
		this.action = ACTIONS.NOTHING;
	}
};

function isInside(pos, area) {
	return (pos.x >= area.x - 5 && pos.x <= area.x + 5)
	&& (pos.y >= area.y - 5 && pos.y <= area.y + 5)
}





var cliparts = [];


card.setImage('https://uat.serversidegraphics.com/PCS/API/v1/designers/689b8821-897b-4c92-9d47-2d9bc76d8e35/Images/17236.Jpg');


// var cardImage = new Image();
// cardImage.src = 'https://uat.serversidegraphics.com/PCS/API/v1/designers/689b8821-897b-4c92-9d47-2d9bc76d8e35/Images/17236.Jpg';
// cardImage.onload = function() {
// 	ctx.drawImage(this, card.x, card.y, card.width, card.height);
//
//
// 	roundRect(ctx, template.x -1 , template.y - 1 , template.width + 1 , template.height + 1, 6);
// };

var templateImage = new Image();
templateImage.crossOrigin = 'Anonymous';
templateImage.src = 'https://uat.serversidegraphics.com/PCS/API/v1/designers/689b8821-897b-4c92-9d47-2d9bc76d8e35/Templates/11993.png';
// templateImage.onload = function () {
// 	ctx.drawImage(this, template.x, template.y, template.width, template.height);
// };


//setTimeout( drawCard, 2000);


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
	moveCoords = getPosition(e);
	
	var selectedObject = null;
	// check if pos in selected object
	var selectedObjects = cliparts.filter(function(clipart){
		return clipart.isSelected() && clipart.hitTest(moveCoords);
	});
	
	if (selectedObjects.length === 1) {
		selectedObject = selectedObjects[0];
	} else {
		
		var innerObjectSelected = false;
		// look for object at pos
		for(var i = cliparts.length -1; i >= 0; i--) {
			if (!innerObjectSelected && cliparts[i].hitTest(moveCoords)) {
				selectedObject = cliparts[i];
				cliparts[i].setSelected(true);
			} else {
				cliparts[i].setSelected(false);
			}
		}
		
	}
	
	if (selectedObject) {
		card.selected = false;
		selectedObject.onClick(moveCoords)
	} else {
		card.selected = true;
		card.onClick(moveCoords);
	}
	
	//drawCard();
	
	// var cardLeftTopCorner = card.getLeftTopCorner();
	// var hitLeftTopCorner = (moveCoords.x >= cardLeftTopCorner.x - 5 && moveCoords.x <= cardLeftTopCorner.x + 5) && (moveCoords.y >= cardLeftTopCorner.y - 5 && moveCoords.y <= cardLeftTopCorner.y + 5);
	

	//var hitLeftTopCorner = (pos.x >= card.x - 5 && pos.x <= card.x + 5) && (pos.y >= card.y - 5 && pos.y <= card.y + 5);
	//var hitLeftTopCorner = (pos.x >= rotatePoint.x - 5 && pos.x <= rotatePoint.x + 5) && (rotatePoint.y >= card.y - 5 && pos.y <= rotatePoint.y + 5);
	// isScaling = hitLeftTopCorner == true;
	// if (isScaling) {
	// 	isMoving = false;
	// 	//clickAngle = getAngle( card.getRotationPoint().x, card.getRotationPoint().y, moveCoords.x, moveCoords.y  ) - card.rotation;
	// 	clickAngle = getMyAngle(moveCoords, card.getRotationPoint());
	// 	console.log('clickAngle', clickAngle);
	// }



	//console.log(hitLeftTopCorner);
}


function  keepEvent(e) {
	var newCoords = getPosition(e);
	
	
	card.hover(newCoords);
	
	cliparts.forEach( function(clipart){
		clipart.hover(newCoords)
	});
	
	//drawCard();
	
	// if (isMoving) {
	// 	//console.log('keepEvent', getPosition(e));
	//
	// 	var deltaX =  newCoords.x - moveCoords.x;
	// 	var deltaY = newCoords.y - moveCoords.y;
	//
	// 	card.x += deltaX;
	// 	card.y += deltaY;
	// 	//console.log(card);
	// 	drawCard();
	//
	// 	moveCoords = newCoords;
	// }
	//
	// if (isScaling) {
	// 	//console.log('keepEvent', getPosition(e));
	// 	var newCoords = getPosition(e);
	// 	var deltaX =  newCoords.x - moveCoords.x;
	// 	var deltaY = newCoords.y - moveCoords.y;
	// 	console.log(deltaX, deltaY);
	//
	// 	//card.rotation -= getAngle(card.x + deltaX, card.y + deltaY, newCoords.x, newCoords.y);
	//
	// 	//var angle =   getAngle( card.x + deltaX, card.y + deltaY, newCoords.x, newCoords.y  );
	// 	//var dx = newCoords.x - card.getRotationPoint().x;
	// 	//var dy = newCoords.y - card.getRotationPoint().y;
	// 	//var angle = Math.atan2(deltaY, deltaX);
	//
	// 	// var angle = getAngle(card.getRotationPoint().x, card.getRotationPoint().y, newCoords.x, newCoords.y);
	// 	// console.log('angle', angle, angle - clickAngle);
	// 	//card.rotation  = (angle - clickAngle);
	//
	// 	var angle = getMyAngle(newCoords, card.getRotationPoint());
	// 	console.log(angle, angle - clickAngle);
	// 	card.rotation  += (angle - clickAngle) * 2;
	//
	// 	clickAngle = angle;
	//
	// 	card.x += deltaX;
	// 	card.y += deltaY;
	// 	card.width -= deltaX;
	// 	card.height -= deltaY;
	//
	//
	//
	//
	// 	drawCard();
	//
	// 	moveCoords = newCoords;
	// }


}
function getMyAngle(point, center) {
	var theta = Math.atan2(point.y - center.y, point.x - center.x);
	return theta * 180 / Math.PI;
	//return theta;
	
}

function  finishEvent(e) {
	
	card.onFinish();
	
	cliparts.forEach( function(clipart){
		clipart.onFinish();
	});
	
	isMoving = false;
	isScaling = false;
	//console.log('finishEvent',e);
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

var rotatePoint;

function drawCard() {
	//clear canvas
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	// rotatePoint= {
	// 	x: (card.x) * Math.cos(10 * Math.PI / 180) -  (card.y) * Math.sin(10 * Math.PI/180),
	// 	y: (card.y ) * Math.cos(10 * Math.PI / 180) +  (card.x) * Math.sin(10 * Math.PI/180),
	//
	// };
	
	// Newx = x * cos(theta) - y * sin(theta)
	// Newy = x * sin(theta) + y * cos(that)
	
	// rotatePoint= {
	// 	x: (card.x) * Math.cos(Math.PI / 4) -  (card.y) * Math.sin(Math.PI/4),
	// 	y: (card.x ) * Math.sin(Math.PI / 4) +  (card.y) * Math.cos( Math.PI/4),
	//
	// };
	// //console.log(card.getRotationPoint());
	//
	// var pointOffset = {
	// 	x: card.x - card.getRotationPoint().x,
	// 	y: card.y - card.getRotationPoint().y
	// };
	//
	// //console.log(pointOffset);
	// rotatePoint= {
	// 	x: (pointOffset.x) * Math.cos(Math.PI / 4) -  (pointOffset.y) * Math.sin(Math.PI/4),
	// 	y: (pointOffset.x ) * Math.sin(Math.PI / 4) +  (pointOffset.y) * Math.cos( Math.PI/4),
	//
	// };
	//
	// //console.log(rotatePoint);
	//
	// var afterRotate = {
	// 	x: rotatePoint.x + card.getRotationPoint().x,
	// 	y: rotatePoint.y + card.getRotationPoint().y
	// };
	
	//console.log(afterRotate);
	
	
	if (checkOverlap(template, card)) {
		ctx.font = "12px Arial";
		ctx.fillText("Overlap",10,10);
	}
	
	cliparts.forEach(function(clipart){
		if (clipart.testCoverage()) {
			ctx.font = "12px Arial";
			ctx.fillText("Overlap",10,10);
		}
	});
	
	
	var cardPolygon = [
		card.getLeftTopCorner(),
		card.getRightTopCorner(),
		card.getRightBottomCorner(),
		card.getLeftBottomCorner()
	];
	
	var templatePolygon = [
		{x: template.x, y: template.y},
		{x: template.x + template.width, y: template.y},
		{x: template.x + template.width, y: template.y + template.height},
		{x: template.x, y: template.y + template.height}
	];
	
	
	//var result = rectCollide(card.rotation, card, template);
	//console.log('intersect', result);
	var vertices  = getVertices(card);
	//console.log('vertices', vertices);
	vertices  = [
		card.getLeftBottomCorner(),
		card.getLeftTopCorner(),
		card.getRightTopCorner(),
		card.getRightBottomCorner()
	];
	//console.log('vertices', vertices);
//	console.log('vertices to lines', verticesToLines(vertices));


	// var card1 = {
	// 	x: 174,
	// 	y: 156,
	// 	width: 255,
	// 	height: 191,
	// 	rotation: 0,
	// 	origWidth: 255
	// };
	//
	// var template1 = {
	// 	x: 151,
	// 	y: 205,
	// 	width: 402 - 151,
	// 	height: 368 - 205
	// };
//	vertices  = getVertices(card1);
// 	console.log('noverlap', !noOverlap(vertices, template));
// 	console.log('allinside', !allInside(vertices, template));
// 	console.log('insersect', !linesIntersect(vertices, template));
	// if (!noOverlap(vertices, template)) {
	// 	ctx.font = "12px Arial";
	// 	ctx.fillText("Overlap",10,10);
	// }

	//y' = y*cos(a) + x*sin(a), x' = - y*sin(a) + x*cos(a)
	
	// rotatePoint= {
	// 	y: (card.y ) * Math.cos(10 * Math.PI/180) +  (card.x) * Math.sin(10 * Math.PI/180),
	// 	x: -(card.y) * Math.sin(10 * Math.PI/180) +  (card.x) * Math.cos(10 * Math.PI/180)
	// };
	
	//console.log(card, rotatePoint);
	
	
	// //draw circle
	// ctx.beginPath();
	// ctx.arc( afterRotate.x , afterRotate.y, 5, 0 , 2*Math.PI);
	// ctx.stroke();
	//
	// //draw circle
	// ctx.beginPath();
	// ctx.arc( card.getRotationPoint().x , card.getRotationPoint().y, 5, 0 , 2*Math.PI);
	// ctx.stroke();
	//
	//
	// ctx.beginPath();
	// ctx.arc( card.x , card.y, 5, 0 , 2*Math.PI);
	// ctx.stroke();

	// if (card.rotation !== 0) {
	// 	ctx.save();
	// 	var cardRotatePoint = card.getRotationPoint();
	// 	ctx.translate(cardRotatePoint.x, cardRotatePoint.y);
	// 	ctx.rotate(Math.PI/4);
	//
	// 	ctx.beginPath();
	// 	ctx.arc( 0 , 0, 5, 0 , 2*Math.PI);
	// 	ctx.stroke();
	//
	// 	//ctx.drawImage(cardImage, -card.width/2,-card.height/2, card.width, card.height);
	// 	roundRect(ctx, - card.width / 2, - card.height / 2, card.width, card.height, 2);
	// 	ctx.restore();
	//
	//
	//
	//
	//
	//
	// } else {
	// 	//console.log(card, template);
	// 	//ctx.drawImage(cardImage, card.x, card.y, card.width, card.height);
	// }
	
	//ctx.drawImage(cardImage, card.x, card.y, card.width, card.height);
	
	card.render(ctx);
	
	

	ctx.drawImage(templateImage, template.x, template.y, template.width, template.height);
	
	
	cliparts.forEach( function(clipart){
		clipart.render(ctx);
	});


	//roundRect(ctx, template.x - 1 , template.y - 1  , template.width + 1 , template.height + 1, 6);
	//draw circle
	// ctx.beginPath();
	// ctx.arc(card.x + card.width - 1, card.y - 2, 5, 0 , 2*Math.PI);
	// ctx.stroke();
	//
	//
	// ctx.beginPath();
	// ctx.moveTo(card.x + card.width/2 , card.y);
	// ctx.lineTo(card.x + card.width/2 , card.y - 30);
	// ctx.stroke();
	//
	// //draw circle
	// ctx.beginPath();
	// ctx.arc(card.x + card.width /2, card.y - 30, 5, 0 , 2*Math.PI);
	// ctx.stroke();
	
	window.requestAnimationFrame(drawCard);


}


function checkOverlap(inner, outer) {
	
	var innerPoints = getCoordinates(inner);
	var outerPoints = getCoordinates(outer);
	
	
	var result = innerPoints.leftTop.x >= outerPoints.leftTop.x
		&& innerPoints.leftTop.x <= outerPoints.rightTop.x
		&& innerPoints.rightTop.x >= outerPoints.leftTop.x
		&& innerPoints.rightTop.x <= outerPoints.rightTop.x
		&& innerPoints.leftTop.y >= outerPoints.leftTop.y
		&& innerPoints.leftTop.y <= outerPoints.leftBottom.y
		&& innerPoints.leftBottom.y >= outerPoints.leftTop.y
		&& innerPoints.leftBottom.y <= outerPoints.leftBottom.y;
	
	return !result;
}

function getCoordinates(obj) {
	if (obj.getLeftTopCorner) {
		return {
			leftTop: obj.getLeftTopCorner(),
			rightTop: obj.getRightTopCorner(),
			leftBottom: obj.getLeftBottomCorner(),
			rightBottom: obj.getRightBottomCorner()
		}
	} else {
		return {
			leftTop : {x: obj.x, y: obj.y},
			rightTop: {x: obj.x + obj.width, y: obj.y},
			leftBottom:{x: obj.x, y: obj.y + obj.height},
			rightBottom:{x: obj.x + obj.width, y: obj.y + obj.height},
		};
		
	}
}



function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke === 'undefined') {
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

/**
* Helper function to determine whether there is an intersection between the two polygons described
* by the lists of vertices. Uses the Separating Axis Theorem
*
* @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
* @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
* @return true if there is any intersection between the 2 polygons, false otherwise
*/
function doPolygonsIntersect (a, b) {
	var polygons = [a, b];
	var minA, maxA, projected, i, i1, j, minB, maxB;
	
	for (i = 0; i < polygons.length; i++) {
		
		// for each polygon, look at each edge of the polygon, and determine if it separates
		// the two shapes
		var polygon = polygons[i];
		for (i1 = 0; i1 < polygon.length; i1++) {
			
			// grab 2 vertices to create an edge
			var i2 = (i1 + 1) % polygon.length;
			var p1 = polygon[i1];
			var p2 = polygon[i2];
			
			// find the line perpendicular to this edge
			var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
			
			minA = maxA = undefined;
			// for each vertex in the first shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			for (j = 0; j < a.length; j++) {
				projected = normal.x * a[j].x + normal.y * a[j].y;
				if (isUndefined(minA) || projected < minA) {
					minA = projected;
				}
				if (isUndefined(maxA) || projected > maxA) {
					maxA = projected;
				}
			}
			
			// for each vertex in the second shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			minB = maxB = undefined;
			for (j = 0; j < b.length; j++) {
				projected = normal.x * b[j].x + normal.y * b[j].y;
				if (isUndefined(minB) || projected < minB) {
					minB = projected;
				}
				if (isUndefined(maxB) || projected > maxB) {
					maxB = projected;
				}
			}
			
			// if there is no overlap between the projects, the edge we are looking at separates the two
			// polygons, and we know there is no overlap
			if (maxA < minB || maxB < minA) {
				CONSOLE("polygons don't intersect!");
				return false;
			}
		}
	}
	return true;
}

function isUndefined (val) {
	return val === undefined;
}

function rectCollide(angle, rP, rQ) {
	// Calling arguments similar to a C implementation by Oren Becker
	// but different algorithm for detecting rectangle intersection.
	// angle gives rotation of the first rectangle around its left side's
	// midpoint.  The second rectangle is unrotated, aligned to axes.
	
	var xPmin, xPmax, yPmin, yPmax, xQmin, xQmax, yQmin, yQmax;
	
	if ( angle === 0 ) {
		xPmin = rP.x;
		yPmin = rP.y;
		xQmin = rQ.x;
		yQmin = rQ.y;
		xPmax = xPmin + rP.width;
		yPmax = yPmin + rP.height;
		xQmax = xQmin + rQ.width;
		yQmax = yQmin + rQ.height;
		
		return ( xPmin > xQmax || xQmin > xPmax || yPmin > yQmax || yQmin > yPmax ) ? false : true;
	}
	
	// Otherwise we need two trigonometric function calls
	var c = Math.cos(angle * Math.PI / 180), s = Math.sin(angle * Math.PI);
	var cPos = ( c > 0.0 ), sPos = ( s > 0.0 );
	
	/* Phase 1: Form bounding box on tilted rectangle P.
	 *          Check whether bounding box and Q intersect.
	 *          If not, then P and Q do not intersect.
	 *          Otherwise proceed to Phase 2.
	 */
	
	var xPdif, yPdif, xPctr, yPctr, cxPdf, sxPdf, cyPdf, syPdf;
	
	xPdif = 0.5 * rP.width;
	yPdif = 0.5 * rP.height;
	
	/* P rotates around the midpoint of its left side. */
	cxPdf = c * xPdif;
	sxPdf = s * xPdif;
	xPctr = rP.x + cxPdf;
	yPctr = rP.y + sxPdf + yPdif;
	
	cyPdf = c * yPdif;
	syPdf = s * yPdif;
	
	/* Translate coordinates of Q so P is re-centered at origin. */
	xQmin = rQ.x - xPctr;
	yQmin = rQ.y - yPctr;
	xQmax = xQmin + rQ.width;
	yQmax = yQmin + rQ.height;
	
	/* Compute the bounding box coordinates for P. */
	if ( cPos )
		if ( sPos ) {
			xPmax = cxPdf + syPdf;
			xPmin = -xPmax;
			
			yPmax = cyPdf + sxPdf;
			yPmin = -yPmax;
		} else  /* s <= 0.0 */ {
			xPmax = cxPdf - syPdf;
			xPmin = -xPmax;
			
			yPmax = cyPdf - sxPdf;
			yPmin = -yPmax;
		}
	else  /* c <= 0.0 */ if ( sPos ) {
		xPmin = cxPdf - syPdf;
		xPmax = -xPmin;
		
		yPmin = cyPdf - sxPdf;
		yPmax = -yPmin;
	} else  /* s <= 0.0 */ {
		xPmin = cxPdf + syPdf;
		xPmax = -xPmin;
		
		yPmin = cyPdf + sxPdf;
		yPmax = -yPmin;
	}
	
	/* Now perform the standard rectangle intersection test. */
	if ( xPmin > xQmax || xQmin > xPmax || yPmin > yQmax || yQmin > yPmax )
		return false;
	
	/* Phase 2: If we get here, check the edges of P to see
	 *          if one of them excludes all vertices of Q.
	 *          If so, then P and Q do not intersect.
	 *          (If not, then P and Q do intersect.)
	 */
	if ( cPos )
	{
		if ( sPos )
			return c * xQmax + s * yQmax < -xPdif
				|| c*xQmin + s * yQmin >  xPdif
				|| c*yQmax - s * xQmin < -yPdif
				|| c*yQmin - s * xQmax >  yPdif
			    ? false : true;
	else  /* s <= 0.0 */
		return c * xQmax + s * yQmin < -xPdif
			|| c * xQmin + s * yQmax >  xPdif
			|| c * yQmax - s * xQmax < -yPdif
			|| c * yQmin - s * xQmin >  yPdif
			 ? false : true;
	}
	else  /* c <= 0.0 */
	{
		if ( sPos )
			return c * xQmin + s * yQmax < -xPdif
				|| c * xQmax + s * yQmin >  xPdif
				|| c * yQmin - s * xQmin < -yPdif
				|| c * yQmax - s * xQmax >  yPdif
				? false : true;
	else  /* s <= 0.0 */
		return c * xQmin + s*yQmin < -xPdif
			|| c * xQmax + s*yQmax >  xPdif
			|| c * yQmin - s*xQmax < -yPdif
			|| c * yQmax - s*xQmin >  yPdif
			 ? false : true;
	}
}


// returns an array of the coordinates of the corners of a block level element
function getVertices( obj) {

	var scale = obj.width / obj.origWidth;
	
	if (obj.rotation === 0 && scale === 1)
		return [
			{x:obj.x, y:obj.y + obj.height},
			{x:obj.x + obj.width , y:obj.y},
			{x:obj.x, y:obj.y},
			{x:obj.x + obj.width, y:obj.y + obj.height}
		];

	var hWidth = obj.width * scale / 2;
	var hHeight = obj.height * scale / 2;

	//this offset corrects a small difference in card coverage caused by the bleed region
	// no longer seems to be necessary. leaving it as 1 to make the ui a bit more relaxed
	//var offset = 3; 
	var offset = 1;
	var bottomOffset = 1;

	var centre = {
		x : obj.width / 2  + obj.x,
		y : obj.height / 2 + obj.y
	};

	var cosAngle = Math.cos(obj.rotation * Math.PI/180);
	var sinAngle = Math.sin(obj.rotation * Math.PI/180);

	var pBottomLeft = {
		x : Math.round((hWidth * cosAngle - hHeight * sinAngle ) + centre.x) + offset,
		y : Math.round((hWidth * sinAngle + hHeight * cosAngle ) + centre.y) + bottomOffset
	};

	var pTopLeft = {
		x : Math.round(-(hWidth * cosAngle - hHeight * sinAngle ) + centre.x) - offset,
		y : Math.round(-(hWidth * sinAngle + hHeight * cosAngle ) + centre.y) - offset
	};

	var pTopRight = {
		x : Math.round(-(hWidth * cosAngle + hHeight * sinAngle ) + centre.x) - offset,
		y : Math.round(-(hWidth * sinAngle - hHeight * cosAngle ) + centre.y) + bottomOffset
	};

	var pBottomRight = {
		x : Math.round((hWidth * cosAngle + hHeight * sinAngle ) + centre.x) + offset,
		y : Math.round((hWidth * sinAngle - hHeight * cosAngle ) + centre.y) - offset
	};

	/*$('.helper-dot').remove();
	makedot(centre.x,centre.y, 'white');
	makedot(pBottomLeft.x,pBottomLeft.y, 'green');
	makedot(pTopLeft.x,pTopLeft.y, 'red');
	makedot(pTopRight.x,pTopRight.y, 'brown');
	makedot(pBottomRight.x,pBottomRight.y, 'black');*/

	return [pBottomLeft,pTopRight, pTopLeft, pBottomRight];
}


function verticesToLines(vertices) {
	var lines = [];

	for(var i=0; i < vertices.length; i++) {
		var next = i + 1;
		if(next === vertices.length) { next = 0; }
		lines.push({ p1 : vertices[i], p2 : vertices[next] });
	}

	return lines;
}


function noOverlap(vertices, coverage) {
	
	var box = {
		top: coverage.y,
		bottom: coverage.y + coverage.height,
		left: coverage.x,
		right: coverage.x + coverage.width
	};
	
	
	var result = (vertices[0].y < box.top
		&& vertices[1].y < box.top
		&& vertices[2].y < box.top
		&& vertices[3].y < box.top)
		||
		(vertices[0].y > box.bottom
			&& vertices[1].y > box.bottom
			&& vertices[2].y > box.bottom
			&& vertices[3].y > box.bottom)
		||
		(vertices[0].x < box.left
			&& vertices[1].x < box.left
			&& vertices[2].x < box.left
			&& vertices[3].x < box.left)
		||
		(vertices[0].x > box.right
			&& vertices[1].x > box.right
			&& vertices[2].x > box.right
			&& vertices[3].x > box.right);

	return result;
}

function allInside(vertices, coverage) {

	var box = {
		top: coverage.y,
		bottom: coverage.y + coverage.height,
		left: coverage.x,
		right: coverage.x + coverage.width
	};
	
	return vertices[0].y > box.top
		&& vertices[1].y > box.top
		&& vertices[2].y > box.top
		&& vertices[3].y > box.top
		&& vertices[0].x > box.left
		&& vertices[1].x > box.left
		&& vertices[2].x > box.left
		&& vertices[3].x > box.left
		&& vertices[0].x < box.right
		&& vertices[1].x < box.right
		&& vertices[2].x < box.right
		&& vertices[3].x < box.right
		&& vertices[0].y < box.bottom
		&& vertices[1].y < box.bottom
		&& vertices[2].y < box.bottom
		&& vertices[3].y < box.bottom;
}



function linesIntersect(cardVertices, template) {
	var imageLines = verticesToLines(cardVertices);

	var box = {
		top: template.y,
		bottom: template.y + template.height,
		left: template.x,
		right: template.x + template.width
	};


	var templateLines = verticesToLines([
		{ x: Math.round(box.left), y: Math.round(box.bottom) },
		{ x: Math.round(box.left), y: Math.round(box.top) },
		{ x: Math.round(box.right), y: Math.round(box.top) },
		{ x: Math.round(box.right), y: Math.round(box.bottom) }
	]);

	for (var i = 0; i < imageLines.length; i++) {
		for (var j = 0; j < templateLines.length; j++) {
			if (getIntersection(imageLines[i], templateLines[j]) != null) {
				return true;
			}
		}
	}

	return false;
}

function getIntersection (L1, L2) {

	// calculates the point at which the two infinite lines will cross
	var Px = (((L1.p1.x*L1.p2.y - L1.p1.y*L1.p2.x) * (L2.p1.x - L2.p2.x)) - ((L1.p1.x - L1.p2.x) * (L2.p1.x*L2.p2.y - L2.p1.y*L2.p2.x)))
		/ (((L1.p1.x - L1.p2.x) * (L2.p1.y - L2.p2.y)) - ((L1.p1.y - L1.p2.y) * (L2.p1.x - L2.p2.x)));

	var Py = (((L1.p1.x*L1.p2.y - L1.p1.y*L1.p2.x) * (L2.p1.y - L2.p2.y)) - ((L1.p1.y - L1.p2.y) * (L2.p1.x*L2.p2.y - L2.p1.y*L2.p2.x)))
		/ (((L1.p1.x - L1.p2.x) * (L2.p1.y - L2.p2.y)) - ((L1.p1.y - L1.p2.y) * (L2.p1.x - L2.p2.x)));

	// round so we are only dealing with integers
	var retP = { x : Math.round(Px), y : Math.round(Py) };

	// returns a bool based on whether the point lies between the two given points
	function between(pMax, pMin, pTest) {
		if(pTest.x == null || pTest.y == null) { return false; }

		// correcting for points being the wrong way round
		var maxX = (pMin.x > pMax.x) ? pMin.x : pMax.x;
		var minX = (pMin.x <= pMax.x) ? pMin.x : pMax.x;
		var maxY = (pMin.y > pMax.y) ? pMin.y : pMax.y;
		var minY = (pMin.y <= pMax.y) ? pMin.y : pMax.y;

		// check pTest lies between pMax and pMin
		return minX <= pTest.x && maxX >= pTest.x
			&& minY <= pTest.y && maxY >= pTest.y;
	}

	// we are only interested if the lines intersect between the vetices
	if( between(L1.p1, L1.p2, retP) && between(L2.p1, L2.p2, retP) ) {
		return retP;
	} else {
		return null;
	}
}


//multi-touch


var mc = new Hammer.Manager(document.getElementById('ssg-canvas'));
//mc.get('pinch').set({ enable: true });
//mc.get('rotate').set({ enable: true });
// create a pinch and rotate recognizer
// these require 2 pointers
var pinch = new Hammer.Pinch();
var rotate = new Hammer.Rotate();

// we want to detect both the same time
pinch.recognizeWith(rotate);

// add to the Manager
mc.add([pinch, rotate]);


mc.on("pinch rotate", function(ev) {
	//ctx.font = "12px Arial";
	//ctx.fillText("pinch rotate",10,10);
	if (ev.type === 'pinch') {
		card.pinch(ev);
		
		
	}
	if (ev.type === 'rotate') {
		card.rotate(ev);
		
	}
	//$('#hammer-container').append( JSON.stringify(ev)).append('<br>');
	
});

mc.on( "pinchend", function( e ) {
	//$('#hammer-container').append('pinched', e.scale)
} );



// todo improve multi gestures
function Clipart(id, src, opts) {
	var clipartId = id;
	var selected = false;
	var image = new Image();
	image.crossOrigin = 'Anonymous';
	var imageLoaded = false;
	var borderColor = 'rgb(49, 183, 219)';
	var coverage = {
		x: template.x + 10,
		y: template.y + 10,
		width: 180,
		height: 100,
	}
	var x, y, width, height, rotation;
	
	var action = ACTIONS.NOTHING;
	var origHeight = 50;
	var origWidth = 50;
	var hoverCorners = {
		leftTop: false,
			rightTop: false,
			leftBottom: false,
			rightBottom: false,
			rotatePoint: false
	};
	
	function init(src) {
		image.src = src;
		image.onload = function() {
			imageLoaded = true;
			x = coverage.x;
			y = coverage.y;
			width = 50;
			height = 50;
			rotation = 0;
			//drawCard();
		}
	}
	
	function getOriginPoint() {
		return {
			x: x + width /2,
			y: y + height /2
		}
	}
	function getLeftTopCorner() {
		if (rotation === 0) {
			return {
				x: x,
				y: y
			}
		} else {
			
			var pointOffset = {
				x: x - getOriginPoint().x,
				y: y - getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians),
				
			};
			
			return {
				x: rotatePoint.x + getOriginPoint().x,
				y: rotatePoint.y + getOriginPoint().y
			};
		}
	}
	function getRightTopCorner() {
		if (rotation === 0) {
			return {
				x: x + width,
				y: y
			}
		} else {
			var pointOffset = {
				x: x + width - getOriginPoint().x,
				y: y - getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + getOriginPoint().x,
				y: rotatePoint.y + getOriginPoint().y
			};
		}
	}
	function getLeftBottomCorner() {
		if (rotation === 0) {
			return {
				x: x,
				y: y + height
			}
		} else {
			var pointOffset = {
				x: x - getOriginPoint().x,
				y: y + height - getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + getOriginPoint().x,
				y: rotatePoint.y + getOriginPoint().y
			};
		}
	}
	function getRightBottomCorner() {
		if (rotation === 0) {
			return {
				x: x + width,
				y: y + height
			}
		} else {
			var pointOffset = {
				x: x + width - getOriginPoint().x,
				y: y + height - getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + getOriginPoint().x,
				y: rotatePoint.y + getOriginPoint().y
			};
		}
	}
	
	function getRotationPoint() {
		
		if (rotation === 0) {
			return {
				x: x + width/2,
				y: y - 30
			}
		} else {
			var pointOffset = {
				x: x + width /2 - getOriginPoint().x,
				y: y  - 30 - getOriginPoint().y
			};
			//
			// //console.log(pointOffset);
			var radians = rotation * Math.PI / 180;
			var rotatePoint= {
				x: (pointOffset.x) * Math.cos(radians) -  (pointOffset.y) * Math.sin(radians),
				y: (pointOffset.x ) * Math.sin(radians) +  (pointOffset.y) * Math.cos(radians)
				
			};
			
			return {
				x: rotatePoint.x + getOriginPoint().x,
				y: rotatePoint.y + getOriginPoint().y
			};
		}
		
	}
	function render(ctx) {
		if (!imageLoaded) {
			return;
		}
		
		var originX = x + width/2;
		var originY = y + height /2;
		ctx.save();
		ctx.translate(originX, originY);
		if (rotation !== 0) {
			ctx.rotate( rotation * Math.PI/180);
		}
		ctx.drawImage(image, - width / 2,- height / 2, width, height);
		
		if (selected) {
			// draw border
			ctx.strokeStyle = borderColor;
			roundRect(ctx, - width / 2,- height / 2, width, height, 2);
			
			// draw left top corner
			
			ctx.beginPath();
			ctx.arc( - width / 2,- height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = hoverCorners.leftTop ? borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			// draw right top corner
			ctx.beginPath();
			ctx.arc(  width / 2,- height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = hoverCorners.rightTop? borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			
			//draw left bottom corner
			ctx.beginPath();
			ctx.fillStyle = hoverCorners.leftBottom? borderColor : 'white';
			ctx.arc(  -width / 2, height / 2, 5, 0 , 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
			
			
			//draw right bottom corner
			ctx.beginPath();
			ctx.arc(  width / 2, height / 2, 5, 0 , 2 * Math.PI);
			ctx.fillStyle = hoverCorners.rightBottom? borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			//draw rotation point
			ctx.beginPath();
			ctx.moveTo(0 , -height /2 );
			ctx.lineTo(0 , -height / 2 - 30);
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(  0 , -height / 2 - 30, 5, 0 , 2*Math.PI);
			ctx.fillStyle = hoverCorners.rotatePoint? borderColor : 'white';
			ctx.fill();
			ctx.stroke();
			
			ctx.restore();
			ctx.save();
			roundRect(ctx, coverage.x, coverage.y, coverage.width, coverage.height);
			
		}
		
		ctx.restore();
	}
	function  hover(pos) {
		
		if (!selected) {
			return;
		}
		// just to highlight corners
		if (action === ACTIONS.NOTHING) {
			
			hoverCorners.leftTop = isInside(pos, getLeftTopCorner());
			hoverCorners.rightTop = isInside(pos, getRightTopCorner());
			hoverCorners.leftBottom = isInside(pos, getLeftBottomCorner());
			hoverCorners.rightBottom = isInside(pos, getRightBottomCorner());
			hoverCorners.rotatePoint = isInside(pos, getRotationPoint());
		}else if (action === ACTIONS.SCALING) {
			
			var centerPoint = getOriginPoint();
			var dx1 = Math.abs(centerPoint.x - mousePos.x);
			var dy1 = Math.abs(centerPoint.y - mousePos.y);
			
			var dx2 = Math.abs(centerPoint.x - pos.x);
			var dy2 = Math.abs(centerPoint.y - pos.y);
			
			
			
			var deltaX =  dx1 - dx2;
			var deltaY = dy1 - dy1;
			
			x +=  deltaX;
			y +=  deltaY;
			
			var ratio = width / height;
			width -=  deltaX *2;
			height -= deltaX * 2 / ratio;
			
			mousePos = pos;
			
		} else if (action === ACTIONS.ROTATION) {
			var oldAngle = getMyAngle(mousePos, getOriginPoint());
			var angle = getMyAngle(pos, getOriginPoint());
			rotation += angle - oldAngle;
			
			mousePos = pos;
			
		} else if(action === ACTIONS.MOVING) {
			
			var deltaX =  pos.x - mousePos.x;
			var deltaY = pos.y - mousePos.y;
			
			x += deltaX;
			y += deltaY;
			
			mousePos = pos;
			
		}
	}
	
	function setSelected(val) {
		selected = val;
	}
	
	function hitTest(pos) {
		console.log(hoverCorners);
		
		return (pos.x >= x && pos.x <= x + width
			&& pos.y >= y && pos.y <= y + height)
			|| (hoverCorners.leftTop
				|| hoverCorners.leftBottom
				|| hoverCorners.rightTop
				|| hoverCorners.rightBottom
				|| hoverCorners.rotatePoint
			);
		
	}
	
	function getId() {
		return clipartId;
	}
	
	function onClick(pos) {
		
		if (!selected) {
			return;
		}
		
		if (hoverCorners.leftTop
			|| hoverCorners.leftBottom
			|| hoverCorners.rightTop
			|| hoverCorners.rightBottom) {
			action = ACTIONS.SCALING;
			mousePos = pos;
		} else if (hoverCorners.rotatePoint) {
			action = ACTIONS.ROTATION;
			mousePos = pos;
		} else if (pos.x >= x && pos.x <= x + width
			&& pos.y >= y && pos.y <= y + height) {
			action = ACTIONS.MOVING;
			mousePos = pos;
		} else {
			action = ACTIONS.NOTHING;
		}
		
		console.log(action);
	}
	
	function onFinish() {
		action = ACTIONS.NOTHING;
		if (selected) {
			outOfCanvas();
		}
		
	}
	
	function isSelected() {
		return selected;
	}
	
	function testCoverage() {
		//console.log('obj', this);
		//
		var vertices =  [getLeftBottomCorner(),
			getRightTopCorner(),
			getLeftTopCorner(),
			getRightBottomCorner()];
		
		var result = !allInside(vertices, coverage);
		//console.log('allInside', result);
		
		return result;
		
	}
	
	
	function outOfCanvas() {
		var vertices =  [getLeftBottomCorner(),
			getRightTopCorner(),
			getLeftTopCorner(),
			getRightBottomCorner()];
		
		var xArrays = vertices.map( function(v){
			return v.x;
		});
		
		var yArrays = vertices.map( function(v){
			return v.y;
		});
		
		//console.log(xArrays, yArrays);
		
		var minX = Math.min.apply(null, xArrays);
		var minY = Math.min.apply(null, yArrays);
		var maxX = Math.max.apply(null, xArrays);
		var maxY = Math.max.apply(null, yArrays);
		
		
		if (minX < 0 || maxX > ctx.canvas.width || minY < 0 || maxY > ctx.canvas.height) {
			removeClipart(clipartId);
		}
		
	}
	
	
	init(src);
	
	return {
		render: render,
		setSelected: setSelected,
		hover: hover,
		onClick: onClick,
		onFinish: onFinish,
		hitTest: hitTest,
		isSelected: isSelected,
		testCoverage: testCoverage,
		outOfCanvas: outOfCanvas,
		getId: getId
	}
}

$('.emoij').click(function(e){
	// todo add unique id
	var clipart = new Clipart(cliparts.length + 1, e.target.src);
	clipart.setSelected(true);
	
	
	cliparts.forEach(function(clipart){
		clipart.setSelected(false);
	});
	
	cliparts.push(clipart);
	card.selected = false;
	
});


$('#btn-preview').click(function(){
	
	card.selected = false;
	cliparts.forEach(function(clipart){
		clipart.setSelected(false);
	});
	
	setTimeout(function(){
		crop(canvas, template.x, template.y, template.width, template.height, function(datUrl) {
			$('#preview').css('background-image', 'url(' + datUrl + ')');
		});
	}, 500);
	
	
	
	//document.body.style.backgroundImage = 'url(' + dataURL + ')';

});

function crop (canvas, offsetX, offsetY, width, height, callback) {
	// create an in-memory canvas
	var buffer = document.createElement('canvas');
	var b_ctx = buffer.getContext('2d');
	// set its width/height to the required ones
	buffer.width = width;
	buffer.height = height;
	// draw the main canvas on our buffer one
	// drawImage(source, source_X, source_Y, source_Width, source_Height,
	//  dest_X, dest_Y, dest_Width, dest_Height)
	b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
		0, 0, buffer.width, buffer.height);
	// now call the callback with the dataURL of our buffer canvas
	callback(buffer.toDataURL());
}


function removeClipart(clipartId) {
	cliparts = cliparts.filter(function(item) {
		return item.getId() !== clipartId;
	})
}

//todo intergrate with old app


// pros and cons
// 1. canvas supported by all browsers
// 2. style of canvas elements cannot be overwrite outside
// 3. easy and faster development
// 4. has the same power as flash (free to draw anything there)
// 5. no additional third library is used
// 6. fully compatible with current app

//estimations
// improve code - 3days
// improve gestures - 2days
// add text - 2days
// add doodle - 3 days
// add special effects - 2days
// total - 12 days ±2days buffer
// animation if required - ???
