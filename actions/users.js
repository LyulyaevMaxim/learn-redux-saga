// если есть несколько саг, наблюдающих за разными действиями
// можно создать несколько наблюдателей с помощью встроенных помощников
// таким образом мы можем запустить несколько саг в фоновом режиме
function* fetchUsers(action) {}
function* createUser(action) {}

// используйте их параллельно
export default function* rootSaga() {
  yield takeEvery("FETCH_USERS", fetchUsers);
  yield takeEvery("CREATE_USER", createUser);
}
