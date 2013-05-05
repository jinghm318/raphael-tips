/**/
var Tip = {
  drawTip : function(rph, x, y, w, h, tW, tH, tSide, r, str, tipAttr, textAttr){
    var tip = rph.set();
    var _ = this;
    var defaultTipAttr = {
      "stroke" : "#000", 
      "fill" : "#000", 
      "stroke-width" :0
    };
    var defaultTextAttr = {
      "fill" : '#fff',
      "font-size" : 12,
      "text-anchor" : "middle"
    };
    if(tipAttr){
      defaultTipAttr = $.extend(defaultTipAttr, tipAttr);
      console.log(defaultTipAttr);
    }
    if(textAttr){
      defaultTextAttr = $.extend(defaultTextAttr, textAttr);
    }

    var oX = 0;
    var oY = 0;
    switch (tSide){
      case 'top' : 
        oY += tH;
        break;
      case 'left' :
        oX += tH;
    }

    var path = [];
    path.push('M' + oX + ' ' + (oY + r));
    path.push(this.getCurve(r, oX, oY + r, oX + r, oY, 'tl'));
    if(tSide === 'top'){
      path.push('H' + (oX + (w - tW) / 2));
      path.push('L' + (oX + (w / 2)) + ' 0');
      path.push('L' + (oX + (w + tW) / 2) + ' ' + oY);
      path.push('H' + (oX + w - r));
    }
    path.push('H' + (oX + w - r));
    path.push(this.getCurve(r, (oX + w -r), oY, (oX + w), (oY + r), 'tr'));
    if(tSide === 'right'){
      path.push('V' + (oY + (h - tW) / 2));
      path.push('L' + (oX + w + tH) + ' ' + (oY + h / 2));
      path.push('L' + (oX + w) + ' ' + (oY + (h + tW) / 2));
    }
    path.push('V' + (oY + h - r));
    path.push(this.getCurve(r, oX + w, oY + h - r, oX + w -r, oY + h, 'br'));
    if(tSide === 'bottom'){
      path.push('H' + (oX + (w + tW) / 2));
      path.push('L' + (oX + (w) / 2) + ' ' + (oY + h + tH));
      path.push('L' + (oX + (w - tW) / 2) + ' ' + (oY + h));
    }
    path.push('H' + (oX + r));
    path.push(this.getCurve(r, oX + r, oY + h , oX, oY + h - r, 'bl'));
    if(tSide === 'left'){
      path.push('V' + (oY + (h + tW) / 2));
      path.push('L' + 0 + ' ' + (oY + h / 2));
      path.push('L' + oX + ' ' + (oY + (h - tW) / 2));
    }
    path.push('V' + (oY + r) + 'Z');

    tip.push(rph.path(path).attr(defaultTipAttr));//.transform('t' + x + ', ' + y));
    var text = rph.text(oX + w / 2, oY + h / 2, str).attr(defaultTextAttr);//.transform('t' + x + ', ' + y);
    tip.push(text);
    tip.transform('t' + x + ',' + y);

    return tip;
  },
  updateTip : function(tip, str, x, y){
    var trans = tip[0].transform();
    var originX = trans[0][1];
    var originY = trans[0][2];
    if(str){
      tip[1].attr({'text' : str});
    }
    if(typeof x !== 'undefined' || typeof y !== 'undefined'){
      var tArg = 't' + (typeof x !== 'undefined' ? x : originX) + ', ' + (typeof y !== 'undefined' ? y : originY);
      tip.transform(tArg);
    }
  },
  getCurve : function(r, startX, startY, endX, endY, side){
    var oX = Math.min(startX, endX);
    var oY = Math.min(startY, endY);
    var dotArr = [];

    var len1 = r / 2;
    var len2 = Math.pow((r * r * 3 / 4), 0.5);

    switch (side){
      case 'tl' : 
        dotArr.push((oX + r - len2) + ' ' + (oY + r - len1));
        dotArr.push((oX + len1) + ' ' + (oY + r - len2));
        break;
      case 'tr' : 
        dotArr.push((oX + len1) + ' ' + (oY + r - len2));
        dotArr.push((oX + len2) + ' ' + (oY + r - len1));
        break;
      case 'bl' : 
        dotArr.push((oX + r - len1) + ' ' + (oY + len2));
        dotArr.push((oX + r - len2) + ' ' + (oY + len1));
        break;
      case 'br' : 
        dotArr.push((oX + len2) + ' ' + (oY + len1));
        dotArr.push((oX + len1) + ' ' + (oY + len2));
        break;
      default : 
    }
    dotArr.push(endX, endY);
    return 'C' + dotArr.join(' ');
  }
};