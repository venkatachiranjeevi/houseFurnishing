var item=null,allCoords=[],houseDetails=[],index= 0,radius=50;
window.onload=function() {
    var stage = new Kinetic.Stage({
            container: 'container',
            width: 610,
            height: 490
        });
    var layer = new Kinetic.Layer();
    var designLayer=new Kinetic.Layer();
    layer.removeChildren();
    $(function() {
        $("#room-name").change(function(event){
            roomDisplay();
            index=allCoords.length-1;
             for(var k=0;k<allCoords.length;k++){
                if(allCoords[k][0].name==$("#room-name").val()){
                    index=k;
                    break;
                }
            }
        });
    });

    $(function() {
        $(".wall-prop").change(function(event){
            drawRoom();
            roomDisplay();
        });

    });

    function roomDisplay(){
        var flag=0;
        if ($("#room-name").val()!="") {
            drawRoom();
            for (var i = 0; i < allCoords.length; i++) {
                if (allCoords[i][0].name == $("#room-name").val()) {
                    displayRoom(allCoords[i]);
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                allCoords[allCoords.length]=new Array();
                allCoords[allCoords.length-1].push({name:$("#room-name").val(),wallAfeet:$("#wall-a-feet").val(),wallAInch:$("#wall-a-inches").val(),wallBfeet:$("#wall-b-feet").val(),wallBInch:$("#wall-b-inches").val()});
            }
        }
        else {
            layer.removeChildren();
        }
    }

    function drawRoom() {
        layer.removeChildren();
        designLayer.removeChildren();
        if($("#room-name").val()!="") {
            var background = new Kinetic.Rect({
                x: 52,
                y: 43,
                width: 350 + getWidth(),
                height: 250 + getHeight(),
                fill: '#C9C4C4',
                stroke: '#848484',
                strokeWidth: 13,
                name: 'room'
            });
            drawLines(350 + getWidth(), 250 + getHeight());
            layer.add(background);
            stage.add(layer);
        }
    }

    function displayRoom(temp){
        for(var k=1;k<temp.length;k++){
            if(temp[k].name!="sofa"&&temp[k].name!="bed") {
              drawObjects(temp[k]);
            }
            else{
                drawImages(temp[k])
            }
        }

    }

    function drawLines(x, y) {
        var text = "";
        var wallA1 = new Kinetic.Line({
            points: [45, 5, (x + 48) / 2 - 25, 5],
            stroke: "#A4A4A4"
        })
        layer.add(wallA1);
        var wallA2 = new Kinetic.Line({
            points: [(x + 48) / 2 + 25, 5, x + 48, 5],
            stroke: "#A4A4A4"
        })
        layer.add(wallA2);
        text1 = $("#wall-a-feet").val() + "'" + $("#wall-a-inches").val() + '"';
        text2 = "Wall A"
        displayWallText((x + 48) / 2 - 20, 0, (x + 48) / 2 - 24, 15, text1, text2);


        var wallB1 = new Kinetic.Line({
            points: [x + 80, 35, x + 80, (y + 50) / 2 - 25],
            stroke: "#A4A4A4"
        })
        layer.add(wallB1);
        var wallB2 = new Kinetic.Line({
            points: [x + 80, (y + 50) / 2 + 25, x + 80, y + 50],
            stroke: "#A4A4A4"
        })
        layer.add(wallB2);
        text1 = $("#wall-b-feet").val() + "'" + $("#wall-b-inches").val() + '"';
        text2 = "Wall B"
        displayWallText(x + 65, (y + 50) / 2 - 15, x + 60, (y + 50) / 2, text1, text2);


        var wallC1 = new Kinetic.Line({
            points: [x + 48, y + 80, (x + 48) / 2 + 25, y + 80],
            stroke: "#A4A4A4"
        })
        layer.add(wallC1);
        var wallC2 = new Kinetic.Line({
            points: [(x + 48) / 2 - 25, y + 80, 45, y + 80],
            stroke: "#A4A4A4"
        })
        layer.add(wallC2);
        text2 = $("#wall-a-feet").val() + "'" + $("#wall-a-inches").val() + '"';
        text1 = "Wall C"
        displayWallText((x + 48) / 2 - 15, y + 55, (x + 48) / 2 - 15, y + 73, text1, text2);


        var wallD1 = new Kinetic.Line({
            points: [15, y + 50, 15, (y + 50) / 2 + 25],
            stroke: "#A4A4A4"
        })
        layer.add(wallD1);

        var wallD2 = new Kinetic.Line({
            points: [15, (y + 50) / 2 - 25, 15, 35],
            stroke: "#A4A4A4"
        })
        layer.add(wallD2);
        text1 = $("#wall-b-feet").val() + "'" + $("#wall-b-inches").val() + '"';
        text2 = "Wall D"
        displayWallText(2, (y + 50) / 2 - 15, 0, (y + 50) / 2, text1, text2);
    }

    function displayWallText(x1, y1, x2, y2, data1, data2) {
        var wallAtext = new Kinetic.Text({
            x: x1,
            y: y1,
            text: data1,
            fontSize: 13,
            fill: 'black'
        });
        layer.add(wallAtext);
        var wallAtext = new Kinetic.Text({
            x: x2,
            y: y2,
            text: data2,
            fontSize: 15,
            fill: 'black'
        });
        layer.add(wallAtext);
    }

    function getWidth() {
        return parseInt($("#wall-a-feet").val()) * 11 + parseInt($("#wall-a-inches").val());
    }

    function getHeight() {
        return parseInt($("#wall-b-feet").val()) * 11 + parseInt($("#wall-b-inches").val());
    }

    var con=stage.getContainer();
    $("#door")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#window")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#wardrobe")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#sofa")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#cooking-area")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#plumbing")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#bed")[0].addEventListener('dragstart',function(e){
        item=this;
    });
    $("#plug")[0].addEventListener('dragstart',function(e){
        item=this;
    });

    con.addEventListener('dragover',function(e){
        e.preventDefault();
    });

    con.addEventListener('drop',function(e){
        e.preventDefault();
        var rects=stage.find(".rectangle");
        var details=null;
        if($("#room-name").val()!="") {
            var color = "", xpos= e.layerX, ypos= e.layerY;
            if (item.id == "door") {
                color = "#B8860B";
            }
            else if (item.id == "window") {
                color = "#ADD8E6";
            }
            else if (item.id == "wardrobe") {
                color = "#FFEBCD";
            }
            else if (item.id == "cooking-area") {
                color = "#6B92C8";
            }
            else if (item.id == "plumbing") {
                color = "#5D7F8C";
            }
            else if (item.id == "plug") {
                color = "black";
                radius=radius+50;
            }

            if((item.id!=="sofa"&&item.id!="bed") ) {
                details=getRectValues(e.layerX, e.layerY,item.id,radius,color);
                drawObjects(details);
            }
            else if(item.id=="sofa"||item.id=="bed"){
                var length=getWidth()-20,height=getHeight()-40;
                if(item.id=="bed"){
                    height=height+60;
                    length=length-15;
                }
                details={
                    len:length,
                    ht:height,
                    xpos: get_SofaBed_X(e.layerX,length,height),
                    ypos: get_SofaBed_Y(e.layerY,length,height),
                    name:item.id,
                    color:color,
                    wallLen:getWidth(),
                    wallHeight:getHeight()
                };
                drawImages(details);
            }
            allCoords[index].push(details);
        }
        else{
            alert("Choose room first");
        }
    });

    function drawObjects(details){
        var diffX=getWidth()-details.wallLen;
        var diffY=getHeight()-details.wallHeight;
        details.wallLen=getWidth();
        details.wallHeight=getHeight();
        details.xpos=details.xpos+diffX;
        details.ypos=details.ypos+diffY;
        if(details.len==10){
            details.ht+=diffY;
        }
        else if(details.ht==10){
            details.len+=diffX;
        }
        var group=new Kinetic.Group({

        });
        var furniture = new Kinetic.Rect({
            x: details.xpos,
            y: details.ypos,
            width: details.len,
            height: details.ht,
            fill: details.color,
            name: 'rectangle',
            draggable: true,
            dragBoundFunc: function (pos) {
                var X = pos.x;
                var Y = pos.y;
                var bounds=get_X_Y(details.wallName,X,Y,details.len,details.ht)
                X=bounds[0];
                Y=bounds[1];
                details.xpos=X;
                details.ypos=Y;
                return ({
                    x: X,
                    y: Y
                });
            }
        });
        group.add(furniture);
        designLayer.add(group);
        stage.add(designLayer);
        return details;
    }

    function drawImages(details){
        var diffX=getWidth()-details.wallLen;
        var diffY=getHeight()-details.wallHeight;
        details.len+=diffX;
        details.ht+=diffX;
        details.xpos+=diffX;
        details.ypos+=diffY;
        details.wallLen=getWidth();
        details.wallHeight=getHeight();
        var group=new Kinetic.Group({
        });
        var image=new Kinetic.Image({
            x: get_SofaBed_X(details.xpos,details.len,details.ht),
            y: get_SofaBed_Y(details.ypos,details.len,details.ht),
            width:details.len,
            height:details.ht,
            name:details.name,
            id:item.id,
            draggable:true,
            dragBoundFunc: function(pos) {
                var X=get_SofaBed_X(pos.x,details.len,details.ht);
                var Y=get_SofaBed_Y(pos.y,details.len,details.ht);
                details.xpos=X;
                details.ypos=Y;
                return ({
                    x:X,
                    y:Y
                });
            }
        });
        group.add(image);
        designLayer.add(group);
        if(details.name=="sofa") {
            imgObj=new Image();
            imgObj.src = "static/sf1.png";
            imgObj.onload=function(){
                image.setImage(imgObj)
                designLayer.draw()
            };
        }
        else if(details.name=="bed") {
            imgObj1=new Image();
            imgObj1.src = "static/bed-image.png";
            imgObj1.onload=function(){
                image.setImage(imgObj1)
                designLayer.draw()
            };
        }
        deleteIcon(details,group);
        designLayer.add(group);
        stage.add(designLayer);
        group.on('mouseover',function(){
             document.body.style.cursor = 'pointer';
            stage.find("#"+image.id())[0].fill("#E3E3EC").opacity(0.4);
            stage.find("#close-icon")[0].show();
            stage.find("#close-icon")[0].on("click", function(){
                deleteItem(image.id,designLayer);
            })
            designLayer.draw()
        });
        group.on('mouseout', function() {
        document.body.style.cursor = 'default';
             stage.find("#"+image.id())[0].fill(null).opacity(1);
            stage.find("#close-icon")[0].show().hide();
            designLayer.draw()
      });
        return details;
    }
    function deleteIcon(details,group){
        var x=stage.find("#close-icon")[0];
        if(x===undefined)
            alert("sdf");
        //stage.remove(x);
        //layer.draw();
        var img=new Kinetic.Image({
             x:details.xpos,
             y:details.ypos,
             width:15,
             height:15,
             id:"close-icon",
             visible:false
         });
        delIcon=new Image();
        delIcon.src="static/close-icon.png";
        delIcon.onload=function(){
            img.setImage(delIcon)
            designLayer.draw()
        };
        group.add(img);

    }
    function deleteItem(unit,layer){
            var it=stage.find("#"+unit)[0]
            stage.remove(it);
            layer.draw();
    }
    function get_SofaBed_X(val,itemLen,itemHt){
        if(val<59)
            return 59;
        if(val+itemLen>350+getWidth())
            return 350+getWidth()+45-itemLen;
        return val;
    }

    function get_SofaBed_Y(val,itemLen,itemHt){
        if(val<52)
           return 52;
        if(val+itemHt>250+getHeight())
            return 250+getHeight()+35-itemHt;
        return val;
    }

    function getRectValues(x,y,name,r,color){
        var xp=x,yp= y,wN,width=getWidth()- r,height=getHeight()-r;
        if((x >= 43 && x <= ( 350 + getWidth() + 25))&&((y>20&&y<65)||(y>250+getHeight()-10&&y<250+getHeight()+50))){
            if(y>25&&y<60) {
                yp = 38;
                wN="WallA";
            }
            else {
                yp = 250 + getHeight() + 40;
                wN="WallC"
            }
            if(xp+width>350+getWidth()+58)
                xp=350+getWidth()+58-width;
            if(xp<46)
                xp = 46;
            return {
                len:getWidth()-r,
                ht:10,
                xpos:xp,
                ypos:yp,
                name:'rectangle',
                id:name,
                color:color,
                wallName:wN,
                wallLen:getWidth(),
                wallHeight:getHeight()
            };
        }
        else if(((x>20&&x<=53)||(x>350+getWidth()+25&&x<350+getWidth()+65))&&(y>=30&&y<=250+getHeight()+45)){
            if(x>25&&x<=53) {
                xp = 48;
                wN="WallD"
            }
            else {
                xp = 350 + getWidth() + 48;
                wN="WallB"
            }
            if(yp<36)
                yp = 36;
            if(yp+r>250+getHeight()+13)
                yp = 300 + r;
            return{
                len:10,
                ht:getHeight()-r,
                xpos:xp,
                ypos:yp,
                name:'rectangle',
                id:name,
                color:color,
                wallName:wN,
                wallLen:getWidth(),
                wallHeight:getHeight()
            };
        }
        else{
            alert("Drag items to the walls only");
            return 0;
        }
    }

    function get_X_Y(wall,x,y,width,height){
        if(wall=="WallA"){
            if(x<46)
                x=46;
            if(x+width>350+getWidth()+58)
                x=350+getWidth()+58-width;
            y=38;
        }
        else if(wall=="WallC"){
            if(x<46)
                x=46;
            if(x+width>350+getWidth()+58)
                x=350+getWidth()+58-width;
            y=250+getHeight()+39;
        }
        else if(wall=="WallB"){
            if(y<40)
                y=40;
            if(y+height>250+getHeight()+45)
               y=250+getHeight()+45-height;
           x=350+getWidth()+56-width;
        }
        else if(wall=="WallD"){
             if(y<39)
                y=39;
            if(y+height>250+getHeight()+47)
               y=250+getHeight()+47-height;
            x=48;
        }
        return [x,y];
    }

    $(function(){
       $("#estimator").click(function(event){
           event.preventDefault();
        if(allCoords.length!=0) {
            for(var i=0;i<allCoords.length;i++){
                if(allCoords[i][0].name.indexOf("Bedroom")>-1||allCoords[i][0].name.indexOf("Kitchen")>-1){
                    customizeRoom(allCoords[i],allCoords[i][0].name);
                }
            }
            render2html(houseDetails);
        }
        else{
            alert("Without Rooms Unable to Generate");
        }
       });
    });

    function customizeRoom(temp,roomName){
        var roomDetails=[];
        var roomlen;
        var wallAC=parseInt(temp[0].wallAfeet)*11+parseInt(temp[0].wallAInch);
        var wallBD=parseInt(temp[0].wallBfeet)*11+parseInt(temp[0].wallBInch);
        for(var j=1;j<temp.length;j++){
            if((temp[j].id=="wardrobe"&&roomName.indexOf("Bedroom")>-1)||(temp[j].id=="cooking-area" && roomName.indexOf("Kitchen")>-1)){
                roomlen=(temp[j].ht==10)?wallAC:wallBD;
                for(var k=0;k<3;k++){
                    space=((roomlen-1)/11-k).toFixed(2);
                    roomDetails.push({
                        RoomLength:space,
                        itemName:temp[j].id,
                        itemLength:space-1,
                        itemCost:getCost(space,temp[j].name)
                    });
                }
            }
        }
        houseDetails.push({
            key:temp[0].name,
            value:roomDetails
        });
    }

    function getCost(feet,item){
        if(item=="wardrobe")
            return "Rs. "+((feet*6*800).toFixed(2))
        else
            return "Rs. "+(feet*5900).toFixed(2)
    }

    function render2html(roomsObjects){
        event.preventDefault();
        var roomDetails=JSON.stringify(roomsObjects);
        $("#none").val(roomDetails);
        $("#formData").submit();
    }
}
