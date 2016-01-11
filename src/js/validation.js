var SPExt = SPExt || {};
SPExt.Validation = SPExt.Validation || {};

// Define validators
SPExt.Validation.NotNullValidator = function () { };
SPExt.Validation.NotNullValidator.prototype.Validate = function (value) {
    var hasError = (value == null || value == "");
    var errorMsg = hasError ? "Der Wert darf nicht leer gelassen werden." : "";

    return new SPClientForms.ClientValidation.ValidationResult(hasError, errorMsg);
};