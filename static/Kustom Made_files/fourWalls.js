//FourWallsManager object defined.
var FourWallsManager = function(){

};

//Initializing all the properties for FourWallsManager object.
FourWallsManager.prototype.initialize = function(option){
    this.container = option.container,
    this.containerHeight = option.height;
    this.containerWidth = option.width;
    this.feetA = $("#wall-a-feet").val();
    this.inchA = $("#wall-a-inches").val();
    this.feetB = $("#wall-b-feet").val();
    this.inchB = $("#wall-b-inches").val();
    this.factor = 0.85;
    this.obstacles = {};
    this.doorTypes = ["rightHanded","leftHanded","sliding","open","doubleDoors"];
    this.getObsType();

    this.fourWalls = {
        top:"A",
        right:"B",
        bottom:"c",
        left:"D"
    };
    this.obstaclesDefaultSpecs = {
        doors:{
            height:84,
            width:30,
            fromGround:0,
            type:"rightHanded",
            color:"brown"
        },
        windows:{
            height:48,
            width:24,
            fromGround:36,
            type:"sliding",
            color:"silver"
        },
        electric:{
            height:12,
            width:12,
            fromGround:36,
            type:"N/A",
            color:"red"
        },
        plumbing:{
            height:12,
            width:12,
            fromGround:36,
            type:"N/A",
            color:"black"
        },
        cookingArea:{
            height:24,
            width:24,
            fromGround:36,
            type:"N/A",
            color:"yellow"
        },
        emptySpace:{
            height:30,
            width:30,
            fromGround:0,
            type:"N/A",
            color:"grey"
        }
    };

    this.bindEvents();
    this.calculateDimensionForCanvas();
};

FourWallsManager.prototype.getObsType = function(){
    var fwm = this;
    $.ajax({
        url:"../getobstacletypes/",
        type:"GET",
        async:false,
        beforeSend: function() {
			hideErrorMessage();
			if($('.modalWindow').length == 0)
	    		$("body").append('<div class="modalWindow"></div>');
	    	fwm.showLoader("Fetching obstacle types...");
	     },
        success:function(data){
            fwm.obstacleTypes = JSON.parse(data);
        }
    })
};

FourWallsManager.prototype.showLoader = function(message){
    $("#loading-div span#loader-message").text(message);
	$("#loading-div").show();
};

//Event handlers attached for required elements on the page.
FourWallsManager.prototype.bindEvents = function(){
    var fwm = this;
    $(document).foundation();
    fwm.setDefaults();
    $("#step1").addClass("active-crumb");
    $(".wall-prop").on("change",function(){
        fwm.feetA = $("#wall-a-feet").val();
        fwm.inchA = $("#wall-a-inches").val();
        fwm.feetB = $("#wall-b-feet").val();
        fwm.inchB = $("#wall-b-inches").val();
        $("#wall-c-feet").val(fwm.feetA);
        $("#wall-c-inches").val(fwm.inchA);
        $("#wall-d-feet").val(fwm.feetB);
        $("#wall-d-inches").val(fwm.inchB);

        $("#canvas").empty();
        fwm.calculateDimensionForCanvas();
    });


    $("#walls-done").bind("click",function(){
        $("#wall-a-feet").prop("disabled",true);
        $("#wall-a-inches").prop("disabled",true);
        $("#wall-b-feet").prop("disabled",true);
        $("#wall-b-inches").prop("disabled",true);

        /*$(".obstacle img").draggable({
            revert: "invalid",
            appendTo: "body",
            helper: "clone",
            drag:function(event,ui){
                var parentOffset = $(".kineticjs-content").offset();
                var xCoord = event.pageX - parentOffset.left;
                var yCoord = event.pageY - parentOffset.top;
                var rel = $(this).attr("rel");
                var lengthInches = fwm.obstaclesDefaultSpecs[rel].width;
                var lengthPixels = lengthInches*fwm.factor;
                var lenA = (parseInt(fwm.feetA*12) + parseInt(fwm.inchA))*fwm.factor;
                var lenB = (parseInt(fwm.feetB*12) + parseInt(fwm.inchB))*fwm.factor;

                if(xCoord>50 && xCoord<lenA+50 && yCoord>44 && yCoord<56){
                    alert("ji");
                }
             }
        });*/

        $(".obstacle .obstacles-overlay").hide();

        $(this).hide();
        $("#walls-enable").css("display","inline-block");
    });

    $("#confirm-reset").bind("click",function(){
        fwm.setDefaults();
        //$(".obstacle img").draggable("destroy");

        for (prop in fwm.obstacles) {
            if (fwm.obstacles.hasOwnProperty(prop)) {
                delete fwm.obstacles[prop];
            }
        }

        $(".wall-prop").trigger("change");
        $('#resetModal').foundation('reveal', 'close');
        $("#walls-enable").hide();
        $("#walls-done").css("display","inline-block");
    });

    $("#close-reset").bind("click",function(){
        $('#resetModal').foundation('reveal', 'close');
    });

    $("#next-step").on("click",function(){
        fwm.nextStep();
    });

};

FourWallsManager.prototype.setDefaults = function(){
    $("#wall-a-feet").prop("disabled",false);
    $("#wall-a-inches").prop("disabled",false);
    $("#wall-b-feet").prop("disabled",false);
    $("#wall-b-inches").prop("disabled",false);
    $(".obstacle .obstacles-overlay").show();
};

//Parses JSON to required format and redirects to step2.
FourWallsManager.prototype.nextStep = function(){
    var fwm = this;
    var obsArray = [];
    for(var key in fwm.obstacles){
        var obs = {};
        obs.wallSpecification = {};
        obs.extraParams = {};
        for(var i in fwm.obstacleTypes){
            if(fwm.obstacleTypes[i].fields.name == fwm.obstacles[key].type){
                obs.obstacleTypeId = fwm.obstacleTypes[i].pk;
                break;
            }
        }
        obs.length = fwm.obstacles[key].width;
        obs.height = fwm.obstacles[key].height;
        obs.wallSpecification.wall = fwm.fourWalls[fwm.obstacles[key].wall];
        obs.positionX = fwm.obstacles[key].fromLeft;
        obs.positionY = fwm.obstacles[key].fromGround;
        obs.positionZ = 0;
        obs.doorType = fwm.obstacles[key].doorType;
        obs.extraParams = fwm.obstacles[key];
        obsArray.push(obs);
    }

    var form = "<form style='display:none;' id='step2-form' action='../goToStep2/' method='post'>" +
                "<input name='obstacles' value='"+JSON.stringify(obsArray)+"'>" +
                "<input name='wallA' value='"+parseInt(fwm.feetA*12) + parseInt(fwm.inchA)+"'>"+
                "<input name='wallB' value='"+parseInt(fwm.feetB*12) + parseInt(fwm.inchB)+"'>"+
                "<input type='submit' id='submit-wall-obs' value='Submit'>"+
                "</form>";
    $("body").append(form);
    $("#submit-wall-obs").trigger("click");

    /*$.ajax({
        url:"../goToStep2/",
        type:"POST",
        dataType:'json',
        contentType:'application/x-www-form-urlencoded',
		data:convertToQueryString({"obstacles":JSON.stringify(obsArray),"wallSpec":[(parseInt(fwm.feetA*12) + parseInt(fwm.inchA)),(parseInt(fwm.feetB*12) + parseInt(fwm.inchB))]})
    });*/
};

//logic to use maximum available space on the canvas for the four walls.
FourWallsManager.prototype.calculateDimensionForCanvas = function(){
    var fwm = this;
    var wallALength = (parseInt(fwm.feetA*12) + parseInt(fwm.inchA));
    var wallBLength = (parseInt(fwm.feetB*12) + parseInt(fwm.inchB));
    if(fwm.containerWidth/fwm.containerHeight > wallALength/wallBLength){
        fwm.factor = 0.85*fwm.containerHeight/wallBLength;
    }else{
        fwm.factor = 0.85*fwm.containerWidth/wallALength;
    }
    fwm.drawWall(wallALength*fwm.factor,wallBLength*fwm.factor);
};

//Draws walls from the given dimensions.
FourWallsManager.prototype.drawWall = function(lenA,lenB){
    var fwm = this;
    var stage = new Kinetic.Stage({
        container: fwm.container,
        width: lenA + 100,
        height: lenB + 100
      });

    var layer = new Kinetic.Layer();

    var room = new Kinetic.Rect({
        x: 50,
        y: 50,
        width: lenA,
        height: lenB,
        fill: '#C8C8C9',
        stroke: '#666666',
        strokeWidth: 12
      });

    var lineTop = new Kinetic.Line({
        points:[50,20,lenA+50,20],
        stroke: '#666666',
        strokeWidth: 1,
        lineJoin: 'round',
        dash: [lenA/2-20, 40]
    });
    var textTop = new Kinetic.Text({
        x:lenA/2+30,
        y:14,
        width:40,
        align:"center",
        fill:"#666666",
        text:fwm.feetA+"' "+fwm.inchA+"''"
    });

    var lineBottom = new Kinetic.Line({
        points:[50,lenB+80,lenA+50,lenB+80],
        stroke: '#666666',
        strokeWidth: 1,
        lineJoin: 'round',
        dash: [lenA/2-20, 40]
    });
    var textBottom = new Kinetic.Text({
        x:lenA/2+30,
        y:lenB+74,
        width:40,
        align:"center",
        fill:"#666666",
        text:fwm.feetA+"' "+fwm.inchA+"''"
    });

    var lineLeft = new Kinetic.Line({
        points:[20,50,20,lenB+50],
        stroke: '#666666',
        strokeWidth: 1,
        lineJoin: 'round',
        dash: [lenB/2-20, 40]
    });
    var textLeft = new Kinetic.Text({
        x:15,
        y:lenB/2+68,
        width:40,
        align:"center",
        fill:"#666666",
        text:fwm.feetB+"' "+fwm.inchB+"''",
        rotation:270
    });

    var lineRight = new Kinetic.Line({
        points:[lenA+80,50,lenA+80,lenB+50],
        stroke: '#666666',
        strokeWidth: 1,
        lineJoin: 'round',
        dash: [lenB/2-20, 40]
    });
    var textRight = new Kinetic.Text({
        x:lenA+85,
        y:lenB/2+28,
        width:40,
        align:"center",
        fill:"#666666",
        text:fwm.feetB+"' "+fwm.inchB+"''",
        rotation:90
    });

    var wallNameTop = new Kinetic.Text({
        x:lenA/2+30,
        y:30,
        width:40,
        align:"center",
        fill:"#333333",
        fontStyle:"bold",
        text:"Wall-A"
    });
    var wallNameBottom = new Kinetic.Text({
        x:lenA/2+30,
        y:lenB+60,
        width:40,
        align:"center",
        fontStyle:"bold",
        fill:"#333333",
        text:"Wall-C"
    });
    var wallNameLeft = new Kinetic.Text({
        x:30,
        y:lenB/2+68,
        width:40,
        align:"center",
        fontStyle:"bold",
        fill:"#333333",
        text:"Wall-D",
        rotation:270
    });
    var wallNameRight = new Kinetic.Text({
        x:lenA+70,
        y:lenB/2+28,
        width:40,
        align:"center",
        fontStyle:"bold",
        fill:"#333333",
        text:"Wall-B",
        rotation:90
    });
    layer.add(lineTop);
    layer.add(textTop);
    layer.add(lineBottom);
    layer.add(textBottom);
    layer.add(lineLeft);
    layer.add(textLeft);
    layer.add(lineRight);
    layer.add(textRight);
    layer.add(wallNameTop);
    layer.add(wallNameBottom);
    layer.add(wallNameLeft);
    layer.add(wallNameRight);
    layer.add(room);
    stage.add(layer);

    $(".kineticjs-content").css("margin-top",((fwm.containerHeight-(lenB + 100))/2)+"px");

    fwm.makeCanvasDroppable(lenA,lenB,layer);
    fwm.initDraggable(lenA,lenB,stage);

};

//Hover effects for the draggables.
FourWallsManager.prototype.initDraggable = function(lenA,lenB,stage){
    var fwm = this;
    var tempLayer = new Kinetic.Layer();
    var areaTaken;
    $(".obstacle img").draggable({
            revert: "invalid",
            appendTo: "body",
            helper: "clone",
            drag:function(event,ui){
                var parentOffset = $(".kineticjs-content").offset();
                var xCoord = event.pageX - parentOffset.left;
                var yCoord = event.pageY - parentOffset.top;
                var rel = $(this).attr("rel");
                var lengthInches = fwm.obstaclesDefaultSpecs[rel].width;

                if(xCoord>50 && xCoord<lenA+50 && yCoord>40 && yCoord<60){
                    var isFeasibleTop = fwm.checkTop(xCoord,lengthInches,lenA);
                    var xi = xCoord;
                    if(isFeasibleTop!=-1 && isFeasibleTop!=-2){
                        xi = isFeasibleTop.xi;
                    }

                    setTimeout(function(){
                        tempLayer.removeChildren();
                        areaTaken = new Kinetic.Rect({
                            x: xi,
                            y: 44,
                            width: lengthInches*fwm.factor,
                            height: 11,
                            id:"dummy",
                            fill: fwm.obstaclesDefaultSpecs[rel].color,
                            stroke: 'black',
                            strokeWidth: 1
                        });

                        tempLayer.add(areaTaken);
                        tempLayer.draw();
                    },5);
                    stage.add(tempLayer);

                }else if(yCoord>50 && yCoord<lenB+50 && xCoord>40 && xCoord<60){
                    var isFeasibleLeft = fwm.checkLeft(yCoord,lengthInches,lenB);
                    var yf = yCoord-lengthInches*fwm.factor;
                    if(isFeasibleLeft!=-1 && isFeasibleLeft!=-2){
                        yf = isFeasibleLeft.yf;
                    }

                    setTimeout(function(){
                        tempLayer.removeChildren();
                        areaTaken = new Kinetic.Rect({
                            x: 44,
                            y: yf,
                            width: 11,
                            height: lengthInches*fwm.factor,
                            id:"dummy",
                            fill: fwm.obstaclesDefaultSpecs[rel].color,
                            stroke: 'black',
                            strokeWidth: 1
                        });

                        tempLayer.add(areaTaken);
                        tempLayer.draw();
                    },5);
                    stage.add(tempLayer);
                }else if(xCoord>50 && xCoord<lenA+50 && yCoord>lenB+40 && yCoord<lenB+60){
                    var isFeasibleBottom = fwm.checkBottom(xCoord,lengthInches,lenA);
                    var xf = xCoord-lengthInches*fwm.factor;
                    if(isFeasibleBottom!=-1 && isFeasibleBottom!=-2){
                        xf = isFeasibleBottom.xf;
                    }

                    setTimeout(function(){
                        tempLayer.removeChildren();
                        areaTaken = new Kinetic.Rect({
                            x: xf,
                            y: lenB+44,
                            width: lengthInches*fwm.factor,
                            height: 11,
                            id:"dummy",
                            fill: fwm.obstaclesDefaultSpecs[rel].color,
                            stroke: 'black',
                            strokeWidth: 1
                        });

                        tempLayer.add(areaTaken);
                        tempLayer.draw();
                    },5);
                    stage.add(tempLayer);
                }else if(yCoord>50 && yCoord<lenB+50 && xCoord>lenA+40 && xCoord<lenA+60){
                    var isFeasibleRight = fwm.checkRight(yCoord,lengthInches,lenB);
                    var yi = yCoord;
                    if(isFeasibleRight!=-1 && isFeasibleRight!=-2){
                        yi = isFeasibleRight.yi;
                    }

                    setTimeout(function(){
                        tempLayer.removeChildren();
                        areaTaken = new Kinetic.Rect({
                            x: lenA+44,
                            y: yi,
                            width: 11,
                            height: lengthInches*fwm.factor,
                            id:"dummy",
                            fill: fwm.obstaclesDefaultSpecs[rel].color,
                            stroke: 'black',
                            strokeWidth: 1
                        });

                        tempLayer.add(areaTaken);
                        tempLayer.draw();
                    },5);
                    stage.add(tempLayer);

                }
             },
            stop:function(event,ui){
                tempLayer.remove();
            }
        });
};

//Droppable area calculation and co-ordinate calculations.
FourWallsManager.prototype.makeCanvasDroppable = function(lenA,lenB,layer){
    var fwm = this;
    var count = 0;
    $(".kineticjs-content").droppable({
         drop: function( event, ui ) {
            hideErrorMessage();
            var parentOffset = $(this).offset();
            var xCoord = event.pageX - parentOffset.left;
            var yCoord = event.pageY - parentOffset.top;
            var rel = ui.draggable.attr("rel");
            var lengthInches = fwm.obstaclesDefaultSpecs[rel].width;
            var areaTaken,fromLeft;
            if(xCoord>50 && xCoord<lenA+50 && yCoord>40 && yCoord<60){
                var isFeasibleTop = fwm.checkTop(xCoord,lengthInches,lenA);
                if(isFeasibleTop == -1){
                    showErrorMessage("Not enough space.");
                    return;
                }else if(isFeasibleTop == -2){
                    showErrorMessage("Drop on the empty space");
                    return;
                }else{
                    var xi = isFeasibleTop.xi;
                    var xf = isFeasibleTop.xf;
                }

                count++;
                var fromLeft = xi-50;
                areaTaken = new Kinetic.Rect({
                    x: xi,
                    y: 44,
                    width: lengthInches*fwm.factor,
                    height: 11,
                    name:"top-"+rel,
                    id:rel+"-"+count,
                    fill: fwm.obstaclesDefaultSpecs[rel].color,
                    stroke: 'black',
                    strokeWidth: 1
                });


                fwm.saveObstacle(areaTaken.getId(),areaTaken.getName(),fromLeft,xi,xf,0,0);
                areaTaken.on("dblclick",function(){
                    fwm.createObstaclePopup(areaTaken.getId(),layer);
                    $('#obstacleData').foundation('reveal', 'open');
                });

                layer.add(areaTaken);
                layer.draw();
            }else if(yCoord>50 && yCoord<lenB+50 && xCoord>40 && xCoord<60){
                var isFeasibleLeft = fwm.checkLeft(yCoord,lengthInches,lenB);
                if(isFeasibleLeft == -1){
                    showErrorMessage("Not enough space.");
                    return;
                }else if(isFeasibleLeft == -2){
                    showErrorMessage("Drop on the empty space");
                    return;
                }else{
                    var yi = isFeasibleLeft.yi;
                    var yf = isFeasibleLeft.yf;
                }
                count++;
                var fromLeft = lenB-lengthInches*fwm.factor-yf+50;

                areaTaken = new Kinetic.Rect({
                    x: 44,
                    y: yf,
                    width: 11,
                    height: lengthInches*fwm.factor,
                    name:"left-"+rel,
                    id:rel+"-"+count,
                    fill: fwm.obstaclesDefaultSpecs[rel].color,
                    stroke: 'black',
                    strokeWidth: 1
                });

                fwm.saveObstacle(areaTaken.getId(),areaTaken.getName(),fromLeft,0,0,yi,yf);

                areaTaken.on("dblclick",function(){
                    fwm.createObstaclePopup(areaTaken.getId(),layer);
                    $('#obstacleData').foundation('reveal', 'open');
                });

                layer.add(areaTaken);
                layer.draw();
            }else if(xCoord>50 && xCoord<lenA+50 && yCoord>lenB+40 && yCoord<lenB+60){
                var isFeasibleBottom = fwm.checkBottom(xCoord,lengthInches,lenA);
                if(isFeasibleBottom == -1){
                    showErrorMessage("Not enough space.");
                    return;
                }else if(isFeasibleBottom == -2){
                    showErrorMessage("Drop on the empty space");
                    return;
                }else{
                    var xi = isFeasibleBottom.xi;
                    var xf = isFeasibleBottom.xf;
                }
                count++;
                var fromLeft = lenA-lengthInches*fwm.factor-xf+50;

                areaTaken = new Kinetic.Rect({
                    x: xf,
                    y: lenB+44,
                    width: lengthInches*fwm.factor,
                    height: 11,
                    name:"bottom-"+rel,
                    id:rel+"-"+count,
                    fill: fwm.obstaclesDefaultSpecs[rel].color,
                    stroke: 'black',
                    strokeWidth: 1
                });

                fwm.saveObstacle(areaTaken.getId(),areaTaken.getName(),fromLeft,xi,xf,0,0);
                areaTaken.on("dblclick",function(){
                    fwm.createObstaclePopup(areaTaken.getId(),layer);
                    $('#obstacleData').foundation('reveal', 'open');
                });

                layer.add(areaTaken);
                layer.draw();
            }else if(yCoord>50 && yCoord<lenB+50 && xCoord>lenA+40 && xCoord<lenA+60){
                var isFeasibleRight = fwm.checkRight(yCoord,lengthInches,lenB);
                if(isFeasibleRight == -1){
                    showErrorMessage("Not enough space.");
                    return;
                }else if(isFeasibleRight == -2){
                    showErrorMessage("Drop on the empty space");
                    return;
                }else{
                    var yi = isFeasibleRight.yi;
                    var yf = isFeasibleRight.yf;
                }
                count++;
                var fromLeft = yi-50;

                areaTaken = new Kinetic.Rect({
                    x: lenA+44,
                    y: yi,
                    width: 11,
                    height: lengthInches*fwm.factor,
                    name:"right-"+rel,
                    id:rel+"-"+count,
                    fill: fwm.obstaclesDefaultSpecs[rel].color,
                    stroke: 'black',
                    strokeWidth: 1
                });

                fwm.saveObstacle(areaTaken.getId(),areaTaken.getName(),fromLeft,0,0,yi,yf);
                areaTaken.on("dblclick",function(){
                    fwm.createObstaclePopup(areaTaken.getId(),layer);
                    $('#obstacleData').foundation('reveal', 'open');
                });

                layer.add(areaTaken);
                layer.draw();
            }else{
                showErrorMessage("Drop on one of the walls");
            }
         }
    });
};


//logic for error handling for different walls.
FourWallsManager.prototype.checkTop = function(x,len,wallPixel){
    var fwm = this;
    var lenPixel = len*fwm.factor;
    var tempXF = x+lenPixel;

    if(tempXF>wallPixel+50){
        x = wallPixel+50-lenPixel;
        tempXF = wallPixel+50;
    }

    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "top"){
            if(fwm.obstacles[key].xf>=x && x >= fwm.obstacles[key].xi){
                return -2;
            }else if(fwm.obstacles[key].xi>=x && fwm.obstacles[key].xi<tempXF){
                return -1;
            }else if(fwm.obstacles[key].xf<tempXF && fwm.obstacles[key].xf>x){
                return -1;
            }
        }
    }

    return{xi:x,xf:tempXF};
};

FourWallsManager.prototype.checkLeft = function(y,len,wallPixel){
    var fwm = this;
    var lenPixel = len*fwm.factor;
    var tempYF = y-lenPixel;

    if(tempYF<50){
        y = 50+lenPixel;
        tempYF = 50;
    }
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "left"){
            if(fwm.obstacles[key].yf<y && y <= fwm.obstacles[key].yi){
                return -2;
            }else if(fwm.obstacles[key].yi<=y && fwm.obstacles[key].yi>tempYF){
                return -1;
            }else if(fwm.obstacles[key].yf>tempYF && fwm.obstacles[key].yf<y){
                return -1;
            }
        }
    }

    return{yi:y,yf:tempYF};
};

FourWallsManager.prototype.checkBottom = function(x,len,wallPixel){
    var fwm = this;
    var lenPixel = len*fwm.factor;
    var tempXF = x-lenPixel;

    if(tempXF<50){
        x = 50+lenPixel;
        tempXF = 50;
    }
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "bottom"){
            if(fwm.obstacles[key].xf<x && x <= fwm.obstacles[key].xi){
                return -2;
            }else if(fwm.obstacles[key].xi<=x && fwm.obstacles[key].xi>tempXF){
                return -1;
            }else if(fwm.obstacles[key].xf>tempXF && fwm.obstacles[key].xf<x){
                return -1;
            }
        }
    }

    return{xi:x,xf:tempXF};
};

FourWallsManager.prototype.checkRight = function(y,len,wallPixel){
    var fwm = this;
    var lenPixel = len*fwm.factor;
    var tempYF = y+lenPixel;

    if(tempYF>wallPixel+50){
        y = wallPixel+50-lenPixel;
        tempYF = wallPixel+50;
    }

    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "right"){
            if(fwm.obstacles[key].yf>=y && y >= fwm.obstacles[key].yi){
                return -2;
            }else if(fwm.obstacles[key].yi>=y && fwm.obstacles[key].yi<tempYF){
                return -1;
            }else if(fwm.obstacles[key].yf<tempYF && fwm.obstacles[key].yf>y){
                return -1;
            }
        }
    }

    return{yi:y,yf:tempYF};
};

//Error handling logic for moving an obstacle on the canvas.
FourWallsManager.prototype.checkChangedTop = function(len,fromLeft,wallPixel,id){
    var fwm = this;
    var flPixel = fromLeft * fwm.factor;
    var xi = flPixel+50;
    var xf = xi + len*fwm.factor;
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "top" && key != id){
            if(xf > wallPixel+50 || fromLeft<0){
                return false;
            }else if(fwm.obstacles[key].xf>=xi && xi >= fwm.obstacles[key].xi){
                return false;
            }else if(fwm.obstacles[key].xi<=xf && fwm.obstacles[key].xf>xf){
                return false;
            }else if(fwm.obstacles[key].xf <= xf && fwm.obstacles[key].xi>=xi){
                 return false;
            }else{
                return true;
            }
        }
    }
    return true;
};

FourWallsManager.prototype.checkChangedBottom = function(len,fromLeft,wallPixel,id){
    var fwm = this;
    var flPixel = fromLeft * fwm.factor;
    var xi = wallPixel+50-flPixel;
    var xf = xi - len*fwm.factor;
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "bottom" && key != id){
            if(xf < 50 || fromLeft<0){
                return false;
            }else if(fwm.obstacles[key].xf>=xi && xi >= fwm.obstacles[key].xi){
                return false;
            }else if(fwm.obstacles[key].xi<=xf && fwm.obstacles[key].xf>xf){
                return false;
            }else if(fwm.obstacles[key].xf >= xf && fwm.obstacles[key].xi<=xi){
                 return false;
            }else{
                return true;
            }
        }
    }
    return true;
};

FourWallsManager.prototype.checkChangedLeft = function(len,fromLeft,wallPixel,id){
    var fwm = this;
    var flPixel = fromLeft * fwm.factor;
    var yi = wallPixel+50-flPixel;
    var yf = yi - len*fwm.factor;
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "left" && key != id){
            if(yf < 50 || fromLeft<0){
                return false;
            }else if(fwm.obstacles[key].yf>=yi && yi >= fwm.obstacles[key].yi){
                return false;
            }else if(fwm.obstacles[key].yi<=yf && fwm.obstacles[key].yf>yf){
                return false;
            }else if(fwm.obstacles[key].yf >= yf && fwm.obstacles[key].yi<=yi){
                 return false;
            }else{
                return true;
            }
        }
    }
    return true;
};

FourWallsManager.prototype.checkChangedRight = function(len,fromLeft,wallPixel,id){
    var fwm = this;
    var flPixel = fromLeft * fwm.factor;
    var yi = flPixel+50;
    var yf = yi + len*fwm.factor;
    for(var key in fwm.obstacles){
        if(fwm.obstacles[key].wall == "right" && key != id){
            if(yf > wallPixel+50 || fromLeft<0){
                return false;
            }else if(fwm.obstacles[key].yf>=yi && yi >= fwm.obstacles[key].yi){
                return false;
            }else if(fwm.obstacles[key].yi<=yf && fwm.obstacles[key].yf>yf){
                return false;
            }else if(fwm.obstacles[key].yf <= yf && fwm.obstacles[key].yi>=yi){
                 return false;
            }else{
                return true;
            }
        }
    }
    return true;
};

//Saves changed dimensions for the obstacles and redraws them on the canvas.
FourWallsManager.prototype.saveAndChange = function(id,layer){
    var fwm = this;
    var obstacle = layer.find('#'+id)[0];
    var wallAPixel = (parseInt(fwm.feetA*12) + parseInt(fwm.inchA))*fwm.factor;
    var wallBPixel = (parseInt(fwm.feetB*12) + parseInt(fwm.inchB))*fwm.factor;

    switch (fwm.obstacles[id].wall){
        case "top":
            var isFeasibleTop = fwm.checkChangedTop($("#obs-width").val(),$("#obs-from-left").val(),wallAPixel,id);
            if(isFeasibleTop){
                fwm.obstacles[id].fromLeft = $("#obs-from-left").val();
                fwm.obstacles[id].height = $("#obs-height").val();
                fwm.obstacles[id].width = $("#obs-width").val();
                fwm.obstacles[id].xi = 50+fwm.obstacles[id].fromLeft*fwm.factor;
                fwm.obstacles[id].xf = 50+fwm.obstacles[id].fromLeft*fwm.factor+fwm.obstacles[id].width*fwm.factor;
                obstacle.x(fwm.factor*fwm.obstacles[id].fromLeft+50);
                obstacle.width(fwm.factor*fwm.obstacles[id].width);
                layer.draw();
            }else{
                showErrorMessage("Either the area is taken or their isn't enough space");
                return;
            }
            break;
        case "bottom":
            var isFeasibleBottom = fwm.checkChangedBottom($("#obs-width").val(),$("#obs-from-left").val(),wallAPixel,id);
            if(isFeasibleBottom){
                fwm.obstacles[id].fromLeft = $("#obs-from-left").val();
                fwm.obstacles[id].height = $("#obs-height").val();
                fwm.obstacles[id].width = $("#obs-width").val();
                fwm.obstacles[id].xi = 50+wallAPixel-fwm.obstacles[id].fromLeft*fwm.factor;
                fwm.obstacles[id].xf = 50+wallAPixel-fwm.obstacles[id].fromLeft*fwm.factor-fwm.obstacles[id].width*fwm.factor;
                obstacle.x(wallAPixel+50-fwm.factor*fwm.obstacles[id].fromLeft-fwm.factor*fwm.obstacles[id].width);
                obstacle.width(fwm.factor*fwm.obstacles[id].width);
                layer.draw();
            }else{
                showErrorMessage("Either the area is taken or their isn't enough space");
                return;
            }
            break;
        case "left":
            var isFeasibleLeft = fwm.checkChangedLeft($("#obs-width").val(),$("#obs-from-left").val(),wallBPixel,id);
            if(isFeasibleLeft){
                fwm.obstacles[id].fromLeft = $("#obs-from-left").val();
                fwm.obstacles[id].height = $("#obs-height").val();
                fwm.obstacles[id].width = $("#obs-width").val();
                fwm.obstacles[id].yi = 50+wallBPixel-fwm.obstacles[id].fromLeft*fwm.factor;
                fwm.obstacles[id].yf = 50+wallBPixel-fwm.obstacles[id].fromLeft*fwm.factor-fwm.obstacles[id].width*fwm.factor;
                obstacle.y(wallBPixel+50-fwm.factor*fwm.obstacles[id].fromLeft-fwm.factor*fwm.obstacles[id].width);
                obstacle.height(fwm.factor*fwm.obstacles[id].width);
                layer.draw();
            }else{
                showErrorMessage("Either the area is taken or their isn't enough space");
                return;
            }
            break;
            break;
        case "right":
            var isFeasibleRight = fwm.checkChangedRight($("#obs-width").val(),$("#obs-from-left").val(),wallBPixel,id);
            if(isFeasibleRight){
                fwm.obstacles[id].fromLeft = $("#obs-from-left").val();
                fwm.obstacles[id].height = $("#obs-height").val();
                fwm.obstacles[id].width = $("#obs-width").val();
                fwm.obstacles[id].yi = 50+fwm.obstacles[id].fromLeft*fwm.factor;
                fwm.obstacles[id].yf = 50+fwm.obstacles[id].fromLeft*fwm.factor+fwm.obstacles[id].width*fwm.factor
                obstacle.y(fwm.factor*fwm.obstacles[id].fromLeft+50);
                obstacle.height(fwm.factor*fwm.obstacles[id].width);
                layer.draw();
            }else{
                showErrorMessage("Either the area is taken or their isn't enough space");
                return;
            }
            break;
            break;
        default :
            return null;
    }
    fwm.obstacles[id].fromLeft = $("#obs-from-left").val();
    fwm.obstacles[id].height = $("#obs-height").val();
    fwm.obstacles[id].width = $("#obs-width").val();
};

//Saves obstacles with default specs.
FourWallsManager.prototype.saveObstacle = function(id,name,fl,xi,xf,yi,yf){
    var fwm = this;
    var obsType = id.split("-")[0];
    fwm.obstacles[id] = {
        wall:name.split("-")[0],
        type:obsType,
        height:fwm.obstaclesDefaultSpecs[obsType].height,
        width:fwm.obstaclesDefaultSpecs[obsType].width,
        fromGround:fwm.obstaclesDefaultSpecs[obsType].fromGround,
        doorType:fwm.obstaclesDefaultSpecs[obsType].type,
        fromLeft:Math.round(fl/fwm.factor),
        xi:xi,
        xf:xf,
        yi:yi,
        yf:yf
    };
};

//Creates popup for obstacles spec manipulation.
FourWallsManager.prototype.createObstaclePopup = function(id,layer){
    var fwm = this;
    var obsTacleSpecs = fwm.obstacles[id];
    $('#obstacleData #obstacle-options').empty();

    var html = "";
    switch (id.split("-")[0]){
        case "doors":
            html = "<div id='type'><h6 class='obs-head'>Doors</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/door-icon.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        case "windows":
            html = "<div id='type'><h6 class='obs-head'>Windows</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/windows-icon.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        case "electric":
            html = "<div id='type'><h6 class='obs-head'>Electric</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/electric.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        case "plumbing":
            html = "<div id='type'><h6 class='obs-head'>Plumbing</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/plumbing-icon.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        case "cookingArea":
            html = "<div id='type'><h6 class='obs-head'>Cooking Area</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/cooking-area.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        case "emptySpace":
            html = "<div id='type'><h6 class='obs-head'>Open Space</h6></div>"+
                   "<div class='left' style='text-align:center;'><img src='/static/images/step-1.1/emptyspace.png'><br><a id='delete-obstacle' style='color:#E31E24;' href='javascript:void(0);'><i class='fa fa-trash-o'></i>&nbsp;Delete</a></div>"+
                   "<div class='right'>"+
                   "<div><label class='inline'>Height(inches):&nbsp;</label><input id='obs-height' class='spec-obs' type='number' value='"+obsTacleSpecs.height+"'></div>"+
                   "<div><label class='inline'>Width(inches):&nbsp;</label><input id='obs-width' class='spec-obs' type='number' value='"+obsTacleSpecs.width+"'></div>"+
                   "<div><label class='inline'>From Left(inches):&nbsp;</label><input id='obs-from-left' class='spec-obs' type='number' value='"+obsTacleSpecs.fromLeft+"'></div>"+
                   "</div>";
            break;
        default :
            return null;

    }

    $('#obstacleData #obstacle-options').append(html);

    $('#delete-obstacle').unbind('click').bind("click",function(){
        fwm.deleteObstacle(id,layer);
    });

    $('#obstacleData #close-obs-popup').unbind('click').bind('click',function(){
        $('#obstacleData').foundation('reveal', 'close');
    });
    $('#obstacleData #change-obstacle-prop').unbind('click').bind('click',function(){
        fwm.saveAndChange(id,layer);
        $('#obstacleData').foundation('reveal', 'close');
    });
};

FourWallsManager.prototype.deleteObstacle = function(id,layer){
    var fwm = this;
    var obstacle = layer.find('#'+id)[0];
    delete fwm.obstacles[id];
    obstacle.remove();
    layer.draw();
    $('#obstacleData').foundation('reveal', 'close');
};

$(document).ready(function(){
    var fourWallsManager = new FourWallsManager();

    fourWallsManager.initialize({
        container:"canvas",
        height:$("#canvas").height(),
        width:$("#canvas").width()
    });
});
