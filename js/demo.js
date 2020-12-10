$(function () {
    const db = firebase.firestore().collection('kadai05');
    const uid = [];
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
        console.log(dataArray);

        //ホーム画面：uidを判別し、自分の保存したデータとフレンドの保存したデータ表示
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
            if (uid == dataArray[i].data.id) {
                $('#timeline').html(memoTag);
                $('#listkname' + i).text(dataArray[i].data.name);
                $('#listgetday' + i).text(dataArray[i].data.getday);
                $('#listkarea' + i).text(dataArray[i].data.area);
                $('#listcategory' + i).text(dataArray[i].data.category);
                $('#listpnumber' + i).text(dataArray[i].data.pnumber);
                $('#listevaluation' + i).text(dataArray[i].data.evaluation);
                $('#listfreetext' + i).text(dataArray[i].data.freetext);
            };
        };
    });

    //検索画面：検索時保存データ取得表示
    $('#searchbutton').on('click', function () {
        const search = $('#search').val();
        const searchId =$.grep(dataArray,
            function(obj, idx){
            return (obj.data.name == search);  //data.nameがsearchと一致するオブジェクト抽出
            }
        );
        // const jsonData = localStorage.getItem(search);
        // const data = JSON.parse(jsonData);
        $('#kname').val(searchId[0].data.name);
        $('#karea').val(searchId[0].data.area);
        $('#kcategory').val(searchId[0].data.category);
        $('#kpnumber').val(searchId[0].data.pnumber);
        $('#getday').val(searchId[0].data.getday);
        $('.listjump').attr("href", '#' + searchId[0].data.name);
    });
    // 「リストへ」ボタンクリック時の処理
    $('span a').on('click', function () {
        $(this).parent().addClass('active').siblings('.active').removeClass('active');
        const content = $(this).attr('href');
        $(content).parent().addClass('active').siblings('.active').removeClass('active');
        const href = $('.listjump').attr("href");
        location.href = href;
        return false;
    });


});

