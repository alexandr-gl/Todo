$(function () {
    let id, tittle, state;
    let idx = 0;
    let _id;
    let idxx = 0;
    let taskArray = [];
    let taskArrayActive = [];
    let taskArrayCompl = [];
    let numPages;
    let numTasksOnPage = 5;
    let pageIndex = 0;
    let page, pageIndexTemp;
    let buttonid;
    let buttonclass;
    let sizeOutput;
    let buttonIDtemp = 'alltasks';
    let pageIndexAllCheck = 0;
    let data;
    let task;
    let stateBD;

    class Todo {
        constructor(id, text, state) {
            this.id = id;
            this.text = text;
            this.state = state;
        }
    }
    get('load', 0);
    function addTasks() {
        data = $("#input").val();
        data = data.replace(/</g, "&lt;");
        data = data.replace(/>/g, "&lt;");
        if ((/\S/.test(data) && data.length != 0)) {
            if(idx < 4) {
                task = new Todo(idx, data, false);
                taskArray.push(task);
                idx = _.size(taskArray) - 1;
                add(task);
                get('enter', idx);
                $('.adding-task-li').remove();
                $("#input").val("");
                if (idx % 5 == 0) {
                    pagination2('alltasks');
                }
                $('#test').prop('checked', false);
            }
            else {
                task = new Todo(idx, data, false);
                taskArray.push(task);
                idx = _.size(taskArray) - 1;
                idxx = Math.trunc(idx/5);
                $("#input").val("");
                if (idx % 5 == 0) {
                    pagination2('alltasks');
                    $('.adding-task-li').remove();
                }
                $('#test').prop('checked', false);
                add(task);
                get('enter', idx);
                $('.adding-task-li').remove();
            }
            counter();

        }
        else {alert("field is empty");}
    }

    function get(add, idx){
        $.ajax({
            type: 'GET',
            url: '/tasks',
            success: function(result){
                if(result.error){
                    alert(result.error);
                }
                else {
                    taskArray = result;
                    for(let i = 0; i<_.size(taskArray); i++)
                    {
                        delete taskArray[i].__v;
                        taskArray[i].id = taskArray[i]._id;
                    }
                    allOutput(idxx);
                    counter();
                    // else if(add == 'enter')
                    // {
                    //     //$('#task-list').append(`<li class="adding-task-li" id="${taskArray[idx].id}"><input class="input-click" type="checkbox" id="test${taskArray[idx].id}"><label for="test${taskArray[idx].id}"></label><span id="span${taskArray[idx].id}">${taskArray[idx].text}</span><button class="btn del">Del</button></li>`);
                    // }
                }
            },
            error: function (error) {
                console.log('Error', error)
            }
        });
    }

    function add(newItem) {
        $.ajax({
            type: 'POST',
            data: newItem,
            url: '/tasks',
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                console.log('Error', error)
            }
        });
    }
    function changeState(state1, updState) {
        $.ajax({
            type: 'PUT',
            data: {state: state1},
            url: '/tasks/' + updState,
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                console.log(result);
            },
            error: function (error) {
                console.log('Error', error);
            }
        });
    }
    function changeStateAll(stateAll) {
        $.ajax({
            type: 'PUT',
            data: {state: stateAll},
            url: '/tasks',
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                console.log(result);
            },
            error: function (error) {
                console.log('Error', error);
            }
        });
    }
    function delCheckedDB ()
    {
        $.ajax({
            type: 'DELETE',
            url: '/tasks/checked/',
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                console.log('Error', error);
            }
        });
    }
    function editText (updText, data){
        $.ajax({
            type: 'PUT',
            data: {text: data},
            url: '/tasks/edit/' + updText,
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                console.log('Error', error);
            }
        });
    }
    function reloadTList() {
        if(buttonIDtemp == 'alltasks')
        {
            allOutput(idxx);
            pagination2('alltasks');
        }
        else if(buttonIDtemp == 'compltask')
        {
            complOutput(idxx);
            pagination2('compltask');
        }
        else if (buttonIDtemp == 'acttasks')
        {
            activeOutput(idxx);
            pagination2('acttasks');
        }
    }
    //добавление таска по кнопке
    $('#add').on('click', function () {
        addTasks();
    });
    //добавление таска по enter
    $('#input').keydown(function (eventObject) {
        if (eventObject.which == 13) {
            addTasks();
        }
    });

    // удаление одного таска
    $('.task-list__tasks').on('click', '.btn', function () {
        _id = $(this).parent().attr('id');
        taskArray = _.reject(taskArray, function (i) {
            return i.id == _id
        });
        $(`[id = ${_id}]`).detach();
        $('.adding-task-li').remove();
        del(_id);
        if(_.size(taskArray)%5 == 0 && idxx != 0)
        {
            allOutput(idxx - 1);
        }
        counter();
        reloadTList();
    });
    function del(delItem) {
        $.ajax({
            type: 'DELETE',
            //data: delItem,
            url: '/tasks/delOne/' + delItem,
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                console.log('Error', error)
            }
        });
    }
    $('.task-list__tasks').on('click', '.input-click', function () {
        let th = $(this).parent().attr('id');
        doneUndone(th);
        changeState(stateBD, th);
    });

    $('#test').on('click', function () {
        if ($('#test').attr('class') == 'unchecked') {
            $("input").prop("checked", true);
            $('#test').addClass("checked");
            $('#test').removeClass("unchecked");
            for (const i of taskArray) {
                i.state = true;
            }
            changeStateAll(true);
            counter();
        }
        else if ($('#test').attr('class') == 'checked') {
            $("input").prop("checked", false);
            $('#test').addClass("unchecked");
            $('#test').removeClass("checked");
            for (const i of taskArray) {
                i.state = false;
            }
            changeStateAll(false);
            counter();
        }
    });
    function counter() {
        let length_checked = _.size(_.filter(taskArray, function (i) { return i.state == true }));
        let length_unchecked = _.size(taskArray) - _.size(_.filter(taskArray, function (i) { return i.state == true }));
        $('.done').replaceWith(`<span class="done">${length_checked}</span>`);
        $('.undone').replaceWith(`<span class="undone">${length_unchecked}</span>`);
    }
    function doneUndone(_id) {
        for (const i of taskArray) {
            if (i.id == _id) {
                i.state = $(`[id = test${_id}]`).prop("checked");
                stateBD = i.state;
            }
                let s = 0;
                for ( const i of taskArray) {
                   if (i.state == false) {
                       s++;
                   }
                }
                if (s > 0) {
                    $('#test').prop('checked', false);
                }
                else
                {
                    $('#test').prop('checked', true);
                }
            }
        counter();
    }

    // удаление отмеченных галочкой тасков
    $('#delete').on('click', function () {
        $('.adding-task-li').remove();
        taskArray = _.filter(taskArray, function (i) {
            return i.state == false
        });
        $("#test").prop("checked", false);
        delCheckedDB();
        if(_.size(taskArray)%5 == 0 && idxx != 0)
        {
            allOutput(idxx - 1);
        }
        if(_.size(taskArray)%5 != 0) {
            reloadTList();
        }
        pagination2();
        doneUndone();
        counter();
    });
    // редактирование таска
    $('.task-list__tasks').on('dblclick', '.adding-task-li', function () {
        $('#edit').remove();
        $('#edit').focus();
        _id = $(this).attr('id');
        $(`[id = span${_id}]`).append(`<textarea  class="edit" type="text" id="edit" />`);
        for (const i of taskArray)
        {
            if(i.id==_id)
            {
                $('#edit').val(i.text);
                $('#edit').on('focusout', function () {
                    $('#edit').remove();
                });
                $('#edit').keydown(function (eventObject) {
                    if (eventObject.which == 13) {
                        data = $("#edit").val();
                        data = data.replace(/</g, "&lt;");
                        data = data.replace(/>/g, "&lt;");
                        if ((/\S/.test(data) && data.length !== 0)) {
                            let edit = data;
                            $(`[id = span${_id}]`).replaceWith(`<span id="span${_id}">${data}</span>`);
                            i.text = data;
                            editText(_id, data);
                            $('#edit').remove();
                        }
                        else {alert("Field is empty");}
                    }
                });
            }
        }
    });


    // пагинация
    function pagination() {
        $('#pagingControls').append(`<ul class="pagingControlsList" id="pagingControlsList"></ul>`);
        pageIndex++;

    }
    pagination();
    //вывод всех тасков функция
    function allOutput(pageIndexClick) {
        $('#test').prop('checked', false);
        let s = 0;
        for ( const i of taskArray) {
            if (i.state == false) {
                s++;
            }
        }
        if (s > 0) {
            $('#test').prop('checked', false);
        }
        else if(s==0 && _.size(taskArray) != 0)
        {
            $('#test').prop('checked', true);
        }
        if(pageIndexClick == undefined) {
            pageIndex = 0;
        }
        else if (pageIndexClick != undefined)
        {
            pageIndex = pageIndexClick;
        }
        let x = _.size(taskArray)/5;
        x = Math.trunc(x);
        if (pageIndexClick == undefined || pageIndexClick == x)
        {
            sizeOutput = _.size(taskArray) % 5;
        }
        else
        {
            sizeOutput = 5;
        }
        for (let j = pageIndex * 5; j < pageIndex * 5 + sizeOutput; j++) {
            $('#task-list').append(`<li class="adding-task-li" id="${taskArray[j].id}">
                                        <input class="input-click" type="checkbox" id="test${taskArray[j].id}">
                                        <label for="test${taskArray[j].id}">
                                        </label>
                                        <span id="span${taskArray[j].id}">${taskArray[j].text}</span>
                                        <button class="btn del">Del</button></li>`);
            if (taskArray[j].state == true) {
                $(`[id = test${taskArray[j].id}]`).prop('checked', true);
            }
        }
        pagination2(buttonIDtemp);
    }

    function complOutput(pageIndexClick) {
        $('#test').addClass("checked");
        $('#test').removeClass("unchecked");
        taskArrayCompl = _.reject(taskArray, function (i) {
            return i.state == false
        });
        if(pageIndexClick == undefined) {
            pageIndex = 0;
        }
        else if (pageIndexClick != undefined)
        {
            pageIndex = pageIndexClick;
        }
        let x = _.size(taskArrayCompl)/5;
        x = Math.trunc(x);
        if (pageIndexClick == undefined || pageIndexClick == x)
        {
            sizeOutput = _.size(taskArrayCompl) % 5;
        }
        else
        {
            sizeOutput = 5;
        }
        for (let j = pageIndex * 5; j < pageIndex * 5 + sizeOutput; j++) {
            $('#task-list').append(`<li class="adding-task-li" id="${taskArrayCompl[j].id}">
                                        <input class="input-click" type="checkbox" id="test${taskArrayCompl[j].id}">
                                        <label for="test${taskArrayCompl[j].id}">                                        
                                        </label>
                                        <span id="span${taskArrayCompl[j].id}">${taskArrayCompl[j].text}</span>
                                        <button class="btn del">Del</button></li>`);
            if (taskArrayCompl[j].state == true) {
                $(`[id = test${taskArrayCompl[j].id}]`).prop('checked', true);
            }
        }
        $('#test').prop('checked', true);
    }

    function activeOutput(pageIndexClick) {
        $('#test').addClass("unchecked");
        $('#test').removeClass("checked");
        taskArrayActive = _.filter(taskArray, function (i) {
            return i.state == false
        });
        if(pageIndexClick == undefined) {
            pageIndex = 0;
        }
        else if (pageIndexClick != undefined)
        {
            pageIndex = pageIndexClick;
        }
        let x = _.size(taskArrayActive)/5;
        x = Math.trunc(x);
        if (pageIndexClick == undefined || pageIndexClick == x)
        {
            sizeOutput = _.size(taskArrayActive) % 5;
        }
        else
        {
            sizeOutput = 5;
        }
        for (let j = pageIndex * 5; j < pageIndex * 5 + sizeOutput; j++) {
            $('#task-list').append(`<li class="adding-task-li" id="${taskArrayActive[j].id}">
                                        <input class="input-click" type="checkbox" id="test${taskArrayActive[j].id}">
                                        <label for="test${taskArrayActive[j].id}">
                                        </label>
                                        <span id="span${taskArrayActive[j].id}">${taskArrayActive[j].text}</span>
                                        <button class="btn del">Del</button></li>`);
            if (taskArrayActive[j].state == true) {
                $(`[id = test${taskArrayActive[j].id}]`).prop('checked', true);
            }
        }
        $('#test').prop('checked', false);
    }

    // вывод всех тасков
    $('#all').on('click', function () {
        $('.adding-task-li').remove();
        buttonIDtemp = 'alltasks';
        allOutput(0);
        pagination2(buttonIDtemp);
    });
    // вывод завершенных тасков
    $('#completed').on('click', function () {
        $('.adding-task-li').remove();
        complOutput(0);
        buttonIDtemp = 'compltasks';
        pagination2(buttonIDtemp);
    });

    // вывод активных тасков
    $('#active').on('click', function () {
        $('.adding-task-li').remove();
        activeOutput(0);
        buttonIDtemp = 'acttasks';
        pagination2(buttonIDtemp);
    });

    //пагинация для отображения тасков отдельно
    function pagination2(buttonid){
        pageIndex = 0;
        $('.pageIndex').remove();
        if (buttonid == 'alltasks') {
            for (let j = 0; j<_.size(taskArray)/5; j++) {
                $('#pagingControlsList').append(`<li class="pageIndex" id="pageIndex${pageIndex}"><button class="btnpage alltasks btn">${pageIndex + 1}</button></li>`);
                pageIndex++;
            }
        }
        else if (buttonid == 'compltasks') {
            for (let j = 0; j<_.size(taskArrayCompl)/5; j++) {
                $('#pagingControlsList').append(`<li class="pageIndex" id="pageIndex${pageIndex}"><button class="btnpage compltasks btn">${pageIndex + 1}</button></li>`);
                pageIndex++;
            }
        }
        else if (buttonid == 'acttasks') {
            for (let j = 0; j<_.size(taskArrayActive)/5; j++) {
                $('#pagingControlsList').append(`<li class="pageIndex" id="pageIndex${pageIndex}"><button class="btnpage acttasks btn">${pageIndex + 1}</button></li>`);
                pageIndex++;
            }
        }
    }
    
    $('#pagingControls').on('click', '.alltasks', function () {
        idxx = $(this).parent().attr('id');
        idxx = idxx.replace(/pageIndex/g, "");
        pageIndexAllCheck = idxx;
        $('.adding-task-li').remove();
        allOutput(idxx);
    });

    $('#pagingControls').on('click', '.compltasks', function () {
        idxx = $(this).parent().attr('id');
        idxx = idxx.replace(/pageIndex/g, "");
        pageIndexAllCheck = idxx;
        $('.adding-task-li').remove();
        complOutput(idxx);
    });

    $('#pagingControls').on('click', '.acttasks', function () {
        idxx = $(this).parent().attr('id');
        idxx = idxx.replace(/pageIndex/g, "");
        pageIndexAllCheck = idxx;
        $('.adding-task-li').remove();
        activeOutput(idxx);
    });

});