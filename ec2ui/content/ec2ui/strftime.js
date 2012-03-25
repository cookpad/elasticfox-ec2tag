/* With due thanks to http://whytheluckystiff.net */
/* other support functions -- thanks, ecmanaut! */
var strftime_funks = {
  zeropad: function( n ){ return n>9 ? n : '0'+n; },
  a: function(t) { return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.getDay()] },
  A: function(t) { return ['Sunday','Monday','Tuedsay','Wednesday','Thursday','Friday','Saturday'][t.getDay()] },
  b: function(t) { return ['Jan','Feb','Mar','Apr','May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'][t.getMonth()] },
  B: function(t) { return ['January','February','March','April','May','June', 'July','August',
      'September','October','November','December'][t.getMonth()] },
  c: function(t) { return t.toString() },
  d: function(t) { return this.zeropad(t.getDate()) },
  H: function(t) { return this.zeropad(t.getHours()) },
  I: function(t) { return this.zeropad((t.getHours() + 12) % 12) },
  m: function(t) { return this.zeropad(t.getMonth()+1) }, // month-1
  M: function(t) { return this.zeropad(t.getMinutes()) },
  p: function(t) { return this.H(t) < 12 ? 'AM' : 'PM'; },
  S: function(t) { return this.zeropad(t.getSeconds()) },
  w: function(t) { return t.getDay() }, // 0..6 == sun..sat
  y: function(t) { return this.zeropad(this.Y(t) % 100); },
  Y: function(t) { return t.getFullYear() },
  '%': function(t) { return '%' }
};

Date.prototype.strftime = function (fmt) {
    var t = this;
    for (var s in strftime_funks) {
        if (s.length == 1 )
            fmt = fmt.replace('%' + s, strftime_funks[s](t));
    }
    return fmt;
};

if (typeof(TrimPath) != 'undefined') {
    TrimPath.parseTemplate_etc.modifierDef.strftime = function (t, fmt) {
        return new Date(t).strftime(fmt);
    }
}
