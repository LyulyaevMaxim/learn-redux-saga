import { put, call } from "redux-saga/effects";

// задача, извлекающая данные с сервера
export function* fetchData(action) {
  try {
    const data = yield call(Api.fetchUser, action.payload.url);
    yield put({ type: "FETCH_SUCCEEDED", data });
  } catch (error) {
    yield put({ type: "FETCH_FAILED", error });
  }
}

// при нажатии на button будем отправлять "FETCH_REQUESTED"
// на каждый такой action будет вызываться задача fetchData
function* watchFetchData() {
  // takeEvery - позволяет запускать дополнительные fetchData,
  // параллельно с ещё не завершёнными fetchData из ранее запущенных
  // yield takeEvery('FETCH_REQUESTED', fetchData)

  // takeLatest - получаем ответ только на последний запрос
  // запуск задачи заново прерывает выполнение незавершённых копий из ранее запущенных
  yield takeLatest("FETCH_REQUESTED", fetchData);
}
