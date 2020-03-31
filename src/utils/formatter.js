

const getWithKeysChanged = (el, type) => {
	return Object.keys(el).reduce((accum, curr) => {
		accum[curr[type]()] = el[curr];
		return accum;
	}, {})
}


module.exports = {
	changeKeysCase: async (el, t) => {	
		try {
			if (el === null) {
				throw new Error('Trying to format null in response');
			}

			const type = t ? 'toUpperCase' : 'toLowerCase';

			if (typeof el.length === 'undefined') {
				return getWithKeysChanged(el, type);
			}
	
			return el.map(ob=> getWithKeysChanged(ob, type));
		}catch(err){
			throw err;
		}
	}
};