$(function () {

	//
	// EVENTS
	//

	getTopUsers(getUsersSuccess, getUsersError);

});

function getTopUsers(callbackSuccess, callbackError) {

	//var url = "http://api.intercom.fm/users/popular.json";
	var url = "http://intercom-app-staging.herokuapp.com/users/popular.json";

	var urlIE = "/api/topusers";

	if ($("html").hasClass("ie")) {
		alert("IE legacy");
		url = "/api/topusers";
	}
	else {
		alert("Modern browser");
	}

	jQuery.support.cors = true;

	$.ajax({
		url: urlIE,
		dataType: "json",
		success: callbackSuccess,
		error: callbackError
	});
}

//
// getUsersSuccess: get the top users from Intercom.fm and display the top 9
//

function getUsersSuccess(data) {

	$users = $("#about-users ul");

	var count = 0;

	$.each(data, function (i, user) {

		if (count == 0)
			loadWidget(user.facebook_id);

		if (count >= 9)
			return;

		var avatar = (user.image_url != null) ? user.image_url : "/content/images/avatar.gif";
		$item = $("<li data-fb-id='" + user.facebook_id + "'><img alt='" + user.full_name + "' id='user-avatar' src='" + avatar + "'></li>");
		$users.append($item);
		$item.click(userClick);
		count++;

	});
}

//
// getUsersError: show an error if the users can't be loaded
//

function getUsersError(xhr, status, error) {

	$("#about-users").html("<p>Error loading users: <br>" + error + "</p>");

}

function userClick() {

	loadWidget($(this).attr("data-fb-id"));

}

function loadWidget(id) {

	var $widget = $("#about-widget iframe");
	var url = "http://share.intercom.fm/embed/explore/" + id;
	//var url = "http://intercom-app-staging.herokuapp.com/embed/explore/" + id;

	$widget.attr("src", url);

}