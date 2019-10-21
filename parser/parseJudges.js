const { setLogFile, setLogDir, log } = require('../common/functions').makeLogger();

const justiceMap = {
	SentNote: /^SENTENCING\sNOTES\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentHon:/^SENTENCE\sOF\sHON\sJUSTICE\s(.*)/,
	Sent:/^SENTENCE\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentRemarks:/^SENTENCING\sREMARKS\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	JudgeHonJustice:/^JUDGMENT\sOF\sHON\sJUSTICE\s(.*)/,
	JudgeTheCourtDelivered: /^JUDGMENT\sOF\sTHE\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJustice: /^JUDGMENT\sOF\sJUSTICE\s(.*)/,
	JudgeCosts: /^COSTS\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
	
	// JudgeNo1WithDot: /^JUDGMENT\s\(NO.\s1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeNo1WithNotDot: /^JUDGMENT\s\(NO\s1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJust1: /^JUDGEMENT\s\(.*\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeJust1SPCase: /^JUDGMENT\s\(1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	
	
	// JudgeNo2WithDot: /^JUDGMENT\s\(NO.\s2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeNo2WithNotDot: /^JUDGMENT\s\(NO\s2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeJust2: /^JUDGEMENT\s\(2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	

	// JudgeNo3WithDot: /^JUDGMENT\s\(NO.\s3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeNo3WithNotDot: /^JUDGMENT\s\(NO\s3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	// JudgeJust3: /^JUDGEMENT\s\(3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	

	// JudgeOnThePaper: /^JUDGMENT\s\(ON\sTHE\sPAPERS\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeOralHon:/^ORAL\sJUDGMENT\sOF\sHON\sJUSTICE\s(.*)/,
	JudgeOral:/^ORAL\sJUDGMENT\sOF\s(\w+)\sJ/,
	JudgeTheCourt:/^\(Given\sby\s(\S*)\sJ\)/,
	JudgeTheCourtSp1:/^JUDGMENT\sOF\sTHE\sCOURT\sON\sCOSTS\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp2:/^JUDGMENT\sOF\sTHE\sCOURT\sAS\sTO\sCOSTS\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp3:/^JUDGMENT\sOF\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp4:/^JUDGMENT\sOF\sTHE\sCOURT\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeTheCourtSp5:/^JUDGMENT\sOF\sCOURT\sOF\sDELIVERED\sBY\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeInterim:/^INTERIM\sJUDGMENT\sOF\sTHE\sHON\sJUSTICE\s(.*)/,

	Ruling:/^RULING\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Ruling1:/^RULING\s1\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Ruling2:/^RULING\s2\sOF\s([a-zA-Z0-9\s]*)\sJ/,

	Judge: /^JUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSP1: /^JUDGEMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
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

	OralJudgeAssociateSp1: /^ORAL\sJUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)\s\(.*\)/,
	OralJudgeAssociate: /^ORAL\sJUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	
	OralRulingAsso:/^ORAL\sRULING\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	JudgeNo1Asso: /^JUDGMENT\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	JudgeNo1AssoWithDotOral: /^ORAL\sJUDGMENT\s\(.*\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	// JudgeNo2Asso: /^JUDGMENT\s\(No.\s2\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	// JudgeNo2AssoWithDotOral: /^ORAL\sJUDGMENT\s\(No.2\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	// JudgeNo3Asso: /^JUDGMENT\s\(No.\s3\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,
	// JudgeNo3AssoWithDotOral: /^ORAL\sJUDGMENT\s\(No.3\)\sOF\sASSOCIATE\sJUDGE\s(.*)/,

	JudgeAssociate: /^JUDGMENT\sOF\sASSOCIATE\sJUDGE\s(.*)/,
};



/**
 * Parse Invalid Characters
 * 
 * id=5951 blank
 * id = 7282 blank
 * id = 7423 blank
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
			lastTwo = lastElement.split(' ').filter(lastTwo =>  !valuesToRemove.includes(lastTwo)   );
		}

		return justices.concat(lastTwo);
	};

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

    const cases = await connection.any('SELECT * FROM cases.cases where  id = 13284');
	const valuesToRemove = ['','Introduction' ];
	
    cases.forEach(

        element => {

        var case_text = element.case_text.split(/\r\n/).filter(text =>  !valuesToRemove.includes(text)   );
		var caseID = element.id;

		var parsed = false;
        for( var i = 0; i < case_text.length; i++){ 
			
			for (var key in assoJudge) {
				if(case_text[i].match( assoJudge[key]) ){
					
					var temp = case_text[i].match(assoJudge[key]);
					insertResult([...temp][1], element.id, 5);
					parsed = true;
					break;
				}
			}

			if(parsed) break;
			
			for (var key in justiceMap) {
				
				if(case_text[i].match( justiceMap[key]) ){
					
					var temp = case_text[i].match(justiceMap[key]);
					insertResult([...temp][1], element.id, 3);
					parsed = true;
					break;
				}
			}
			
			if(parsed) break;
			
			/**
			 * multiple lines
			 *  11175 20096 
			 * 7165 Court:\r   \rAppearances: no \rCounsel:
			 */
			else if (case_text[i].match('Court:\r') && !case_text[i].match('and') ) {
				
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
					console.log(justices)
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
		}
		
	if(!parsed) unParsedResult.push(caseID);

	});
	
	function logMapElements(value, key, map) {
		console.log(`[${key}] = ${value[0]} = ${value[1]}`);
	}
	  
	parsedResult.forEach(logMapElements);

	const fs = require('fs');
	let outputData = unParsedResult.toString();
	
	fs.writeFileSync('ParseJudgeBugCases.txt',outputData, function (err) {
		if (err) 
			return console.log(err);
	}); 
	
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
