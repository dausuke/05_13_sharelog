$(function () {
    const db = firebase.firestore().collection('kadai04-2');
    console.log(db)
    //画面の切り替え
    $('.tab a').on('click', function () {
        $(this).parent().addClass('active').siblings('.active').removeClass('active');
        const content = $(this).attr('href');
        $(content).addClass('active').siblings('.active').removeClass('active');
        return false;
    });
    //保存画面：保存するボタンクリックイベント
    $('#save').on('click', function () {
        const data = {
            name: $('#name').val(),
            area: $('#area').val(),
            pnumber: $('#pnumber').val(),
            evaluation: $('#evaluation').val(),
            category: $('#category').val(),
            freetext: $('#freetext').val(),
            getday: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
        };
        console.log(data);
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
        console.log(dataArray);

        //表示画面：保存されたデータをすべて表示
        for (let i = 0; i < dataArray.length; i++) {      //保存しているすべてのデータ表示
            const memoTag = `
                <div class = "listitem" id = ${dataArray[i].data.name}>
                    <p>保存日</p>
                    <input type="text" class= "listgetday" >
                    <p>店名</P><input type="text" class="listkname">
                    <p >エリア</P> 
                    <input type="text" class="listkarea">
                    <p >連絡先</p >
                    <input type="tel" class="listpnumber">
                    <p >カテゴリー</P><input type = "text" class="listcategory" >
                    <p >評価</P> 
                    <input type="text" class="listevaluation" >
                    <p >メモ</P>
                    <textarea class="listfreetext" ></textarea >
                    <span class="clear" >消去</span >
                </div >
                `;
            //#listに.lsititemを追加
            //firebaseに保存したデータを表示
            $('#list').append(memoTag);
            $('.listkname').eq(i).val(dataArray[i].data.name);
            $('.listgetday').eq(i).val(dataArray[i].data.getday);
            $('.listkarea').eq(i).val(dataArray[i].data.area);
            $('.listcategory').eq(i).val(dataArray[i].data.category);
            $('.listpnumber').eq(i).val(dataArray[i].data.pnumber);
            $('.listevaluation').eq(i).val(dataArray[i].data.evaluation);
            $('.listfreetext').eq(i).val(dataArray[i].data.freetext);
        };
    });
    //消去ボタンクリック時の処理
    $(document).on('click', '.clear', function () {
        //クリックされた.clearの兄弟要素から.liatknameのvalue値取得し、変数clearnameに格納
        const clearname = $(this).siblings('.listkname').val();
        console.log(clearname);
        $(this).parents('.listitem').append('<div class= modal ></div >')
        $(this).parents('.listitem').find('.modal').append('<div class = modal-content></div>')
        $(this).parents('.listitem').find('.modal-content').append('<p>消去</p>');
        $('.modal p').addClass("modal-close")
        $('modal').fadeIn();
        // モーダルウィンドウ表示・非表示(消去の確認画面)
        $('.modal-close').text(clearname + 'を消去しますか？')
        return false;
    });
    //.modal-closeクリック時、該当のfirebaseのデータを消去
    $(document).on('click', '.modal-close', function () {
        //.modalの兄弟要素にあたる.listitemを取得し、その子要素.listknameを再取得して変数deletenameに格納
        const deletename = $(this).parents('.listitem').find('.listkname').val();
        console.log(deletename);
        const deleteId =$.grep(dataArray,
            function(obj, idx){
            return (obj.data.name == deletename);  //data.nameがdeletenameと一致するオブジェクト抽出
            }
        );
        console.log(deleteId[0].id);
        db.doc(deleteId[0].id).delete().then(function() {
    console.log("Document successfully deleted!");
})
        // localStorage.removeItem(removename);
        $(this).parents('.listitem').find('.listkname').val('');
        $(this).parents('.listitem').find('.listgetday').val('');
        $(this).parents('.listitem').find('.listkarea').val('');
        $(this).parents('.listitem').find('.listcategory').val('');
        $(this).parents('.listitem').find('.listpnumber').val('');
        $(this).parents('.listitem').find('.listevaluation').val('')
        $(this).parents('.listitem').find('.listfreetext').val('');
        $('.modal').fadeOut();
        return false;
    });
    //ページトップボタン
    // const pagetop = $('.scroll');
    $('#scroll').hide();      //ボタン非表示
    //300pxスクロールしたらボタン表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#scroll').fadeIn();
        } else {
            $('#scroll').fadeOut();
        }
    });
    $('#scroll').on('click',function () {
     $('body, html').animate({ scrollTop: 0 }, 500);
     return false;
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

