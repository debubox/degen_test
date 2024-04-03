const fs = require('fs');
const shell = require('shelljs');

const URLS_PATH = './urls';

let counter = 0;
let success = 0;

function runCmd() {
	counter++;
	console.log('Starting Action ' + counter);
	console.log('Success Cases' + success);

	const child = shell.exec('truffle migrate --reset --network ropsten', {async: true, silent: false});
	
	let outputData = '';

	child.stdout.on('data', data => {
		outputData += data;
	});
	
	child.stdout.on('close', () => {
		const tokenAddress = (outputData.split('TOKENADDRESSTOKEN').slice(1)+''.trim()).substring(0,43);

		if (outputData.includes('No Freebies')) {
			console.log('\n\n\n\n' + new Date() + ' /// NEXT TRY IN 15 MINS /// ' + tokenAddress);
			setTimeout(() => {
				runCmd();
			}, 1000*60*15);
			return;
		}

		success++;

		// fs.appendFileSync(URLS_PATH, '\n'+tokenAddress);
		runCmd();
		// shell.exec(`start https://dex.swapdegen.tips/#/remove/v2/${tokenAddress}/EVMOS`);
	});
}
runCmd();