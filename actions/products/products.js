import { takeEvery, call, put } from "redux-saga/effects";

// сага, наблюдающая за действием PRODUCTS_REQUESTED
// при каждом action === 'PRODUCTS_REQUESTED', запускается fetchProducts
export function* watchFetchProducts() {
  yield takeEvery("PRODUCTS_REQUESTED", fetchProducts);
}

function* fetchProducts() {
  try {
    const products = yield call(fetch, "api.com/products");
    // передадим dispatch, сообщающий, что данные получены успешно
    yield put({ type: "PRODUCTS_RECEIVED", products });
  } catch (error) {
    yield put({ type: "PRODUCTS_REQUEST_FAILED", error });
  }
}

/* однако необязательно обрабатывать ошибки API внутри try-catch
   можно как и делал, обрабатывать это в API
*/
function fetchProductsApi() {
  return fetch("/products")
    .then(response => ({ response }))
    .catch(error => ({ error }));
}

// function* fetchProducts() {
//   const { response, error } = yield call(fetchProductsApi)
//   if (response)
//     yield put({ type: 'PRODUCTS_RECEIVED', products: response })
//   else
//     yield put({ type: 'PRODUCTS_REQUEST_FAILED', error })
// }
