var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('customer/list',{title:"Customers",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('nama', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_nis = req.sanitize( 'nis' ).escape().trim();
		v_gender = req.sanitize( 'gender' ).escape();
		v_jurusan = req.sanitize( 'jurusan' ).escape().trim();
		v_foto = req.sanitize( 'foto' ).escape();

		var customer = {
			nama: v_nama,
			nis: v_nis,
			gender: v_gender,
			jurusan : v_jurusan,
			foto : v_foto
		}

		var insert_sql = 'INSERT INTO customer SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/add-customer', 
					{ 
						nama: req.param('nama'), 
						nis: req.param('nis'),
						gender: req.param('gender'),
						jurusan: req.param('jurusan'),
					});
				}else{
					req.flash('msg_info', 'Create customer success'); 
					res.redirect('/customers');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			nama: req.param('nama'), 
			nis: req.param('nis')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'customer/add-customer', 
	{ 
		title: 'Tambahkan siswa',
		nama: '',
		nis: '',
		gender:'',
		jurusan:'',
		foto:''
	});
});
router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM customer where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/customers'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Customer can't be find!"); 
					res.redirect('/customers');
				}
				else
				{	
					console.log(rows);
					res.render('customer/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('nama', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_nis = req.sanitize( 'nis' ).escape().trim();
		v_gender = req.sanitize( 'gender' ).escape();
		v_jurusan = req.sanitize( 'jurusan' ).escape().trim();
		v_foto = req.sanitize( 'foto' ).escape();

		var customer = {
			nama: v_nama,
			nis: v_nis,
			gender: v_gender,
			jurusan : v_jurusan,
			foto : v_foto
		}

		var update_sql = 'update customer SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('customer/edit', 
					{ 
						nama: req.param('nama'), 
						nis: req.param('nis'),
						gender: req.param('gender'),
						jurusan: req.param('jurusan'),
						foto: req.param('foto')
					});
				}else{
					req.flash('msg_info', 'Update customer success'); 
					res.redirect('/customers/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('customer/add-customer', 
		{ 
			nama: req.param('nama'), 
			nis: req.param('nis')
		});
	}
});
router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var customer = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from customer where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, customer, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/customers');
				}
				else{
					req.flash('msg_info', 'Delete Customer Success'); 
					res.redirect('/customers');
				}
			});
		});
	});
});
module.exports = router;