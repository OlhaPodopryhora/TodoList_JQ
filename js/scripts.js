$(document).ready(function(){
	'use strict';
	let todos = getStorage();
	$(todos).each(function(index, todo) {
		createTodo('todos', todo);
	});
	
	$('#todoInput').on('input', function() {
		if ($(this).val().length > 3) {
			$('#addBtn').attr('disabled', false);
		} else {
			$('#addBtn').attr('disabled', true);
		}
	})
	$('form').on('submit', function(e) {
		e.preventDefault();
		let str = $('#todoInput').val();
		createTodo('todos', str);
		createTaskAtStorage(str);
		$('#todoInput').val('');
		$('#addBtn').attr('disabled', true);
	});
	$('body').on('change', '[type="checkbox"]', function() {
		moveTodo($(this).parents('li'));
	});
	$('body').on('click', '.deleteBtn', function() {
		removeTodo($(this).parents('li'));
	});
	$('body').on('click', '.editBtn', function() {
		editTodo($(this).parents('li'));
	});
	$('body').on('click', '.cancelBtn', function() {
		cancelTodo($(this).parents('li'));
	});
	$('body').on('click', '.saveBtn', function() {
		saveTodo($(this).parents('li'));
	});
	function createTodo(target, text) {
		let html = `
			<li style="display: none;">							 
				<label>
					<input type="checkbox">
					<span>${text}</span>
				</label>
				<input type="text" value="${text}" style="display: none;">
				<button class="editBtn">Edit</button>
				<button class="deleteBtn">Delete</button>
				<button class="saveBtn" style="display: none;">Save</button>
				<button class="cancelBtn" style="display: none;">Cancel</button>
			</li>`;
		if (target == 'completed') {
			html = `
				<li style="display: none;">
					${text}
					<button class="deleteBtn">Delete</button>
				</li>`; 
		}
		$(`#${target}`).append(html)
					   .find('li[style="display: none;"]')
					   .fadeIn();
	}
	function moveTodo(li) {
		let text = li.find('span').text();
		createTodo('completed', text);
		removeTodo(li);
	}
	function removeTodo(todo) {
		deleteTaskFromStorage(todo.find('span').text());
		todo.remove();
	}
	function editTodo(li) {
		li.find('label,.editBtn,.deleteBtn')
		  .hide();
		li.find('[type="text"],.saveBtn,.cancelBtn')
		  .fadeIn();
	}
	function cancelTodo(li) {
		li.find('[type="text"],.saveBtn,.cancelBtn')
		  .hide();
		li.find('label,.editBtn,.deleteBtn')
		  .fadeIn();
	}
	function saveTodo(li) {
		let str = li.find('[type="text"]').val();
		if (str.length) {
			updateTaskAtStorage(li.find('span').text(), str);
			li.find('span').text(str);
			cancelTodo(li);
		} else {
			removeTodo(li);
		}
	}
	function createTaskAtStorage(todo) {
		let arrayOfTodos = getStorage();
		arrayOfTodos.push(todo);
		setStorage(arrayOfTodos);
	}
	function updateTaskAtStorage(oldTodo, newTodo) {
		let arrayOfTodos = getStorage();
		arrayOfTodos.forEach(function(strOfTodo, index) {
			if (strOfTodo == oldTodo.trim()) {
				arrayOfTodos[index] = newTodo.trim();
			}
		});
		setStorage(arrayOfTodos);
	}
	function deleteTaskFromStorage(todo) {
		
		let arrayOfTodos = getStorage(),
			index = arrayOfTodos.indexOf(todo.trim());
		if (index > -1) {
			arrayOfTodos.splice(index, 1);
		}
		setStorage(arrayOfTodos);
	}
	function getStorage() {
		let strOfTodos = localStorage.getItem('todos');
		let arrayOfTodos = strOfTodos ? strOfTodos.split('**') : [];
		return arrayOfTodos;
	}
	function setStorage(arrayOfTodos) {	
		let strOfTodos = arrayOfTodos.join('**');
		localStorage.setItem('todos', strOfTodos);
	}
});