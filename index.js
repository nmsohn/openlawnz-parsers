/**
 * @file Runs all the steps for processing law data
 */
'use strict';
const argv = require('yargs').argv;
const moment = require('moment');

const setup = require('./common/setup');

const resetCases = require('./parser/_resetCases');
const parseInvalidCharacters = require('./parser/parseInvalidCharacters');
const parseFootnotes = require('./parser/parseFootnotes');
const parseEmptyCitations = require('./parser/parseEmptyCitations');
const parseCourts = require('./parser/parseCourts');
const parseCaseCitations = require('./parser/parseCaseCitations');
const parseCaseToCase = require('./parser/parseCaseToCase');
const parseLegislationToCases = require('./parser/parseLegislationToCases');

// TODO: Timings between each step
const run = async () => {
	console.log('Running all parsers');

	const { pgPromise, connection, pipeline_connection, logDir } = await setup(argv.env);
	const start = moment();

	console.log(`- logDir: ${logDir}`);
	console.log(`- Started ${start}`);

	await resetCases(pgPromise, connection, pipeline_connection, logDir);
	await parseInvalidCharacters(pgPromise, connection, logDir);
	await parseFootnotes(pgPromise, connection, logDir);
	await parseEmptyCitations(connection, logDir);
	await parseCaseCitations(connection, logDir);
	await parseCourts(pgPromise, connection, logDir);
	await parseCaseToCase(connection, logDir);
	await parseLegislationToCases(pgPromise, connection, logDir);
	console.log(`All done. Took ${moment().diff(start, 'minutes')} minutes`);
};

exports.handler = async (event, context, callback) => {
	try{
		run();
		var response = {
			"statusCode": 200,
			"headers": {
				"Content-Type" : "application/json"
			},
			"body": JSON.stringify(rows),
			"isBase64Encoded": false
		};
		callback(null, response);
	}catch(ex){
		console.log(ex);
		callback(null, 'Database ' + err);
	}finally{
		process.exit;
	}
}

// run()
// 	.catch((ex) => {
// 		console.log(ex);
// 	})
// 	.finally(process.exit);
