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
SPExt.User.GetFullAddress = function (streetPropertyName, postalCodePropertyName, locationPropertyName) {
    streetPropertyName = streetPropertyName || "streetAddress";
    postalCodePropertyName = postalCodePropertyName || "postalCode";
    locationPropertyName = locationPropertyName || "SPS-Location";
    
    return $.Deferred(function (defer) {
        SPExt.User.GetSelfProfile().then(function (data) {
            var streetAddress = SPExt.User.GetProperty(streetPropertyName, data.d.UserProfileProperties);
            var postalCode = SPExt.User.GetProperty(postalCodePropertyName, data.d.UserProfileProperties);
            var spsLocation = SPExt.User.GetProperty(locationPropertyName, data.d.UserProfileProperties);

            var address = streetAddress != null ? streetAddress + "\n" : "";
            address += postalCode != null ? (spsLocation ? postalCode + "-" : postalCode) : (spsLocation || "");
            
            return defer.resolve(address);

            return defer.reject("Empty user address");
        }, defer.reject);
    }).promise();
};