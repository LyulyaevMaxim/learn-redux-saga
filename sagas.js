import { delay } from "redux-saga";
import { put, takeEvery, all, call } from "redux-saga/effects";

function* helloSaga() {
  console.log("Hello Sagas!");
}

// worker Saga: выполнит задачу асинхронного инкремента
export function* incrementAsync() {
  yield call(delay, 1000);
  yield put({ type: "INCREMENT" });
}

// watcher Saga: создаст новую задачу incrementAsync для каждого INCREMENT_ASYNC
function* watchIncrementAsync() {
  yield takeEvery("INCREMENT_ASYNC", incrementAsync);
}

// экспортируем только rootSaga, являющуюся точкой входа для запуска всех саг
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
