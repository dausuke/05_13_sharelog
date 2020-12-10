$(function () {
    // map表示用に使用する変数
    let map;

    // 現在地を取得するときのオプション
    const option = {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: 100000000
    };

    //ピンの生成
    // function pushPin (lat, lng, map){
    //   const location = new Microsoft.Maps.Location(lat, lng);
    //   const pin = new Microsoft.Maps.Pushpin(location,{
    //     color:'navy',
    //     visible:'ture',
    //   });
    //   map.entities.push(pin);
    // }
    const latlng = []
      // 現在地の取得に成功したときの関数
      function mapsInit(position) {
        // console.log(position)
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        
        // map = new Microsoft.Maps.Map('#map',{
        //   center: {
        //     latitude: lat, longitude: lng
        //   },
        //   zoom: 15,
        // });
        // pushPin(lat, lng, map);
      };

      // 現在位置の取得に失敗したの実行する関数
      function showError(error) {
        let e = "";
        if (error.code == 1) {
          e = "位置情報が許可されてません";
        }
        if (error.code == 2) {
          e = "現在位置を特定できません";
        }
        if (error.code == 3) {
          e = "位置情報を取得する前にタイムアウトになりました";
        }
        alert("error：" + e);
      }

      // 位置情報を取りにいく処理
      function getPosition () {
        navigator.geolocation
          .getCurrentPosition(mapsInit, showError, option);
      };

    // $('#save').on('click', function () {
    //     getPosition();
    //     console.log(lat, lng);
    // });
 });