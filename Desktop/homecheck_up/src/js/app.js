var UI = require('ui');
var temp1 = 0,temp2=0;
var light1 = "off",light2 = 'off';
var ajax = require('ajax');

var main = new UI.Card({
  //title: 'Pebble.js',
  body: '   Room1 '+'Room 2\n'+'Temp:     ' + temp1 + "°F      "+ temp2 + "°F" +
               "\nLights:     " + light1 + "     " + light2
});

main.on('click','select',function(e){
  ajax({url:'http://10.33.77.138:3000/db',type: 'json'},
  function(data){
    if (data.Room1.light.value === true)
      light1 = "on";
    else
      light1 = "off";
    temp1 = String(data.Room1.temperature.value);
    if(temp1.length>4)
        temp1 = temp1.substring(0,4);
    
    
    if (data.Room2.light.value === true)
      light2 = "on";
    else
      light2 = "off";
    temp2 = String(data.Room2.temperature.value);
    if(temp2.length>4)
        temp2 = temp2.substring(0,4);
    
    
    
    main.body('   Room1 '+'Room 2\n'+'Temp:' + temp1 + "°F "+ temp2 + "°F" +
               "\nLights:     " + light1 + "     " + light2+"  ");
  });
});

main.show();