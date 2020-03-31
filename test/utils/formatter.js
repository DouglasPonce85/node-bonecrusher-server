const formatter = require('../../src/utils/formatter');
const { expect } = require('chai');


describe('Formatter Util Test', () => {

	it('Should convert keys to lower case in a javascript object', async() => {
		const initObj = {
			"ID": 1,
			"NAME": "Hue",
			"ICON": 1,
			"INFOURL": "http://iqvia.com/"
		};

		const transformed = await formatter.changeKeysCase(initObj, false);

		const expectedObj = {
			"id": 1,
			"name": "Hue",
			"icon": 1,
			"infourl": "http://iqvia.com/"
		};

		expect(transformed).to.deep.equal(expectedObj);
	});
	
	it('Should convert keys to lower case in a javascript array of objects', async() => {
		const initArr = [
			{
				"ID": 1,
				"NAME": "Hue",
				"ICON": 1,
				"INFOURL": "http://iqvia.com/"
			},
			{
				"ID": 21,
				"NAME": "SAS",
				"ICON": 1,
				"INFOURL": "http://img.url/img"
			}
		];

		const transformed = await formatter.changeKeysCase(initArr, false);

		const expectedArr = [
			{
				"id": 1,
				"name": "Hue",
				"icon": 1,
				"infourl": "http://iqvia.com/"
			},
			{
				"id": 21,
				"name": "SAS",
				"icon": 1,
				"infourl": "http://img.url/img"
			}
		];

		expect(transformed).to.deep.equal(expectedArr);
	});


	it('Should convert keys to upper case in a javascript object', async() => {
		const initObj = {
			"id": 1,
			"name": "Hue",
			"icon": 1,
			"infourl": "http://iqvia.com/"
		};

		const transformed = await formatter.changeKeysCase(initObj, true);

		const expectedObj = {
			"ID": 1,
			"NAME": "Hue",
			"ICON": 1,
			"INFOURL": "http://iqvia.com/"
		};

		expect(transformed).to.deep.equal(expectedObj);
	});
	
	it('Should convert keys to upper case in a javascript array of objects', async() => {
		const initArr = [
			{
				"id": 1,
				"name": "Hue",
				"icon": 1,
				"infourl": "http://iqvia.com/"
			},
			{
				"id": 21,
				"name": "SAS",
				"icon": 1,
				"infourl": "http://img.url/img"
			}
		];
		
		const transformed = await formatter.changeKeysCase(initArr, true);

		const expectedArr = [
			{
				"ID": 1,
				"NAME": "Hue",
				"ICON": 1,
				"INFOURL": "http://iqvia.com/"
			},
			{
				"ID": 21,
				"NAME": "SAS",
				"ICON": 1,
				"INFOURL": "http://img.url/img"
			}
		];

		expect(transformed).to.deep.equal(expectedArr);
	});
})