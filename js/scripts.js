$(document).ready(function(){				
	'use strict';
	let todos = getStorage();				
	$(todos).each(function(index, todo) {
		createTodo('todos', todo);
	});
	
	$('#todoInput').on('input', function() {			//если в Input введенно меньше 3 символов - блокируем кнопку add
		if ($(this).val().length > 3) {
			$('#addBtn').attr('disabled', false);
		} else {
			$('#addBtn').attr('disabled', true);
		}
	})
	$('form').on('submit', function(e) {
		e.preventDefault();							//после submit на form предотвращаем дейст.брауз.по умолч.(отправку)
		let str = $('#todoInput').val();			//в str кладем введенное в Input значение
		createTodo('todos', str);					//создаем задачу в todos, записываем в хранилище 
		createTaskAtStorage(str);
		$('#todoInput').val('');
		$('#addBtn').attr('disabled', true);		//делаем кнопку add снова disabled
	});
	$('body').on('change', '[type="checkbox"]', function() {    //когда change на checkbox - преместить задачу в completed
		moveTodo($(this).parents('li'));
	});
	$('body').on('click', '.deleteBtn', function() {   //когда click на deleteBtn - функ удалить задачу
		removeTodo($(this).parents('li'));
	});
	$('body').on('click', '.editBtn', function() {    //когда click на editBtn - функ редактировать задачу
		editTodo($(this).parents('li'));
	});
	$('body').on('click', '.cancelBtn', function() {  //когда click на cancelBtn - функ отменить ред-ние задачи
		cancelTodo($(this).parents('li'));
	});
	$('body').on('click', '.saveBtn', function() {    //когда click на saveBtn - функ сохранить 
		saveTodo($(this).parents('li'));
	});
	function createTodo(target, text) {      //создаем стандартный html Todo
		let html = `
			<li style="display: none;">							 
				<label>
					<input type="checkbox" class="checkbox">
					<span>${text}</span>
				</label>
				<input type="text" value="${text}" style="display: none;">
				<br><button class="editBtn">Edit</button>
				<button class="deleteBtn">Delete</button>
				<br><button class="saveBtn" style="display: none;">Save</button>
				<button class="cancelBtn" style="display: none;">Cancel</button>
			</li>`;
		if (target == 'completed') {		//создаем  html Todo на случай списка completed
			html = `
				<li style="display: none;">
					<span>${text}</span>
					<br><button class="deleteBtn">Delete</button>
				</li>`; 
		}
		$(`#${target}`).append(html)
					   .find('li[style="display: none;"]')
					   .fadeIn();
	}
	function moveTodo(li) {										//функция перемещения todo в список completed
		let text = li.find('span').text();
		createTodo('completed', text);
		removeTodo(li);
	}
	function removeTodo(todo) {									//функция удаления todo
		deleteTaskFromStorage(todo.find('span').text());
		todo.remove();
	}
	function editTodo(li) {										//функ редактирования, label прячем, инпут показываем
		li.find('label,.editBtn,.deleteBtn')					//прячем и показываем кнопки
		  .hide();
		li.find('[type="text"],.saveBtn,.cancelBtn')
		  .fadeIn();
	}
	function cancelTodo(li) {									//функ отмены: убираем инпут, ставим на место прежний label с кнопками
		li.find('[type="text"],.saveBtn,.cancelBtn')
		  .hide();
		li.find('label,.editBtn,.deleteBtn')
		  .fadeIn();
	}
	function saveTodo(li) {										//функ сохранения
		let str = li.find('[type="text"]').val();				
		if (str.length) {
			updateTaskAtStorage(li.find('span').text(), str);	//если символы введены, перезаписываем
			li.find('span').text(str);
			cancelTodo(li);										//вызываем cancelTodo
		} else {
			removeTodo(li);										//если ничего не введено - удаляем
		}
	}
	function createTaskAtStorage(todo) {						//функ созд задач в хранилище
		let arrayOfTodos = getStorage();						//в getStorage пушим todo, сохраняем
		arrayOfTodos.push(todo);
		setStorage(arrayOfTodos);
	}
	function updateTaskAtStorage(oldTodo, newTodo) {			// функ изменения задач в хранилище
		let arrayOfTodos = getStorage();						// 
		arrayOfTodos.forEach(function(strOfTodo, index) {
			if (strOfTodo == oldTodo.trim()) {
				arrayOfTodos[index] = newTodo.trim();
			}
		});
		setStorage(arrayOfTodos);
	}
	function deleteTaskFromStorage(todo) {						//функ удаления todo из массива Todos с пом. splice
		
		let arrayOfTodos = getStorage(),
			index = arrayOfTodos.indexOf(todo.trim());
		if (index > -1) {
			arrayOfTodos.splice(index, 1);
		}
		setStorage(arrayOfTodos);
	}
	function getStorage() {												//функ getStorage
		let strOfTodos = localStorage.getItem('todos');					//получаем todos, записываем их в строку через '**'
		let arrayOfTodos = strOfTodos ? strOfTodos.split('**') : [];
		return arrayOfTodos;
	}
	function setStorage(arrayOfTodos) {						//функ setStorage
		let strOfTodos = arrayOfTodos.join('**');			//записываем arrayOfTodos в localStorage
		localStorage.setItem('todos', strOfTodos);
	}
});