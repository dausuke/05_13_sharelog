$(function () {
    const db = firebase.firestore().collection('kadai05');
    const uid = [];
    const dataArray = [];   //データ取得用
    //緯度経度取得用の配列
    const latArray = [];
    const lngArray = [];
    //緯度経度をfirestoreから取得するための配列
    const latArrayfirestoe = [];
    const lngArrayfirestoe = [];
    const pushpinsinfo = [];    //ピンの情報用の配列
    const pushpins = [];

    //ログインしているユーザーid取得
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            uid.push(user.uid)
        }
    });
    console.log(uid)
    //画面の切り替え
    $('.tab a').on('click', function () {
        $(this).parent().addClass('active').siblings('.active').removeClass('active');
        const content = $(this).attr('href');
        $(content).addClass('active').siblings('.active').removeClass('active');
        return false;
    });

    //firestore
    db.orderBy('getday', 'desc').get().then(function (querySnapshot) {
        querySnapshot.docs.forEach(function (doc) {
            const data = {
                id: doc.id,
                data: doc.data()
            };
            dataArray.push(data);
        });
        //ホーム画面：保存されているデータ表示
        for (let i = 0; i < dataArray.length; i++) {      //保存しているすべてのデータ表示
            const memoTag = `
            <article class = "timelineitem" id = "timelineitem">
                <header>
                    pp
                </header>
                <div class = "timelinecontent">
                    <p class = "getday" id= "listgetday${i}"></p>
                    <ul>
                        <li>店　　　名：</li>
                        <li>エ　リ　ア：</li>
                        <li>連　絡　先：</li>
                        <li>カテゴリー：</li>
                        <li>評　　　価：</li>
                    </ul>
                    <ul>
                        <li id="listkname${i}"></li>
                        <li id="listkarea${i}"></li>
                        <li id="listpnumber${i}"></li>
                        <li id="listcategory${i}"></li>
                        <li id="listevaluation${i}"></li>
                    </ul>
                    <ul>
                        <li>メモ</li>
                        <li><div id="listfreetext${i}" ></div ></li>
                    </ul>
                </div>
            </article>
                `;
            //#listに.lsititemを追加
            //firebaseに保存したデータを表示
            $('#timeline').append(memoTag);
            $('#listkname' + i).text(dataArray[i].data.name);
            $('#listgetday' + i).text(dataArray[i].data.getday);
            $('#listkarea' + i).text(dataArray[i].data.area);
            $('#listcategory' + i).text(dataArray[i].data.category);
            $('#listpnumber' + i).text(dataArray[i].data.pnumber);
            $('#listevaluation' + i).text(dataArray[i].data.evaluation);
            $('#listfreetext' + i).text(dataArray[i].data.freetext);
        };

        //マイページのタイムライン
        for (let i = 0; i < dataArray.length; i++) {      //保存しているすべてのデータ表示
            const memoTag = `
            <article class = "timelineitem" id = "mypagetimelineitem">
                <header>
                    pp
                </header>
                <div class = "timelinecontent">
                    <p class = "getday" id= "mypagelistgetday${i}"></p>
                    <ul>
                        <li>店　　　名：</li>
                        <li>エ　リ　ア：</li>
                        <li>連　絡　先：</li>
                        <li>カテゴリー：</li>
                        <li>評　　　価：</li>
                    </ul>
                    <ul id = "logdata">
                        <li id="mypagelistkname${i}"></li>
                        <li id="mypagelistkarea${i}"></li>
                        <li id="mypagelistpnumber${i}"></li>
                        <li id="mypagelistcategory${i}"></li>
                        <li id="mypagelistevaluation${i}"></li>
                    </ul>
                    <ul>
                        <li>メモ</li>
                        <li><div id="mypagelistfreetext${i}" ></div ></li>
                    </ul>
                    
                </div>
            </article>
                `;
            //#listに.lsititemを追加
            //firebaseに保存したデータを表示
            if (uid == dataArray[i].data.id) {
                $('#mypagetimeline').html(memoTag);
                $('#mypagelistkname' + i).text(dataArray[i].data.name);
                $('#mypagelistgetday' + i).text(dataArray[i].data.getday);
                $('#mypagelistkarea' + i).text(dataArray[i].data.area);
                $('#mypagelistcategory' + i).text(dataArray[i].data.category);
                $('#mypagelistpnumber' + i).text(dataArray[i].data.pnumber);
                $('#mypagelistevaluation' + i).text(dataArray[i].data.evaluation);
                $('#mypagelistfreetext' + i).text(dataArray[i].data.freetext);
            };
        };

        //dataArray内の緯度経度を配列posiArrayに格納
        dataArray.forEach(function (value) {
            const lattag = value.data.lat;
            const lngtag = value.data.lng;
            latArrayfirestoe.push(lattag);
            lngArrayfirestoe.push(lngtag);
        });
        //保存されている位置情報のマップピン表示用
        dataArray.forEach(function (value,index) {
            const infotag = {
                id:value.data.id,
                latitude: latArrayfirestoe[index],
                longitude: lngArrayfirestoe[index],
                title: value.data.name,
                description:value.data.freetext
            };
            pushpinsinfo.push(infotag);
        });
    });

    //検索画面：検索時保存データ取得表示
    $('#searchbutton').on('click', function () {
        const search = $('#search').val();
        const searchId =$.grep(dataArray,
            function(obj, idx){
            return (obj.data.name == search);  //data.nameがsearchと一致するオブジェクト抽出
            }
        );
        $('#kname').val(searchId[0].data.name);
        $('#karea').val(searchId[0].data.area);
        $('#kcategory').val(searchId[0].data.category);
        $('#kpnumber').val(searchId[0].data.pnumber);
        $('#getday').val(searchId[0].data.getday);
    });

    //保存画面表示
    $('#savelog').on('click', function () {
        $('#savearea').append(`
        <div class="name">
            <p>店名</p>
            <input type="text" id="name">
        </div>
        <div class="area">
            <p>エリア</p>
            <input type="text" id="area">
        </div>
        <div class="pnumber">
            <p>電話番号</p>
            <input type="text" id="pnumber">
        </div>
        <div class="evaluation">
            <p>評価</p>
            <select type="text" id="evaluation">
                <option value="">選択</option>
                <option value="★★★★★">★★★★★</option>
                <option value="★★★★">★★★★</option>
                <option value="★★★">★★★</option>
                <option value="★★">★★</option>
                <option value="★">★</option>
            </select>
        </div>
        <div class="category">
            <p>カテゴリー</p>
            <select type="text" id="category">
                <option value="">選択</option>
                <option value="ファッション">ファッション</option>
                <option value="ランチ">ランチ</option>
                <option value="ディナー">ディナー</option>
                <option value="コーヒー">コーヒー</option>
                <option value="スポット">スポット</option>
            </select>
        </div>
        <div class="freetext">
            <p>メモ</p>
            <textarea id="freetext" maxlength="150" placeholder="150文字以内"></textarea>
        </div>
        <div class="save">
            <button id="save">保存する</button>
        </div>
        `);
     });

    //保存するボタンクリックイベント
    $(document).on('click', '#save', function () {
        const data = {
            id: uid[0],
            name: $('#name').val(),
            area: $('#area').val(),
            pnumber: $('#pnumber').val(),
            evaluation: $('#evaluation').val(),
            category: $('#category').val(),
            freetext: $('#freetext').val(),
            lat: latArray,
            lng: lngArray,
            getday: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
        };
        db.add(data);
        //送信後、各エリアの表示を削除
        $('#name').val('');
        $('#area').val('');
        $('#pnumber').val('');
        $('#evaluation').val('');
        $('#category').val('');
        $('#freetext').val('');
    });
    //サインアウト
    $('#signout').on('click', function () {
       if (confirm('サインアウトしますか？')) {
            window.location.href = 'index.html';
        } 
    });

    // //消去ボタンクリック時の処理
    // $(document).on('click', '#dataclear', function () {
    //     //クリックされた.clearの兄弟要素から.liatknameのvalue値取得し、変数cnameに格納
    //     const cname = $(this).parents('header').siblings('div').find('#logdata').find('li').eq(0).text();
    //     console.log(cname);
    //     $(this).parents('#mypagetimelineitem').append('<div class= modal ></div >')
    //     $(this).parents('#mypagetimelineitem').find('.modal').append('<div class = modal-content></div>')
    //     $(this).parents('#mypagetimelineitem').find('.modal-content').append('<p>消去</p>');
    //     $('.modal p').addClass("modal-close")
    //     $('modal').fadeIn();
    //     // モーダルウィンドウ表示・非表示(消去の確認画面)
    //     $('.modal-close').text(cname + 'を消去しますか？')
    //     return false;
    // });
    //.modal-closeクリック時、該当のfirebaseのデータを消去
    // $(document).on('click', '.modal-close', function () {
    //     //.modalの兄弟要素にあたる#mypagetimelineitemを取得し、その子要素.listknameを再取得して変数deletenameに格納
    //     const deletename = $(this).parents('#mypagetimelineitem').find('.listkname').val();
    //     console.log(deletename);
    //     const deleteId = $.grep(dataArray,
    //         function (obj, idx) {
    //             return (obj.data.name == deletename);  //data.nameがdeletenameと一致するオブジェクト抽出
    //         }
    //     );
    //     console.log(deleteId[0].id);
    //     db.doc(deleteId[0].id).delete().then(function () {
    //         console.log("Document successfully deleted!");
    //     })
    //     // localStorage.removeItem(removename);
    //     $(this).parents('.listitem').find('.listkname').val('');
    //     $(this).parents('.listitem').find('.listgetday').val('');
    //     $(this).parents('.listitem').find('.listkarea').val('');
    //     $(this).parents('.listitem').find('.listcategory').val('');
    //     $(this).parents('.listitem').find('.listpnumber').val('');
    //     $(this).parents('.listitem').find('.listevaluation').val('')
    //     $(this).parents('.listitem').find('.listfreetext').val('');
    //     $('.modal').fadeOut();
    //     return false;
    // });
    
    //map表示用に使用する変数
    let map;
    console.log(pushpinsinfo)
    function setinfopin() {
        
        //infoboxは一つ作成して再利用する
        var infobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false, autoAlignment: true });
        infobox.setMap(map);

        //pushpinの情報を作成
        pushpinsinfo.forEach(function (info) {
            if (uid == info.id) {
                var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(info.latitude, info.longitude),{
                color:'red',
                visible:'ture',
                });
            console.log(info)
                pushpin.metadata = info;
                Microsoft.Maps.Events.addHandler(pushpin, 'click', function (args) {
                    infobox.setOptions({
                        location: args.target.getLocation(),
                        title: args.target.metadata.title,
                        description: args.target.metadata.description,
                        visible: true
                    });
                });
                pushpins.push(pushpin);
            }
        });
    };
    // 現在地を取得するときのオプション
    const option = {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: 100000000
    };
    
    //ピンの生成(現在地)
    function pushPin (lat, lng, map){
        const location = new Microsoft.Maps.Location(lat, lng);
        const pin = new Microsoft.Maps.Pushpin(location,{
            color:'navy',
            visible:'ture',
      });
        map.entities.push(pin);
        map.entities.push(pushpins);
    };
    
    // 現在地の取得に成功したときの関数
    function mapsInit(position) {
        // console.log(position)
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map = new Microsoft.Maps.Map('#map',{
          center: {
            latitude: lat, longitude: lng
          },
          zoom: 15,
        });
        latArray.push(lat);
        lngArray.push(lng);
        setinfopin();
        pushPin(lat, lng, map);
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

