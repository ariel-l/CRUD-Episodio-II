const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJSON = (products) => {
	fs.writeFileSync(productsFilePath, JSON.stringify(products), 'utf-8')
}
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products', {
			products,
			toThousand,
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const productID = req.params.id

		const productFound = products.find(product => product.id === +productID)

		res.render('detail', {
			productFound,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form.ejs')
	},
	
	// Create -  Method to store
	store: (req, res) => {

		const lastID = products[products.length - 1].id

		const newProduct = {
			id: lastID + 1,
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.file ? req.file.filename : 'default-image.png',
		}

		products.push(newProduct)

		writeJSON(products)

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const productID = req.params.id

		const productToEdit = products.find(product => product.id === +productID)
		
		res.render('product-edit-form', {
			productToEdit,
		})
		
	},
	// Update - Method to update
	update: (req, res) => {
		const productID = req.params.id

		products.forEach(product => {
			if (product.id === +productID) {
				console.log(req.file.filename);
				console.log('hola')
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
				product.image = req.file ? req.file.filename : product.image;
			}
		}); 

		writeJSON(products)

		res.redirect('/products/detail/' + productID)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const productID = req.params.id

		products.forEach(product => {
			if (product.id === +productID) {
				const productToDestroy = products.indexOf(product)
				products.splice(productToDestroy, 1)
			}
		})

		writeJSON(products)

		res.redirect('/products')
	}
};

module.exports = controller;