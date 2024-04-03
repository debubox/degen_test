
const fs = require('fs');

const URLS_PATH = '../urls';


const lpAbi = fs.readFileSync('../contracts/LP.abi.json').toString();
const uniAbi = fs.readFileSync('../contracts/Uniswap.abi.json').toString();
const privateKey = fs.readFileSync('../.acer1').toString();

const Web3 = require('web3');
const web3 = new Web3('https://rpc.degen.tips');
web3.eth.accounts.wallet.add(privateKey);
const uni = new web3.eth.Contract(JSON.parse(uniAbi), '0x5a8e4e0dd630395b5afb8d3ac5b3ef269f0c8356');


const wdegen = new web3.eth.Contract(JSON.parse(lpAbi), '0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387');


const Migrations = artifacts.require("Migrations");
const MyToken = artifacts.require("Token");


//0xD79f40D9334b0368C3F4d9Fc7bFE48848921e4dd
const myAddress = '0xC702ae412d07914C8c0b3f3a3F078d2e5B8C02E9';

module.exports = async function (deployer) {
	await deployer.deploy(Migrations);
	
	const tokenName = 'CET'+(''+new Date().getTime()).substring(8,13);
	
	const token = await deployer.deploy(MyToken, tokenName, tokenName);
	console.log('TOKENADDRESSTOKEN ' + token.address + ' TOKENADDRESSTOKEN')
	
	await token.approve('0x5a8e4e0dd630395b5afb8d3ac5b3ef269f0c8356', '420000000000000000000000000');
	
	
	const data = await uni.methods.addLiquidityETH(
		token.address, 
		'100000000000000000000000', 
		'100000000000000000000000',
		'10000000000000000',
		myAddress,
		''+new Date().getTime()+10000
	).send({
		gasLimit: 5733484, 
		value: '10000000000000000', 
		from: myAddress
	});


	
	
	const lpAddress = data.events['5'].address;
	const lpToken = new web3.eth.Contract(JSON.parse(lpAbi), lpAddress);

	console.log('Wait for magic');
	await sleepForSecs(20)

	
	const wdegenBalance = await wdegen.methods.balanceOf(
		lpAddress
	).call();



	console.log('WDEGEN Balance = ' + wdegenBalance + ' /// ' + wdegenBalance.length);

	if (wdegenBalance == '10000000000000000' || wdegenBalance.length < 19) {
		console.log('No Freebies');
		return;
	}


	await lpToken.methods.approve(
		'0x5a8e4e0dd630395b5afb8d3ac5b3ef269f0c8356',
		'115792089237316195423570985008687907853269984665640564039457584007913129639935'
	).send({
		gasLimit: 5733484,
		from: myAddress
	});






	await uni.methods.removeLiquidityETH(
		token.address,
		'31622776601683792319', //lp quantity
		'0', //token
		'0', //eth
		myAddress,
		''+new Date().getTime()+10
	).send({
		gasLimit: 5733484,
		from: myAddress
	});
};


function sleepForSecs(secs) {
	return new Promise(resolve => setTimeout(resolve, secs*1000));
}