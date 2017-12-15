$(function () {
    let idx = 0;
    let _id;
    let idxx = 0;
    let taskArray = [];
    let taskArrayActive = [];
    let taskArrayCompl = [];
    let pageIndex = 0;
    let sizeOutput;
    let buttonIDtemp = 'alltasks';
    let data;
    let task;
    let stateBD;
    let input = $('#input');
    let task_list = $('#task-list');
    // let taskInput = $('#taskInput');
    let taskInput = $('#test');
    let pagingControls = $('#pagingControls');
    let tasklist_task = $('.task-list__tasks');


    function get(){
        $.ajax({
            type: 'GET',
            url: '/tasks',
            success: function(result){
                if(result.error){
                    alert(result.error);
                }
                else {
                    taskArray = result;
                    pagination2('alltasks', taskArray);
                    allOutput(idxx);
                    counter();
                }
            },
            error: function (error) {
                alert(error);
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
                alert(error);
            }
        });
    }
    function changeState(state1, updState, text) {
        $.ajax({
            type: 'PUT',
            data: {state: state1, text: text},
            url: '/tasks/' + updState,
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                console.log(result);
            },
            error: function (error) {
                alert(error);
            }
        });
    }
    function changeStateAll(stateAll) {
        $.ajax({
            type: 'PUT',
            data: {state: stateAll},
            url: '/tasks/put',
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
                console.log(result);
            },
            error: function (error) {
                alert(error);
            }
        });
    }
    function delCheckedDB ()
    {
        $.ajax({
            type: 'DELETE',
            url: '/tasks',
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                alert(error);
            }
        });
    }

    function del(delItem) {
        $.ajax({
            type: 'DELETE',
            url: '/tasks/' + delItem,
            success: function(result){
                if (result.error) {
                    alert(result.error);
                }
            },
            error: function (error) {
                alert(error);
            }
        });
    }



    class Todo {
        constructor(id, text, state) {
            this.id = id;
            this.text = text;
            this.state = state;
        }
    }
    get();
    function addTasks() {
        data = input.val();
        data = data.replace(/</g, "&lt;");
        data = data.replace(/>/g, "&lt;");
        if (!(/\S/.test(data) && data.length !== 0)) {
            alert("field is empty");
        }
        else {
            input.val("");
            task = new Todo(idx, data, false);
            taskArray.push(task);
            idx = taskArray.length - 1;
            add(task);
            get();
            idxx = Math.trunc(idx / 5);
            let adding_task_lili = $('.adding-task-li');
            adding_task_lili.remove();
            reloadTList();
            taskInput.prop('checked', false);
            counter();
        }
    }

    function findChecked() {
        taskInput.prop('checked', false);
        let task = _.findWhere(taskArray, {state: false});
        let condition;
        condition = task === undefined;
        taskInput.prop('checked', condition);
    }
    function idRecount() {
        for(let i = 0; i<taskArray.length; i++)
        {
            taskArray[i].id = i;
        }
    }
    function reloadTList() {
        if(buttonIDtemp === 'alltasks')
        {
            allOutput(idxx);
            pagination2('alltasks', taskArray);
        }
        else if(buttonIDtemp === 'compltask')
        {
            complOutput(idxx);
            pagination2('compltask', taskArrayCompl);
        }
        else if (buttonIDtemp === 'acttasks')
        {
            activeOutput(idxx);
            pagination2('acttasks', taskArrayActive);
        }
    }
    //добавление таска по кнопке
    $('#add').on('click', function () {
        addTasks();
    });
    //добавление таска по enter
    input.keydown(function (eventObject) {
        if (eventObject.which === 13) {
            addTasks();
        }
    });

    // удаление одного таска
    tasklist_task.on('click', '.btn', function () {
        _id = $(this).parent().attr('id');
        taskArray = _.reject(taskArray, function (i) {
            return i.id === parseInt(_id);
        });
        $(`[id = ${_id}]`).detach();
        remAddingTaskLi();
        reloadTList();
    });

    tasklist_task.on('click', '.input-click', function () {
        let th = $(this).parent().attr('id');
        console.log('taskArray[th].id-- ', taskArray[th].id);
        doneUndone(th);
        console.log('>>>> CHANGE STATE <<<<', stateBD, taskArray[th]._id, taskArray[th].text)
        changeState(stateBD, taskArray[th]._id, taskArray[th].text);
    });

    //изменение состояния всех тасков
    taskInput.on('click', function () {
        const condition = taskInput.attr('class') === 'unchecked';
        $("input").prop("checked", condition);
        taskInput.toggleClass("checked unchecked");
        for (const i of taskArray) {
            i.state = condition;
        }
        console.log('>>>> CHANGE STATE ALL <<<<', condition);
        changeStateAll(condition);
        counter();
    });

    function counter() {
        const length_checked = _.filter(taskArray, function (i) { return i.state === true; }).length;
        const length_unchecked = taskArray.length - length_checked;
        $('.done').replaceWith(`<span class="done">${length_checked}</span>`);
        $('.undone').replaceWith(`<span class="undone">${length_unchecked}</span>`);
    }
    function doneUndone(th) {
        taskArray[th].state = $(`[id = taskInput${th}]`).prop("checked");
        stateBD = taskArray[th].state;
        findChecked();
        counter();
    }

    // удаление отмеченных галочкой тасков
    $('#delete').on('click', function () {
        remAddingTaskLi();
        taskArray = _.filter(taskArray, function (i) {
            return i.state === false;
        });
        $("#taskInput").prop("checked", false);
        delCheckedDB();
        reloadTList();
        counter();
        idRecount();
    });
    // редактирование таска
    tasklist_task.on('dblclick', '.adding-task-li', function () {
        $('.edit').detach();
        _id = $(this).attr('id');
        $(`[id = span${_id}]`).append(`<textarea  class="edit" type="text" id="edit" />`);
        let edit = $('#edit');
        edit.focus();
        let val = `${taskArray[_id].text}`;
        edit.val(val);
        edit.keydown(function (eventObject) {
            if (eventObject.which === 13) {
                data = edit.val();
                data = data.replace(/</g, "&lt;");
                data = data.replace(/>/g, "&lt;");
                if ((/\S/.test(data) && data.length !== 0)) {
                    $(`[id = span${_id}]`).replaceWith(`<span id="span${_id}">${data}</span>`);
                    taskArray[_id].text = data;
                    changeState(taskArray[_id].state, taskArray[_id]._id, taskArray[_id].text);
                    edit.remove();
                }
                else {alert("Field is empty");}
            }
        });
        edit.on('focusout', function () {
            edit.detach();
        });
    });

    function arrayAppend(selectArray) {
        remAddingTaskLi();
        let sArray;
        switch(selectArray) {
            case 'all': sArray = taskArray; break;
            case 'compl': sArray = taskArrayCompl; break;
            case 'act': sArray = taskArrayActive; break;
            default: sArray = taskArray;
        }
        sArray = sArray.slice(pageIndex*5, pageIndex*5+sizeOutput);
        sArray.forEach(function(element, index, sArray){

            task_list.append(`<li class="adding-task-li" id="${sArray[index].id}">
                                        <input class="input-click" type="checkbox" id="taskInput${sArray[index].id}">
                                        <label for="taskInput${sArray[index].id}">
                                        </label>
                                        <span id="span${sArray[index].id}">${sArray[index].text}</span>
                                        <button class="btn del">Del</button></li>`);
            if (sArray[index].state === true) {
                $(`[id = taskInput${sArray[index].id}]`).prop('checked', true);
            }

        });
    }

    function output(pageIndexClick, Array) {
        pageIndex = pageIndexClick === undefined ? 0 : pageIndexClick;
        let x = Array.length/5;
        x = Math.trunc(x);
        if (pageIndexClick === undefined || pageIndexClick === x)
        {
            sizeOutput = Array.length % 5;
        }
        else
        {
            sizeOutput = 5;
        }
    }

    //вывод всех тасков функция
    function allOutput(pageIndexClick) {
        idRecount();
        findChecked();
        output(pageIndexClick, taskArray);
        arrayAppend('all');
    }

    function complOutput(pageIndexClick) {
        idRecount();
        taskArrayCompl = _.reject(taskArray, function (i) {
            return i.state === false;
        });
        output(pageIndexClick, taskArrayCompl);
        arrayAppend('compl');
        taskInput.prop('checked', true);
    }

    function activeOutput(pageIndexClick) {
        idRecount();
        taskArrayActive = _.filter(taskArray, function (i) {
            return i.state === false;
        });
        output(pageIndexClick, taskArrayActive);
        arrayAppend('act');
        taskInput.prop('checked', false);
    }

    // вывод всех тасков
    $('#all').on('click', function () {
        allOutput(0);
        pagination2('alltasks', taskArray);
    });
    // вывод завершенных тасков
    $('#completed').on('click', function () {
        complOutput(0);
        pagination2('compltasks', taskArrayCompl);
    });

    // вывод активных тасков
    $('#active').on('click', function () {
        activeOutput(0);
        pagination2('acttasks', taskArrayActive);
    });

    //пагинация для отображения тасков отдельно
    function pagination2(buttonid, array){
        pageIndex = 0;
        $('.pageIndex').remove();
        let pages = `<li class="pageIndex" id="pageIndex${pageIndex}"><button value="${pageIndex}" class="${buttonid} btnpage btn">${pageIndex + 1}</button></li>`;
        for(let i=1; i<array.length/5; i++)
        {
            pageIndex = i;
            pages += `<li class="pageIndex" id="pageIndex${pageIndex}"><button value="${pageIndex}" class="${buttonid} btnpage btn">${pageIndex + 1}</button></li>`;
        }
        $('.pagingControlsList').html(pages);
    }

    function forPagingControls(value) {
        idxx = value;
        remAddingTaskLi();
    }

    pagingControls.on('click', '.alltasks', function () {
        forPagingControls($(this).attr('value'));
        allOutput(idxx);
    });
    pagingControls.on('click', '.compltasks', function () {
        forPagingControls($(this).attr('value'));
        complOutput(idxx);
    });

    pagingControls.on('click', '.acttasks', function () {
        forPagingControls($(this).attr('value'));
        activeOutput(idxx);
    });

    function remAddingTaskLi(){
        let adding_task_li = $('.adding-task-li');
        adding_task_li.remove();
    }
});




