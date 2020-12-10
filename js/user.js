$(function () {
    //画面の切り替え
    $('.tab a').on('click', function () {
        $(this).parent().addClass('active').siblings('.active').removeClass('active');
        const content = $(this).attr('href');
        $(content).addClass('active').siblings('.active').removeClass('active');
        return false;
    });

    //api
    //緯度経度取得用の配列
    const latArray = [];
    const lngArray = [];

    // 現在地を取得するときのオプション
    const option = {
      enableHighAccuracy: true,
      maximumAge: 20000,
      timeout: 100000000
    };

    // 現在地の取得に成功したときの関数
    function mapsInit(position) {
        // console.log(position)
        latArray.push(position.coords.latitude);
        lngArray.push(position.coords.longitude);
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
    };

    // 位置情報を取りにいく処理
    function getPosition () {
        navigator.geolocation
          .getCurrentPosition(mapsInit, showError, option);
    };

    //位置情報取得処理実行
    window.onload = function(){
        getPosition();
    }

    //firestore
    const db = firebase.firestore().collection('kadai05');
    //ログインしているユーザーid取得
    const uid = [];
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            uid.push(user.uid)
        }
    });

    //保存するボタンクリックイベント
    $('#save').on('click', function () {
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

    //データリアルタイム取得
    const dataArray = [];
    db.orderBy('getday', 'desc').onSnapshot(function (querySnapshot) {
        querySnapshot.docs.forEach(function (doc) {
            const data = {
                id: doc.id,
                data: doc.data()
            };
            dataArray.push(data);
        });

        //ユーザーマイページ：自分の保存したデータ表示
        for (let i = 0; i < dataArray.length; i++) {      //保存しているすべてのデータ表示
            const memoTag = `
            <article class = "timelineitem" id = "mypagetimelineitem">
                <header>
                    pp
                    <span class="clear" id="dataclear">delete</span >
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
    });
    //消去ボタンクリック時の処理
    $(document).on('click', '#dataclear', function () {
        //クリックされた.clearの兄弟要素から.liatknameのvalue値取得し、変数cnameに格納
        const cname = $(this).parents('header').siblings('div').find('#logdata').find('li').eq(0).text();
        console.log(cname);
        $(this).parents('#mypagetimelineitem').append('<div class= modal ></div >')
        $(this).parents('#mypagetimelineitem').find('.modal').append('<div class = modal-content></div>')
        $(this).parents('#mypagetimelineitem').find('.modal-content').append('<p>消去</p>');
        $('.modal p').addClass("modal-close")
        $('modal').fadeIn();
        // モーダルウィンドウ表示・非表示(消去の確認画面)
        $('.modal-close').text(cname + 'を消去しますか？')
        return false;
    });
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

    
});