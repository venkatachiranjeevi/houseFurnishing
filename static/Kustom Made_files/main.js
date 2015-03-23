
/* common js */

$(document).ready(function(){
    $("#info-1,#info-2,#info-3").click(function(){
        showInfoMessage(this);
        $('#infoData').foundation('reveal', 'open');
    })

});

function convertToQueryString(jsonData){
	var queryString = "";
	for(var i in jsonData){
		if(queryString == ""){
			queryString = queryString + i + "=" + jsonData[i];
		}
		else{
			queryString = queryString + "&" + i + "=" + jsonData[i];
		}

	}
	return queryString;
}

function hideErrorMessage(){
    $('#error-div').fadeOut(1000);
}

function showErrorMessage(message){
    if(message){
        $('#error-div #error-division').hide();
        $('#error-div #error-message').text(message);
    }else{
        $('#error-div #error-message').text("");
        $('#error-div #error-division').show();
    }
    $('#error-div').fadeIn("slow");
}

function showDefaultErrorMessage(){
    $('#error-div #error-message').text("");
    $('#error-div #error-division').show();
    $('#error-div').fadeIn("slow");
}

function showInfoMessage(infoID){
    $('#infoData #info-options').empty();

var html ='';
    if($(infoID).attr("id") == "info-1"){
        html = "<div id='type'><h6 class='obs-head'>Information Message</h6></div>"+
                    "<div class='left' style='text-align:center;'>1. Step1-Info1</div><br>"+
                    "<div class='left' style='text-align:center;'>2. Step1-Info2</div><br>"+
                    "<div class='left' style='text-align:center;'>3. Step1-Info3</div><br>";
    }

    if($(infoID).attr("id") == "info-2"){
        html = "<div id='type'><h6 class='obs-head'>Information Message</h6></div>"+
                    "<div class='left' style='text-align:center;'>1. Step2-Info1</div><br>"+
                    "<div class='left' style='text-align:center;'>2. Step2-Info2</div><br>"+
                    "<div class='left' style='text-align:center;'>3. Step2-Info3</div><br>";
    }

    if($(infoID).attr("id") == "info-3"){
        html = "<div id='type'><h6 class='obs-head'>Information Message</h6></div>"+
                    "<div class='left' style='text-align:center;'>1. Step3-Info1</div><br>"+
                    "<div class='left' style='text-align:center;'>2. Step3-Info2</div><br>"+
                    "<div class='left' style='text-align:center;'>3. Step3-Info3</div><br>";
    };


    $('#infoData #info-options').append(html);


    $('#infoData #close-obs-popup').unbind('click').bind('click',function(){
        $('#infoData').foundation('reveal', 'close');
    });


}
/*end common js*/

$(document).ready(function(){
    if (!$.curCSS) $.curCSS = $.css;
    jQuery.ajaxSetup({
          error: function(xhr,ajaxOptions,thrownError) {
              showDefaultErrorMessage();
          }
        });
    $( document ).ajaxStop(function() {
        setTimeout(function(){$("div.modalWindow").remove();
        $("#loading-div").hide();},500);
    });



    /*landing page*/
	$("#uploadBtn").on("change", function(){
        $('#uploadFile').value = this.value;
    });
   	$('.overlay').hide();
    $('.upload-button').click(function () {
  		$('.overlay').show();
	});
	$('.cancel').click(function () {
  		$('.overlay').hide();
	});
	$('.upload-btn').change(function(){
		$('.text-field').value=this.value})
	});

	$('.close').click(function () {
  	$('.overlay').hide();


    /*end landing page*/
  });

