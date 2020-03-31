const { Dataset, Organization, Product, User } = require('../models');
const formatter = require('../utils/formatter');
const helper = require('../utils/helper');



module.exports = {
	getUserInfo: async (req, res, next) => {
		try {
			const { IMSHID } = req.cookies;

			const [ userInfo ] = await User.query().where('login', IMSHID);
			const user = await formatter.changeKeysCase(userInfo, false);
			
			const productInfo = await Product.query()
				.select('*')
				.leftJoinRelation('users as u')
				.where('u.id', '=', user.id);

			const products = await formatter.changeKeysCase(productInfo, false);
			user.products = products;

			const organizationInfo = await Organization.query().findById(user.organization_id);

			const organization = await formatter.changeKeysCase(organizationInfo, false);

			const datasetsInfo  = await Dataset.query().where('organization_id', '=', organization.id);

			const datasets = await formatter.changeKeysCase(datasetsInfo, false);
			organization.datasets = datasets;
			

			res.send({ organization, user });
		} catch (err) {
			helper.controllerErrorRaised('getUserInfo', err, next);
		}
	}
};