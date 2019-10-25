// Copyright (c) 2019, MDB and contributors
// For license information, please see license.txt

frappe.ui.form.on('Pengembalian', {
	// refresh: function(frm) {

	// }
	id_pinjaman: function (frm) {
        frm.doc.data_pengembalian_buku = []
        if (frm.doc.id_pinjaman) {
            frappe.call({
                method: "frappe.client.get",
                args: {
					doctype: "Pinjaman",
					name: frm.doc.id_pinjaman
                },
                callback: function (r) {
                    if (r.message) {
                        for (var row in r.message.data_pinjaman_buku) {
                            var child = frm.add_child("data_pengembalian_buku");
                            frappe.model.set_value(child.doctype, child.name, "code_buku",
                                r.message.data_pinjaman_buku[row].code_buku);
                            frappe.model.set_value(child.doctype, child.name, "nama_buku",
                                r.message.data_pinjaman_buku[row].nama_buku);
                            frappe.model.set_value(child.doctype, child.name, "tipe_buku",
                                r.message.data_pinjaman_buku[row].tipe_buku);
                        }
                    }
                    frm.refresh_field('data_pengembalian_buku')
                }
            })
		}
	},
	
	tanggal_kembali:function(frm){
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Pinjaman",
				name: frm.doc.id_pinjaman
			},
		callback: function(r) {
			if(r.message) {
				
				var tanggal=r.message.tanggal_pinjam;
				var kembali=r.message.estimasi_tanggal_kembali;
				if(frm.doc.tanggal_kembali<tanggal)
				{
					frm.set_value('tanggal_kembali','');
					frappe.throw('Tidak Bisa Memilih Tanggal Terdahulu');
					
				}
				else if(frm.doc.tanggal_kembali>kembali)
				{
					
					var tanggal_kembali=frm.doc.tanggal_kembali;
					var dt1= new Date(tanggal_kembali);
					var dt2= new Date(kembali);
					var Difference_In_Time = dt1.getTime() - dt2.getTime(); 
					var denda = Difference_In_Time / (1000 * 3600 * 24); 
					var hasil= denda*5000;
					frm.set_value('denda',hasil);
				}
			
			}
			
		}
			// if (frm.doc.tanggal_kembali < tanggal_pinjam){
			// 	frappe.throw('You can not select past date in From Date');
			// }
})
	}
});


cur_frm.set_query('id_pinjaman', function() {
	return{
		filters: [
			['Pinjaman', 'status', '=', 'On Borrow']
		]
	}
});
