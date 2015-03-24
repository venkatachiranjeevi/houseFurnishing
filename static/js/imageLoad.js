var item=null,allCoords=[],houseDetails=[];
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
            //fix1Room();
            if (flag == 0) {
                var x = document.getElementsByClassName("wall-prop");
                //for (var i = 0; i < x.length; i++)
                //    x[i].disabled = false;
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
            if(temp[k].name!="sofa") {
              drawObjects(temp[k]);
            }
            else{
                drawImages(temp[k])
            }
        }
        stage.add(layer);
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
    document.getElementById("door").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("window").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("wardrobe").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("sofa").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("cooking-area").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("plumbing").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("bed").addEventListener('dragstart',function(e){
        item=this;
    });
    document.getElementById("plug").addEventListener('dragstart',function(e){
        item=this;
    });
    con.addEventListener('dragover',function(e){
        e.preventDefault();
    });
    con.addEventListener('drop',function(e){
         e.preventDefault();
        var index=allCoords.length-1;
        var details=null,radius;
        if($("#room-name").val()!="") {
            var color = "", xpos= e.layerX, ypos= e.layerY;
            if (item.id == "door") {
                color = "#B8860B";
                radius=60;
            }
            else if (item.id == "window") {
                color = "#ADD8E6";
                radius = 60;
            }
            else if (item.id == "wardrobe") {
                color = "#FFEBCD";
                radius=40;
            }
            else if (item.id == "cooking-area") {
                color = "#6B92C8";
                radius=40;
            }
            else if (item.id == "bed") {
                color = "#FAFBF5";
                radius=50;
            }
            else if (item.id == "plumbing") {
                color = "#5D7F8C";
                radius=50;
            }
            else if (item.id == "plug") {
                color = "black";
                radius=100;
            }
            for(var k=0;k<allCoords.length;k++){
                if(allCoords[k][0].name==$("#room-name").val()){
                    index=k;
                    break;
                }
            }
            if(item.id!="sofa")
                details=getRectValues(e.layerX, e.layerY,item.id,radius,color);
            if(item.id!=="sofa" && details!=0) {
                drawObjects(details);
            }
            else if(item.id=="sofa"){
                details={
                    len:80,
                    ht:60,
                    xpos: get_Sofa_X(e.layerX),
                    ypos: get_Sofa_Y(e.layerY),
                    name:'sofa',
                    color:color,
                    wallLen:getWidth(),
                    wallHeight:getHeight()
                };
                drawImages(details);
            }
            allCoords[index].push(details);
        }
        else{
            alert("Fix The Room First");
        }
    });
    function drawObjects(details){
        var diffX=getWidth()-details.wallLen;
        var diffY=getHeight()-details.wallHeight;
        details.xpos+=diffX;
        details.ypos+=diffY;
        details.wallLen=getWidth();
        details.wallHeight=getHeight();

        var background = new Kinetic.Rect({
            x: details.xpos,
            y: details.ypos,
            width: details.len,
            height: details.ht,
            fill: details.color,
            name: 'furniture',
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
        layer.add(background);
        stage.add(layer);
        return details;
    }
    function drawImages(details){
        var diffX=getWidth()-details.wallLen;
        var diffY=getHeight()-details.wallHeight;
        details.xpos+=diffX;
        details.ypos+=diffY;
        details.wallLen=getWidth();
        details.wallHeight=getHeight();
        var image=new Kinetic.Image({
            x: details.xpos,
            y: details.ypos,
            width:details.len,
            height:details.ht,
            name:details.name,
            draggable:true,
            dragBoundFunc: function(pos) {
                var X=get_Sofa_X(pos.x);
                var Y=get_Sofa_Y(pos.y);
                details.xpos=X;
                details.ypos=Y;
                return ({
                    x:X,
                    y:Y
                });
            }

        });
        layer.add(image);
        imgObj=new Image();
        imgObj.src="static/sf1.png";
        imgObj.onload=function(){
            image.setImage(imgObj)
            layer.draw()
        };
        stage.add(layer);
        return details;
    }
    function get_Sofa_X(val){
        if(val<59)
            return 59;
        if(val>350+getWidth()-35)
            return 350+getWidth()-35;
        return val;
    }
    function get_Sofa_Y(val){
        if(val<52)
           return 52;
        if(val>250+getHeight()-26)
            return 250+getHeight()-26;
        return val;
    }
    function getRectValues(x,y,name,r,color){
        var xp=x,yp= y,wN,width=getWidth()- r,height=getHeight()-r;
        if((x >= 43 && x <= ( 350 + getWidth() + 30))&&((y>25&&y<60)||(y>250+getHeight()-5&&y<250+getHeight()+50))){
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
                name:name,
                color:color,
                wallName:wN,
                wallLen:getWidth(),
                wallHeight:getHeight()
            };
        }
        else if(((x>25&&x<=53)||(x>350+getWidth()+30&&x<350+getWidth()+60))&&(y>=25&&y<=250+getHeight()+40)){
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
                len:8,
                ht:getHeight()-r,
                xpos:xp,
                ypos:yp,
                name:name,
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
                    customizeRoom(allCoords[i]);
                }
            }
            render2html(houseDetails);
        }
        else{
            alert("Without Rooms Unable to Generate");
        }
       });
    });

    function customizeRoom(temp){
        var roomDetails=[];
        var roomlen;
        var wallAC=parseInt(temp[0].wallAfeet)*11+parseInt(temp[0].wallAInch);
        var wallBD=parseInt(temp[0].wallBfeet)*11+parseInt(temp[0].wallBInch);
        for(var j=1;j<temp.length;j++){
            if(temp[j].name=="wardrobe"||temp[j].name=="cooking-area"){
                roomlen=(temp[j].ht==10)?wallAC:wallBD;
                for(var k=0;k<3;k++){
                    space=((roomlen-1)/11-k).toFixed(2);
                    roomDetails.push({
                        RoomLength:space,
                        itemName:temp[j].name,
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
