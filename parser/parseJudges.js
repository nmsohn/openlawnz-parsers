const { setLogFile, setLogDir, log } = require('../common/functions').makeLogger();

const judgeMap = {
	SentNote: /SENTENCING\sNOTES\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Sent:/SENTENCE\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	SentRemarks:/SENTENCING\sREMARKS\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeAssociate: /JUDGMENT\sOF\sASSOCIATE\sJUDGE\s([a-zA-Z0-9\s]*)/,
	Judge: /JUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeSPCase: /JUDGEMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
	Judge: /COSTS\sJUDGMENT\sOF\s([a-zA-Z0-9\s]*)\sJ/,	
	

	JudgeNo1WithDot: /JUDGMENT\s\(NO.\s1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo1WithNotDot: /JUDGMENT\s\(NO\s1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJust1: /JUDGEMENT\s\(1\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo1Asso: /JUDGMENT\s\(No.\s1\)\sOF\sASSOCIATE\sJUDGE\s([a-zA-Z0-9\s]*)/,
	
	JudgeNo2WithDot: /JUDGMENT\s\(NO.\s2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo2WithNotDot: /JUDGMENT\s\(NO\s2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJust2: /JUDGEMENT\s\(2\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo2Asso: /JUDGMENT\s\(No.\s2\)\sOF\sASSOCIATE\sJUDGE\s([a-zA-Z0-9\s]*)/,

	JudgeNo3WithDot: /JUDGMENT\s\(NO.\s3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo3WithNotDot: /JUDGMENT\s\(NO\s3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeJust3: /JUDGEMENT\s\(3\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeNo3Asso: /JUDGMENT\s\(No.\s3\)\sOF\sASSOCIATE\sJUDGE\s([a-zA-Z0-9\s]*)/,

	JudgeOnThePaper: /JUDGMENT\s\(ON\sTHE\sPAPERS\)\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	JudgeOral:/ORAL\sJUDGMENT\sOF\s(\w+)\sJ/,
	JudgeTheCourt:/\(Given\sby\s(\S*)\sJ\)/,
	JudgeInterim:/INTERIM\sJUDGMENT\sOF\sTHE\sHON\sJUSTICE\s([a-zA-Z0-9\s]*)/,
	
	OralRulingAsso:/ORAL\sRULING\sOF\sASSOCIATE\sJUDGE\s([a-zA-Z0-9\s]*)/,

	Ruling:/RULING\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	
	Ruling1:/RULING\s1\sOF\s([a-zA-Z0-9\s]*)\sJ/,
	Ruling2:/RULING\s2\sOF\s([a-zA-Z0-9\s]*)\sJ/,
};

/**
 * Parse Invalid Characters
 * @param PostgresqlConnection connection
 */
const run = async (pgPromise, connection, logDir) => {
	console.log('\n-----------------------------------');
	console.log('Parse courts');
	console.log('-----------------------------------\n');

	setLogDir(logDir);
	setLogFile(__filename);

	console.log('Loading all cases and case citations');


    const courts = await connection.any('SELECT * FROM cases.cases limit 500');
    const valuesToRemove = ['','Introduction' ];
    courts.forEach(

        element => {
         
        var case_text = element.case_text.split(/\r\n/).filter(text =>  !valuesToRemove.includes(text)   );
		// console.log(element.case_text);

		let low = 9999;
		let count = 0;
		
		

        for( var i = 0; i < case_text.length; i++){ 
			

			let regFlag = false;
			for (var key in judgeMap) {
			
				if(case_text[i].match( judgeMap[key]) ){
					
					var test = case_text[i].match(judgeMap[key]);
					element.case_text = [...test];
					regFlag = true;
					break;
				}
			}

			if(regFlag) break;
			// special case: id = 11175
			else if (case_text[i].match('Court:\r') && !case_text[i].match('and') ) {
				var splitByR =case_text[i+1].split('\r');
				var element = splitByR[0].split(',') ;
				element.case_text = [...element];
					
				break;
			}
			else if (case_text[i].match('Court:\r') ) {
				

				var splitByR = String(case_text[i] + '\r'+ case_text[i+1]).split('\r');
				var courtIndex = splitByR.indexOf('Court:');
					
				var element = splitByR[courtIndex+1].split(',') ;
					
				element.case_text = [...element];
					
				break;
			}

			else{
				if ( case_text[i].match(/^\[[\d-]{1,3}\]\s/) ||case_text[i].match(/^\(\w+\)\s/) ) {
					if(i < low){
						low = i;
					}
					count = i - low + 1;
				}

			}
			
         }

		if(low != 9999 && count != 0){
			case_text.splice(low,count);
			element.case_text = case_text
			
		}
		console.log(element.id, element.case_text);
		

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
