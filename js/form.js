function FileInput (opts) {
    var $input = opts.$input || $(document.createElement('input'));
    var $preview = opts.$preview || $(new Image());
    var draggedClassName = opts.draggedClassName || 'is-dragged';
    
    var input = $input.get(0);


    // ===================================================================
    // 選択したファイルのプレビュー機能
    // ===================================================================

    // この機能は、FileReader(File API)が使えるブラウザでないと動作しないので
    // FileReaderにアクセス出来ない場合は、ここで処理を中止
    if (!FileReader) {
        console.error('このブラウザは、FileAPIに対応していないようです。');
        return;
    }

    // inputで指定されている画像を抜き出して、img要素で表示する
    function updatePreview () {
        // 選択されている画像がなければ中止
        if (!input.files.length) { 
            return;
        }

        // FileReaderの作成
        var reader = new FileReader();

        // このあとのreadAsDataURLが完了したタイミングで、
        // $previewに選択されている画像をセットする
        reader.onload = function (e) {
            $preview.attr('src', e.target.result);
        };

        // 画像ファイルをdataURLに変換
        reader.readAsDataURL(input.files[0]);
    }

    // inputの値が選択されるたびに、updatePreviewを呼ぶ
    $input.on('change', updatePreview);

    // ブラウザバック等でページに来た際は、最初からファイルが
    // 選択されていることもあるので、一度updatePreviewを実行しておく
    updatePreview();


    // ===================================================================
    // ドラッグ&ドロップでもファイルを指定できるようにする
    // ===================================================================

    $preview
        .on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $preview.addClass(draggedClassName);
        })
        .on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragleave', function () {
            $preview.removeClass(draggedClassName);
        })
        .on('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var dataTransfer = e.originalEvent.dataTransfer;
            if (!dataTransfer || !dataTransfer.files.length) {
                return;
            }

            input.files = dataTransfer.files;

            $preview.removeClass(draggedClassName);
        });
}



$(function () {
    // プレビュー付き・ドラッグ&ドロップ可能なアップロードフォーム
    new FileInput({
        $preview: $('#image-preview'),
        $input: $('#image-input')
    });
});
