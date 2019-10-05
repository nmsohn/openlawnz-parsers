/**
 * @file Runs all the steps for processing law data
 */
const argv = require('yargs').argv;
const moment = require('moment');

const setup = require('../common/setup.js');

const resetCases = require('../parser/_resetCases');
const parseInvalidCharacters = require('../parser/parseInvalidCharacters');
const parseFootnotes = require('../parser/parseFootnotes');
const parseEmptyCitations = require('../parser/parseEmptyCitations');
const parseCourts = require('../parser/parseCourts');
const parseCaseCitations = require('../parser/parseCaseCitations');
const parseCaseToCase = require('../parser/parseCaseToCase');
const parseLegislationToCases = require('../parser/parseLegislationToCases');

// TODO: Timings between each step
const run = async () => {
	console.log('Running all parsers');

	const { connection, pipeline_connection, logDir } = await setup(argv.env);
	const start = moment();

	console.log(`- logDir: ${logDir}`);
	console.log(`- Started ${start}`);

	await resetCases(connection, pipeline_connection, logDir);
	await parseInvalidCharacters(connection, logDir);
	await parseFootnotes(connection, logDir);
	await parseEmptyCitations(connection, logDir);
	await parseCaseCitations(connection, logDir);
	await parseCourts(connection, logDir);
	await parseCaseToCase(connection, logDir);
	await parseLegislationToCases(connection, logDir);
	console.log(`All done. Took ${moment().diff(start, 'minutes')} minutes`);
};

run()
	.catch((ex) => {
		console.log(ex);
	})
	.finally(process.exit);
