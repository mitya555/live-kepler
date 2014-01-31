Number.prototype.toCalculated = function(precision) {
	if (!precision)
		precision = 4;
	return this == 0 ? 0 : this < .01 && this > -.01 ? this.toExponential(precision - 1) : this.toPrecision(precision);
};

function smvxy(dim,  $c) {
	var m_ = model_from_ui(dim, $c);
	$('#inp_smvx').val(m_.smv('vx').toCalculated());
	$('#inp_smvy').val(m_.smv('vy').toCalculated());
}

function x_y_r(x, y, i, id_x, id_y, id_r, lb_x, lb_y, lb_r, $c, dim) {
	var	idX = 'inp_' + id_x + '_' + i, idY = 'inp_' + id_y + '_' + i, idR = 'inp_' + id_r + '_' + i,
		selX = '#' + idX, selY = '#' + idY, selR = '#' + idR;
	function c0() {
		if (id_r == 'v')
			smvxy(dim,  $c);
	}
	function c1() {
		var x_=$(selX).val(), y_=$(selY).val();
		if (isNaN(x_) || isNaN(y_))
			return;
		$(selR).val(Math.sqrt(x_*x_+y_*y_).toCalculated());
		c0();
	}
	function c2() {
		var x_=$(selX).val(), y_=$(selY).val(), r__=$(selR).val();
		if (isNaN(x_) || isNaN(y_) || isNaN(r__))
			return;
		var r_=Math.sqrt(x_*x_+y_*y_);
		$(selX).val((r__*x_/r_).toCalculated());
		$(selY).val((r__*y_/r_).toCalculated());
		c0();
	}
	$('<span>' + lb_x + ': </span>').appendTo($c);
	$('<input type="text" value="' + x[i] + '" style="width:50px;" id="' + idX + '" />').change(c1).bind('input', c1).appendTo($c);
	$('<span>&nbsp; ' + lb_y + ': </span>').appendTo($c);
	$('<input type="text" value="' + y[i] + '" style="width:50px;" id="' + idY + '" />').change(c1).bind('input', c1).appendTo($c);
	$('<span>&nbsp; |' + lb_r + '|: </span>').appendTo($c);
	$('<input type="text" value="' + Math.sqrt(x[i]*x[i]+y[i]*y[i]).toCalculated() + '" style="width:60px;margin-right:50px;" id="' + idR + '" />').change(c2).bind('input', c2).appendTo($c);
}

function ui_from_model(dim, model, $c) {
	dim = model.m.length;
	var smvx = 0, smvy = 0;
	function c1() { smvxy(dim, $c); }
	for (var i=0; i<dim; i++) {
		var lb_sub = '<sub>' + i + '</sub>';
		x_y_r(model.x, model.y, i, 'x', 'y', 'r', 'X' + lb_sub, 'Y' + lb_sub, 'R' + lb_sub, $c, dim);
		$c.append('&nbsp; &nbsp; ');
		x_y_r(model.vx, model.vy, i, 'vx', 'vy', 'v', 'V<sub>X' + lb_sub + '</sub>', 'V<sub>Y' + lb_sub + '</sub>', 'V' + lb_sub, $c, dim);
		$c.append('&nbsp; &nbsp; ');
		$('<span>M' + lb_sub + ': </span>').appendTo($c);
		$('<input type="text" value="' + model.m[i] + '" style="width:50px;" id="inp_m_' + i + '" />').change(c1).bind('input', c1).appendTo($c);
		$c.append('<hr />');
		smvx += model.m[i] * model.vx[i];
		smvy += model.m[i] * model.vy[i];
	}
	$('<span>&#931;(M<sub>i</sub>*V<sub>X<sub>i</sub></sub>) = </span>').appendTo($c);
	$('<input type="text" value="' + smvx.toCalculated() + '" style="width:50px;border-color:transparent;" readonly="readonly" id="inp_smvx" />').appendTo($c);
	$c.append('<br />');
	$('<span>&#931;(M<sub>i</sub>*V<sub>Y<sub>i</sub></sub>) = </span>').appendTo($c);
	$('<input type="text" value="' + smvy.toCalculated() + '" style="width:50px;border-color:transparent;" readonly="readonly" id="inp_smvy" />').appendTo($c);
	$c.append('<br /><br />');
	return dim;
}

function model_from_ui(dim, $c) {
	function set_prop(res, p, i) {
		if (!res[p])
			res[p]=[];
		res[p][i]=parseFloat($c.find('#inp_' + p + '_' + i).val());
	}
	var res={}, props=['x','y','vx','vy','m'];
	for (var i=0; i<dim; i++)
		for (var j=0; j<props.length; j++)
			set_prop(res, props[j], i);
	res.smv = function(vn) {
		var smv = 0;
		for (var i=0; i<dim; i++)
			smv += this.m[i] * this[vn][i];
		return smv;
	};
	return res;
}
