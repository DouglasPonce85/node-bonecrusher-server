const organizations = [
	{
		id: 1,
		name: 'Lilly',
		code: 'LILLY',
		clusterid: 'us0201',
		crmsid: '700040',
		products: [
			{
				id: 1,
				name: 'Cloudera',
				enabled: true,
				url: 'https://abc.efg/xyz'
			},
			{
				id: 2,
				name: 'SAS',
				image: 'https://img.url/img.png',
				enabled: false,
				url: 'https://abc.efg/xyz'
			}
		]
	},
	{
		id: 2,
		name: 'Merck',
		code: 'MERCK',
		clusterid: 'us0101',
		crmsid: '500391',
		products: [
			{
				id: 1,
				name: 'Cloudera',
				enabled: true,
				url: 'https://abc.efg/xyz'
			},
			{
				id: 2,
				name: 'SAS',
				image: 'https://img.url/img.png',
				enabled: false,
				url: 'https://sas.xyz/abc'
			}
		]
	}
];

module.exports = organizations;
