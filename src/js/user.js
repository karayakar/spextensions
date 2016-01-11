var SPExt = SPExt || {};
SPExt.User = SPExt.User || {};

// Threadsafe user profile retrieval
var userProfilePromise;
SPExt.User.GetSelfProfile = function (url, query, async) {
    if (userProfilePromise) return userProfilePromise;

    query = query || "";
    url = url || _spPageContextInfo.webServerRelativeUrl;

    userProfilePromise = $.ajax({
        async: async,
        url: url + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties" + query,
        headers: { "Accept": "application/json; odata=verbose" }
    });

    return userProfilePromise;
};

// Retrieve a single user profile property
SPExt.User.GetProperty = function (propertyName, userProfileProperties) {
    for (var i = 0; i < userProfileProperties.results.length; i++) {
        var result = userProfileProperties.results[i];
        if (result.Key == propertyName) {
            return result.Value;
        }
    }
};

// Retrieve the full user address in the format Street\nPLZ-City
SPExt.User.GetFullAddress = function () {
    return $.Deferred(function (defer) {
        SPExt.User.GetSelfProfile().then(function (data) {
            var streetAddress = SPExt.User.GetProperty("streetAddress", data.d.UserProfileProperties);
            var postalCode = SPExt.User.GetProperty("postalCode", data.d.UserProfileProperties);
            var spsLocation = SPExt.User.GetProperty("SPS-Location", data.d.UserProfileProperties);

            if (streetAddress != null && streetAddress != "" &&
					postalCode != null && postalCode != "" &&
					spsLocation != null && spsLocation != "") {
                var address = streetAddress + "\n" + postalCode + "-" + spsLocation;
                return defer.resolve(address);
            }

            return defer.reject("Empty user address");
        }, defer.reject);
    }).promise();
};