const API_URL = 'https://jsonplaceholder.typicode.com/users';

const userList = document.getElementById('userList');
const spinner = document.getElementById('spinner');
const userForm = document.getElementById('userForm');

function showSpinner(show) {
  spinner.style.display = show ? 'block' : 'none';
}

// Загружаем список пользователей
async function loadUsers() {
  userList.innerHTML = ''; // очистка
  showSpinner(true);
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    if (users.length === 0) {
      userList.innerHTML = '<li>No users found.</li>';
    } else {
      users.forEach(user => createUserElement(user));
    }
  } catch (err) {
    console.error('Ошибка при загрузке:', err);
  } finally {
    showSpinner(false);
  }
}

// Создание одного элемента пользователя
function createUserElement(user) {
  const li = document.createElement('li');

  const nameInput = document.createElement('input');
  nameInput.value = user.name || '';
  const emailInput = document.createElement('input');
  emailInput.value = user.email || '';
  const phoneInput = document.createElement('input');
  phoneInput.value = user.phone || '';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.onclick = () => updateUser(user.id, {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.backgroundColor = '#e74c3c';
  deleteBtn.onclick = () => deleteUser(user.id, li);

  li.append(nameInput, emailInput, phoneInput, saveBtn, deleteBtn);
  userList.appendChild(li);
}

// Обновление пользователя (PUT)
async function updateUser(id, updatedUser) {
  showSpinner(true);
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });
    if (!res.ok) throw new Error('Failed to update user');
    console.log('Updated user', id);
  } catch (err) {
    console.error('Ошибка при обновлении:', err);
  } finally {
    showSpinner(false);
  }
}

// Удаление пользователя (DELETE)
async function deleteUser(id, liElement) {
  showSpinner(true);
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete user');
    userList.removeChild(liElement);
  } catch (err) {
    console.error('Ошибка при удалении:', err);
  } finally {
    showSpinner(false);
  }
}

// Добавление нового пользователя (POST)
userForm.onsubmit = async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const newUser = { name, email, phone };

  showSpinner(true);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const createdUser = await res.json();
    createUserElement({ ...newUser, id: createdUser.id || Date.now() });
    userForm.reset();
  } catch (err) {
    console.error('Ошибка при добавлении:', err);
  } finally {
    showSpinner(false);
  }
};

// Загружаем пользователей при загрузке страницы
window.onload = loadUsers;
