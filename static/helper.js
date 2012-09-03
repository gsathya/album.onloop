var watermark = "Album/Soundtrack Search (Leave blank for random album.)";
var requests;

function htmlDecode(value){
	return $('<div/>').html(value).text();
}

function jsonParse() {
	//var jsonFile = "{{url_for('static',filename='list_of_albums.json')}}";
	var jsonFile = "/static/list_of_albums.json";

	$.getJSON(jsonFile).success(function(data) {
		var randomIndex = Math.floor(Math.random() * data.albums.length/5);
		var randomString = data.albums[randomIndex];
		var decodedString = htmlDecode(randomString);
		var formData;
		formData = assignformString(decodedString);
		sendRequest(1, 9, formData);
	});

	return false;
}

function assignformString(albumChosen) {
	formString = $('#userform');
	var f = formString.serializeArray();
	if(f[0].value == "" || f[0].value == watermark) {
		f[0].value = albumChosen;
		$('.submitText').val(f[0].value);
		//formString = $('#userform');
	}
	return f[0].value;
}

function sendRequest(count, maxCount, formData) {
	if (count == 1) $('div.myDiv').html("<img class=\"loader\" src=\"/static/loader.gif\" alt=\"Fetching...\" />");
	else $('div.myDiv').append("<img class=\"loader\" src=\"/static/loader.gif\" alt=\"Fetching...\" />");

	if (requests) requests.abort();
	requests = $.ajax({type:'POST', url: '/', data:"&query=" + formData + "&count=" + count, success: function(response) {
			if (count == 1) { $('div.myDiv').html(response); }
			else { $('img.loader').replaceWith(response); }
			count++;
			if (count <= maxCount) {
				sendRequest(count, maxCount, formData);
			}
			}});

	return false;

}

	//function submitForm() {
	//	formData = assignformString();
	//	sendRequest(1, 7, formData);
	//	return false;
	//}

$(document).ready(function(){
	jQuery(function($){
	       $('.submitText').Watermark(watermark);
	});

	$('a[href=#topOfPage]').click(function(){
		$('html, body').animate({scrollTop:0});
		$('.submitText').val('');
		$('.submitText').focus();
	        return false;
	});


    		/*$(".submitBtn").attr("disabled", "true");
		$(".submitText").keyup(function(){
	        if ($(this).val() != "") {
        	    $(".submitBtn").removeAttr("disabled");
	        } else {
	            $(".submitBtn").attr("disabled", "true");
	        }
	       });*/
});
