$(function () {
    //firestore
    const db = firebase.firestore().collection('kadai05');
    const dataArray = [];   //データ取得用
    //緯度経度取得用の配列
    const latArray = [];
    const lngArray = [];
    db.orderBy('getday', 'desc').onSnapshot(function (querySnapshot) {
        querySnapshot.docs.forEach(function (doc) {
            const data = {
                id: doc.id,
                data: doc.data()
            };
            dataArray.push(data);
        });
        //dataArray内の緯度経度を配列posiArrayに格納
        dataArray.forEach(function (value) {
            const lattag = value.data.lat;
            const lngtag = value.data.lng;
            latArray.push(lattag);
            lngArray.push(lngtag);
        });
    });
    console.log(latArray)
    console.log(lngArray)

    //map処理
    //map表示用に使用する変数
    let map;

    // 現在地を取得するときのオプション
    const option = {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: 100000000
    };

    //ピンの生成
    // function pushPin (lat, lng,map){
    //     const location = new Microsoft.Maps.Location(lat, lng);
    //     const pin = new Microsoft.Maps.Pushpin(location,{
    //         color:'red',
    //         visible:'ture',
    //     });
    //     map.entities.push(pin);
    // }
    // ピン配置の緯度経度取得
    function mapsInit() {
        map = new Microsoft.Maps.Map('#map',{
              zoom: 15,
        });
        for (let i; i < latArray.length; i++){
            lat = latArray[i];
            lng = lngArray[i];
            const location = new Microsoft.Maps.Location(lat, lng);
            const pin = new Microsoft.Maps.Pushpin(location,{
                color:'red',
                visible:'ture',
            });
            map.entities.push(pin);
        };
        
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

    window.onload = function(){
        getPosition();
    }

 });