var google = require('googleapis'),
    util = require('./util.js');

var service = google.drive('v3');

var pickInputs = {
        'fileId': { key: 'fileId', validate: { req: true } }
    };

module.exports = {

    /**
     * Get auth data.
     *
     * @param step
     * @param dexter
     * @returns {*}
     */
    authOptions: function (step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2();

        if(!dexter.environment('google_access_token')) {

            this.fail('A [google_access_token] environment variable is required for this module');
            return false;
        } else {

            oauth2Client.setCredentials({
                access_token: dexter.environment('google_access_token')
            });

            return oauth2Client;
        }
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(step, dexter),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (!auth)
            return;

        if (validateErrors)
            return this.fail(validateErrors);

        // set credential
        google.options({ auth: auth });
        service.files.delete(inputs, function (error, data) {
            if (error)
                this.fail(error);
             else
                this.complete({ success: true });
        }.bind(this));
    }
};
