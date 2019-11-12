const { setLogFile, setLogDir, log } = require('../common/functions').makeLogger();
/**
 * id=5951 blank
 * id = 7282 blank
 * id = 7423 blank
 * id = 7772 blank
 * 7817 H
 * id = 30040 TIJDGMENT OF JUDGE K D KELLY should be
 * id = 29118 JUDGMENT OF ASSOCIATE FAIRE
 */
const justiceMap = {
	Directions: /^DIRECTIONS\sOF\s(.*)\sJ/,
	Decision: /^DECISION\sOF\s(.*)\sJ/,
	DecisionSp1: /^.*DECISION\sOF\s(.*)\sJ/,
	SentNote: /^SENTENCING\sNOTES\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentNoteSP1:/NOTES\sON\sSENTENCE\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentNoteSp2: /^.*SENTENCING\sNOTES\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	ReSentNote: /^RE-SENTENCING\sNOTES\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentHon:/^SENTENCE\sOF\sHON\sJUSTICE\s(.*)/,
	Sent:/^SENTENCE\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentRemarks:/^SENTENCING\sREMARKS\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentRemarksSp1:/^\[.*\]\sSENTENCING\sREMARKS\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	JudgeHonJustice:/^JUDGMENT\sOF\sHON\sJUSTICE\s(.*)/,
	JudgeHonJusticeSp1:/^JUDGMENT\sOF\sHON\.\sJUSTICE\s(.*)/,
	JudgeHonJusticeSp2:/^RESERVED\sJUDGMENT\sOF\sHON\.\sJUSTICE\s(.*)/,
	JudgeHonJusticeSp3:/^.*JUDGMENT\sOF\sHON\.\sJUSTICE\s(.*)/,

	JudgeTheCourtDelivered: /^JUDGMENT\sOF\sTHE\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJustice: /^JUDGMENT\sOF\sJUSTICE\s(.*)/,
	JudgeCosts: /^COSTS\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
	JudgeCostsSp1:/^JUDGMENT\sAS\sTO\sCOSTS\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeCostsSp2: /^COSTS\sJUDGMENT\s\(.*\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeCostsSp3: /^COSTS\sJUDGMENT\s.*\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	JudgeNumber1: /^JUDGEMENT\s\(.*\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNumber2: /^JUDGMENT\s\(.*\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,


	JudgeOralHon:/^ORAL\sJUDGMENT\sOF\sHON\sJUSTICE\s(.*)/,
	JudgeOral:/^ORAL\sJUDGMENT\sOF\s(.*)\sJ/,
	JudgeOralSP1:/ORAL\sJUDGMENT\s(.*)OF\sJ/,

	JudgeTheCourt:/^\(Given\sby\s(\S*)\sJ\)/,
	JudgeTheCourtSp1:/^JUDGMENT\sOF\sTHE\sCOURT\sON\sCOSTS\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp2:/^JUDGMENT\sOF\sTHE\sCOURT\sAS\sTO\sCOSTS\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp3:/^JUDGMENT\sOF\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp4:/^JUDGMENT\sOF\sTHE\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp5:/^JUDGMENT\sOF\sCOURT\sOF\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeInterim:/^INTERIM\sJUDGMENT\sOF\sTHE\sHON\sJUSTICE\s(.*)/,

	Ruling:/^RULING\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Ruling1:/^RULING\s.*\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Ruling2:/^.*RULING\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	RulingSp3:/^.*RULING\s.*\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	ResultJudgement: /^RESULT\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	ReservedJudgement:/^RESERVED\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	ReservedJudgementSP1:/^\(.*\)\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	ReservedCostsJudgement:/^RESERVED\sCOSTS\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	RecallJudge: /^RECALL\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	
	JudgeSP1: /^JUDGEMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
	JudgeSP2: /^\[.*\]\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSP3: /^\[.*\]\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ\(.*\)/,
	//29162
	JudgeSP4: /\(.*\)\sJUDGMENT\s\(.*\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSP5: /^.*JUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSP6: /^.*JUDGMENT.*\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSP7: /^JUDGMENT\sOF\s([a-zA-Z0-9\s]*)\s\(.*\)/,
	JudgeSP8: /^JUDGMENT\sOF\sJUDGE\s(.*)/,
	JudgeSP9: /^JUDGMENT\sOF\sJUDGE\s(.*)\s\[.*\]/,
	JudgeSP10: /^JUDGMENT\sOF\s(.*)/,
	Judge: /^JUDGMENT\sOF\s(.*)\sJ/,
};


const assoJudge = {
	

	JudgeAssociateOnCosts1: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\s\[.*\]/,
	JudgeAssociateOnCosts2: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\s\(.*\)/,
	JudgeAssociateOnCosts3: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sON\sCOSTS/,

	JudgeAssociateSp1: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sUPON.*/,
	JudgeAssociateSp2: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sON.*/,
	JudgeAssociateSp3: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sUPON\sINTERLOCUTORY\sAPPLICATION\sBY\sPLAINTIFF\sFOR\sAN\sORDER\sFOR\sATTENDANCE\sBEFORE\sCOURT\sFOR\sEXAMINATION/,
	JudgeAssociateSp4: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sRE\sPRIVILEGE/,
	JudgeAssociateSp7: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sANNULLING\sBANKRUPTCY/,
	JudgeAssociateSp8: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\sAS\sTO.*/,
	JudgeAssociateSp9: /^JUDGMENT\sAS\sTO\sCOSTS\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeAssociateSp10: /^.*JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeAssociateSp11: /^JUDGMENT\sFOR\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeAssociateSp12: /^.*JUDGMENT\sFOR\sASSOCIATE\sJUDGE\s(.*)/,

	OralJudgeAssociate: /^ORAL\sJUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	OralJudgeAssociateSp1: /^ORAL\sJUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\s\(.*\)/,
	OralJudgeAssociateSp2: /^ORAL\sJUDGEMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	OralDecisionAssociate: /^ORAL\sDECISION\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	OralRulingAsso:/^ORAL\sRULING\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	RulingAsso1:/^RULING\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	RulingAsso2:/^.*RULING\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	JudgeNo1Asso: /^JUDGMENT\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeNo1AssoWithDotOral: /^ORAL\sJUDGMENT\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	DecisionAssociate: /^DECISION\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	DecisionAssociateSp1: /REASONS\sFOR\sDECISION\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	Orders:/ORDERS\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeAssociate: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
};

const localJudge = {
	
	ReservedJudgement1:/^RESERVED\sJUDGMENT\sOF\sJUDGE\s([a-zA-Z0-9\s]*)/,
	Judge: /^JUDGMENT\sOF\sJUDGE\s([a-zA-Z0-9\s]*)/,
	Decision: /^DECISION\sOF\sJUDGE\s([a-zA-Z0-9\s]*)/,
	Minute:/^MINUTE\sOF\sJUDGE\s([a-zA-Z0-9\s]*)/,
	Court:/^Court:\tDistrict\sCourt\sJudge\s([a-zA-Z0-9\s]*)/,
	
};

/**
 * Parse Invalid Characters
 * 
 * id=5951 blank
 * id = 7282 blank
 * id = 7423 blank
 * id = 7772 blank
 * id = 30040 TIJDGMENT OF JUDGE K D KELLY should be
 * id = 29118 JUDGMENT OF ASSOCIATE FAIRE
 * @param PostgresqlConnection connection
 */
const run = async (pgPromise, connection, logDir) => {
	console.log('\n-----------------------------------');
	console.log('Parse courts');
	console.log('-----------------------------------\n');

	setLogDir(logDir);
	setLogFile(__filename);

	console.log('Loading all cases and case citations');


	var parsedResult = new Map();
	var unParsedResult = [];

	function extractJustices(justices){
		
		const valuesToRemove = ['and','JJ' ];
		var lastElement = justices.pop().trim();
		var lastTwo;
		
		if(lastElement.includes('and') && !lastElement.includes('JJ') ){
			lastTwo = lastElement.split('and');
		}
		else if(lastElement.includes('&') && !lastElement.includes('JJ') ){
			lastTwo = lastElement.split('&');
		}
		else if(lastElement.includes('&') && lastElement.includes('JJ') ){
			lastTwo = lastElement.split('&');
		}
		else{
			lastTwo = lastElement.split(' ').filter(lastTwo =>  !valuesToRemove.includes(lastTwo) );
		}

		return justices.concat(lastTwo);
	};

	/**
	 * 
	 * @param {*} judgeFname 
	 * @param {*} caseID 
	 * @param {*} titleID 
	 */
	function insertResult(judgeFname, caseID, titleID){
	
		if(!parsedResult.has(judgeFname)){
			parsedResult.set(judgeFname, [ [caseID], [titleID] ] );
		}else{
			var casesApper = parsedResult.get(judgeFname)[0];
			casesApper.push(caseID);
			var titles = parsedResult.get(judgeFname)[1];
			if (!titles.includes(titleID)) titles.push(titleID);
			parsedResult.set(judgeFname, [casesApper, titles]);
		}

	}

    const cases = await connection.any('SELECT * FROM cases.cases ; ');
	const valuesToRemove = ['','Introduction' ];
	
    cases.forEach(

        element => {

        var case_text = element.case_text.split(/\r\n/).filter(text =>  !valuesToRemove.includes(text)   );
		var caseID = element.id;

		var parsed = false;
        for( var i = 0; i < case_text.length; i++){ 
			
			// assojudge cases with judge title_id=5
			for (var key in assoJudge) {
				if(case_text[i].match( assoJudge[key]) ){
					
					var temp = case_text[i].match(assoJudge[key]);
					insertResult([...temp][1], element.id, 5);
					parsed = true;
					break;
				}
			}
			if(parsed) break;
			// justices cases with judge title_id=3
			for (var key in justiceMap) {
				if(case_text[i].match( justiceMap[key]) ){
					
					var temp = case_text[i].match(justiceMap[key]);
					insertResult([...temp][1], element.id, 3);
					parsed = true;
					break;
				}
			}
			if(parsed) break;
			// local cases with judge title_id=7
			for (var key in localJudge) {
				if(case_text[i].match( localJudge[key]) ){
					var temp = case_text[i].match(localJudge[key]);
					insertResult([...temp][1], element.id, 7);
					parsed = true;
					break;
				}
			}
			// console.log(JSON.stringify(case_text[i]));
			// console.log(case_text[i].match( justiceMap.JudgeSP4 ));
			if(parsed) break;
			//id = 29865"Coram:\tGlazebrook J Chambers J O'Regan J"
		
			/**
			 * multiple lines
			 *  11175 20096 
			 * 7165 Court:\r   \rAppearances: no \rCounsel:
			 * 29865 Coram: Glazebrook 
			 */
			else if ( case_text[i].match('Court:\r') && !case_text[i].match('and') ) {
				
				var caseString = [ case_text[i], case_text[i+1], case_text[i+2]].join(' ');
				// console.log(JSON.stringify(caseString));
				var courtIndex = caseString.indexOf('Court:\r');
				var counselIndex = caseString.indexOf('\rCounsel:');
			
				if (counselIndex == -1) counselIndex = caseString.indexOf('\rAppearances:');
				if (counselIndex == -1) counselIndex = caseString.indexOf('Judgment:');

				var judgeStr = caseString.substring(courtIndex+7, counselIndex);
				
				// remove year
				if (judgeStr.match(/\d{4}/ )) judgeStr = judgeStr.substring(judgeStr.match(/\d{4}/ ).index+4);
					
				
				// console.log(JSON.stringify(judgeStr) );
				
				if(judgeStr.includes('and') && !judgeStr.match(/\w+and\w+/)){
					var justices = extractJustices(judgeStr.split(','));
					// console.log(justices)
					justices.forEach(element =>{
						var judge = element.trim();
						if(judge.includes('P'))insertResult(judge.replace('P', '').trim(), caseID, 2);
						else insertResult(judge, caseID, 3);
							
					});
					parsed = true;
					break;
				}
				else if(judgeStr.match(/Judge/)){
					var judges = judgeStr.split(/Judge/);
					judges.forEach(element =>{
						var judge = element.replace(',','').trim();
						if(judge.includes('J'))insertResult(judge.replace('J', '').trim(), caseID, 3);
						else insertResult(judge, caseID, 5);
						
					});
					parsed = true;
					break;
				}
				else{
					var justices = judgeStr.trim().split(/\s/);
					for (var i = 0; i < justices.length; i=i+2) {
						if(justices[i+1] == 'J') insertResult(justices[i], caseID, 3);
						else if(justices[i+1] == 'P') insertResult(justices[i], caseID, 2);
						else if(justices[i+1] == 'CJ') insertResult(justices[i], caseID, 1);
					}
					parsed = true;
					break;
				}
				
			}

			else if ( case_text[i].match('Coram:\t') && !case_text[i].match('and') ) {
				
				var caseString = [ case_text[i], case_text[i+1], case_text[i+2]].join(' ');
				// console.log(JSON.stringify(caseString));
				var courtIndex = caseString.indexOf('Coram:\t');
	
				var counselIndex = caseString.indexOf('\rCounsel:');
				if (counselIndex == -1) counselIndex = caseString.indexOf('Appearances:');
				if (counselIndex == -1) counselIndex = caseString.indexOf('Judgment:');

				var judgeStr = caseString.substring(courtIndex+7, counselIndex);
				
				// remove year
				if (judgeStr.match(/\d{4}/ )) judgeStr = judgeStr.substring(judgeStr.match(/\d{4}/ ).index+4);
					
				if(judgeStr.includes('and') && !judgeStr.match(/\w+and\w+/)){
					var justices = extractJustices(judgeStr.split(','));
					// console.log(justices)
					justices.forEach(element =>{
						var judge = element.trim();
						if(judge.includes('P'))insertResult(judge.replace('P', '').trim(), caseID, 2);
						else insertResult(judge, caseID, 3);
							
					});
					parsed = true;
					break;
				}
				else if(judgeStr.match(/Judge/)){
					var judges = judgeStr.split(/Judge/);
					judges.forEach(element =>{
						var judge = element.replace(',','').trim();
						if(judge.includes('J'))insertResult(judge.replace('J', '').trim(), caseID, 3);
						else insertResult(judge, caseID, 5);
						
					});
					parsed = true;
					break;
				}
				else{
					var justices = judgeStr.trim().split(/\s/);
					for (var i = 0; i < justices.length; i=i+2) {
						if(justices[i+1] == 'J') insertResult(justices[i], caseID, 3);
						else if(justices[i+1] == 'P') insertResult(justices[i], caseID, 2);
						else if(justices[i+1] == 'CJ') insertResult(justices[i], caseID, 1);
					}
					parsed = true;
					break;
				}
				
			}
			
			else if (case_text[i].match('Court:\r') ) {
				
				var splitByR = String(case_text[i] + '\r'+ case_text[i+1]).split('\r');
				
				var courtIndex = splitByR.indexOf('Court:');
				var element = splitByR[courtIndex+1].split(',') ;
				
				var justices = extractJustices([...element]);
				
				justices.forEach(element =>{
					var judge = element.trim();
					if(judge.includes(' P'))insertResult(judge.replace(' P', '').trim(), caseID, 2);
					else if(judge.includes(' J'))insertResult(judge.replace(' J', '').trim(), caseID, 3);
					else insertResult(judge, caseID, 3);
						
				});
				parsed = true;
				break;
			}

			// Example: 27222 court:\t
			else if (case_text[i].match('Court:\t') ) {
				
				var caseString = [ case_text[i], case_text[i+1], case_text[i+2]].join(' ');
				//console.log(JSON.stringify(caseString));
				var courtIndex = caseString.indexOf('Court:\t');
				var counselIndex = caseString.indexOf('Counsel:');
			
				if (counselIndex == -1) counselIndex = caseString.indexOf('Appearances:');
				
				if (counselIndex == -1) counselIndex = caseString.indexOf('Judgment:');

				var judgeStr = caseString.substring(courtIndex+7, counselIndex);
				
				// remove year
				if (judgeStr.match(/\d{4}/ )) judgeStr = judgeStr.substring(judgeStr.match(/\d{4}/ ).index+4);
				
				if(judgeStr.includes('and') && !judgeStr.match(/\w+and\w+/)){
					var justices = extractJustices(judgeStr.split(','));
					// console.log(justices)
					justices.forEach(element =>{
						var judge = element.trim();
						if(judge.includes('P'))insertResult(judge.replace('P', '').trim(), caseID, 2);
						if(judge.includes('J'))insertResult(judge.replace('J', '').trim(), caseID, 3);
						else insertResult(judge, caseID, 3);
							
					});
					parsed = true;
					break;
				}
				else if(judgeStr.match(/Judge/)){
					var judges = judgeStr.split(/Judge/);
					judges.forEach(element =>{
						var judge = element.replace(',','').trim();
						if(judge.includes('J'))insertResult(judge.replace('J', '').trim(), caseID, 3);
						else insertResult(judge, caseID, 5);
						
					});
					parsed = true;
					break;
				}
			}
			
		}
		
	if(!parsed) unParsedResult.push(caseID);

	});

	const fs = require('fs');
	let outputData = unParsedResult.toString();
	
	fs.writeFileSync('ParseJudgeBugCases.txt',outputData, function (err) {
		if (err) 
			return console.log(err);
	}); 

	var judgeInsertQueries = [];
	var judgeRelationInsertQueries = [];

	var judgeID = 1;
	var judgeRelationID = 1;
	parsedResult.forEach(
		(value,key)=>{
			key = key.replace('\'', '\'\'');
			if(key.length > 20 || key.length <2 || key.toLowerCase() == "the" || key.toLowerCase() == "judge" 
			|| key.toLowerCase() == "er" || key.toLowerCase() == "hon" || key.toLowerCase() == "court"){
				console.log(`[${key}] = ${value[0]} = ${value[1]}`);
				
			}else{
				console.log(`INSERT INTO cases.judges(id,last_name) VALUES(\'${judgeID}\', \'${key}\') ON CONFLICT DO NOTHING`);
				judgeInsertQueries.push(`INSERT INTO cases.judges(id,last_name) VALUES (\'${judgeID}\', \'${key}\') ON CONFLICT DO NOTHING;`);

				value[1].forEach(
					titleID =>{
						console.log(`INSERT INTO judges_title_relation (id, judge_id， judge_title_id) 
						VALUES ('${judgeRelationID}', '${judgeID}', '${titleID}') ON CONFLICT DO NOTHING`);
						judgeRelationInsertQueries.push(`INSERT INTO cases.judges_title_relation (id, judge_id, judge_title_id) 
						VALUES ('${judgeRelationID}', '${judgeID}', '${titleID}') ON CONFLICT DO NOTHING`);
						judgeRelationID++;
					}
				);
				judgeID++;
			}
	});


	console.log('Insert judge table', judgeInsertQueries.length, 'Insert judge relation table', judgeRelationInsertQueries.length);
	if (judgeInsertQueries.length > 0) {
		await connection.multi(judgeInsertQueries.join(';'));

	}

	if (judgeRelationInsertQueries.length > 0) {
		await connection.multi(judgeRelationInsertQueries.join(';'));
	}

	console.log( `${unParsedResult.length} cases unparsed`);
	console.log('Done');
};



if (require.main === module) {
	const argv = require('yargs').argv;
	(async () => {
		try {
            const { pgPromise, connection, logDir } = await require('../common/setup')(argv.env);
            console.log(argv.env);
			await run(pgPromise, connection, logDir);
		} catch (ex) {
			console.log(ex);
		}
	})().finally(process.exit);
} else {
	module.exports = run;
	module.exports.courtsMap = courtsMap;
}
